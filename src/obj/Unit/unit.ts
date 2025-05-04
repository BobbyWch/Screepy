import {WorkGroup} from "@/obj/WorkGroup/workgroup";
import {OLD_MEMORY, XFrame} from "@/framework/frame";
import {Colony} from "@/obj/Colony/colony";
import {uu} from "@/modules/util";

export class Unit implements RuntimeObject{
	group:WorkGroup<any>

	update():void {
		this.creep = Game.creeps[this._name]
	}

	run(): undefined|number {
		if (this.memory.sleep) {
			if (--this.memory.sleep) return 1
			else delete this.memory.sleep
		}

		if (this.memory.inQueue){

		}
		console.log("Unit base:"+this._name)
	}
	_mm:UnitMemory
	get memory():UnitMemory{
		if (OLD_MEMORY&&this._mm) return this._mm
		else return (this._mm=Memory.units[this._name])
	}

	static units:{[rn:string]:Unit}={}
	static get(creep:Creep):Unit{
		return this.units[creep.name]||(this.units[creep.name]=new Unit(creep.name,creep.memory.belong))
	}

	creep:Creep

	public constructor(name:string,home:string) {
		this._name=name
		if (!Memory.units[name]){
			if (home){
				Memory.units[name]={home} as UnitMemory
			}else throw new Error("missing home")
		}
		if (this.memory.group) this.group=Colony.get(Game.rooms[home]).workGroups[this.memory.group]

		Unit.units[name]=this
	}

	_name: string;

	sleep(time:number){
		this.memory.sleep=time
	}
	notSpawned():boolean{
		return !this.creep||this.creep.spawning
	}
}

export class TaskUnit extends Unit{
	theTask:Task<any>
	taskCache:{[key:number]:Task<any>}

	constructor(n1:string,n2:string) {
		super(n1,n2);
		this.taskCache={}
		if (this.memory.currTask) this.theTask=Tasks.recover(this.memory.currTask,this)
		if (!this.memory.taskData) this.memory.taskData={}
		if (!this.memory.taskQueue) this.memory.taskQueue=[]
	}

	run() {
		if(super.run()) return 1
		let result
		while (this.theTask){
			result=this.theTask.run()
			console.log("run:"+this.theTask.type,result)
			if (!result) break
			//TODO 处理result

			switch (result){
				case CC.taskNext:
					this.theTask=this.getTask(this.memory.currTask)
					continue
			}
			if (this.memory.taskQueue.length){
				this.memory.currTask=this.memory.taskQueue.shift()
				this.theTask=Tasks.harvest(this,(this.getTaskMem(TaskType.HARVEST) as HarvestTaskMem).src)
			}else {
				delete this.theTask
				delete this.memory.currTask
			}
		}
		console.log("TaskUnit:"+this._name)
	}

	get memory():TaskUnitMemory{
		return super.memory as TaskUnitMemory
	}

	getTaskMem(type:TaskType):TaskMemory {
		return this.memory.taskData[type]||(this.memory.taskData[type]={} as TaskMemory)
	}
	addTask(task:Task<any>){
		this.memory.taskQueue.push(task.type)
		this.taskCache[task.type]=task
		if (!this.theTask){
			this.theTask=task
			this.memory.currTask=task.type
		}
	}
	insertTask(task:Task<any>){
		this.taskCache[task.type]=task
		this.memory.taskQueue.unshift(task.type)
	}
	getTask(type:TaskType):Task<any>|null{
		if (this.taskCache[type]) return this.taskCache[type]
		else if (this.memory.taskData[type]) return Tasks.recover(type,this)
		else return null
	}
}

export class Task<memType extends TaskMemory>{
	unit:TaskUnit
	type:TaskType
	constructor(type:TaskType, unit:TaskUnit) {
		this.unit=unit
		this.type=type
		if (!this.unit.memory.taskData[this.type]) this.unit.memory.taskData[this.type]={} as TaskMemory

	}

	_mm:memType
	get memory():memType{
		if (OLD_MEMORY&&this._mm) return this._mm
		else return (this._mm=this.unit.memory.taskData[this.type] as memType)
	}

	run(){
		// return CC.taskOK
	}

	// sleep(time:number){
	//     this.memory.sleep=time
	// }
	// isSleep():boolean{
	//     return --this.memory.
	// }
}
export class HarvestTask extends Task<HarvestTaskMem>{
	constructor(unit:TaskUnit) {
		super(TaskType.HARVEST,unit);
	}
	init(srcId:Id<Source>){
		this.memory.src=srcId
		this.memory.mineNum=(this.unit.memory.body.data as ZippedBodyInfo).find(b=>b[0]==WORK)[1]*2
		const source=Game.getObjectById(srcId)
		this.updStore(source,source.pos.findInRange(FIND_STRUCTURES,2))
		this.memory.init=true
	}

	run() {
		super.run();
		if (this.unit.notSpawned()) return
		const source=Game.getObjectById(this.memory.src),creep=this.unit.creep
		if (creep.pos.isNearTo(source)){
			if (creep.store.getFreeCapacity()>this.memory.mineNum) creep.harvest(source)
		}else {
			this.unit.creep.moveTo(Game.getObjectById(this.memory.src))
		}


		return CC.taskOK
	}

	updStore(source:Source,ss:Structure[]){
		let store=
			uu.findPriority(ss,[STRUCTURE_LINK,STRUCTURE_CONTAINER],"structureType") as StructureLink|StructureContainer
		if (store){
			this.memory.state=store.structureType==STRUCTURE_LINK?CC.harvestStateLink:CC.harvestStateContainer
			this.memory.store=store.id
		}else {
			const site=uu.findPriority(source.pos.findInRange(FIND_CONSTRUCTION_SITES,2)
				,[STRUCTURE_LINK,STRUCTURE_CONTAINER],"structureType") as ConstructionSite<STRUCTURE_LINK|STRUCTURE_CONTAINER>
			if (site){
				this.memory.store=site.id
				this.memory.state=CC.harvestStateSite
			}else this.memory.state=CC.harvestStateDrop
		}
	}
}
export class GotoTask extends Task<GotoTaskMem>{
	pos:RoomPosition
	constructor(unit:TaskUnit) {
		super(TaskType.GOTO,unit);
		if (this.memory.init){
			this.pos=uu.unzipPos(this.memory.zipPos) as RoomPosition
		}
	}
	init(pos:RoomPosition,range?:number){
		this.pos=pos
		this.memory.range=range||1
		this.memory.zipPos=uu.zipPos(pos)
		this.memory.init=true
	}
}

export const Tasks={
	allTasks:{},
	/**
	 * 从重启后恢复task
	 */
	recover(type:TaskType,unit:TaskUnit):Task<any>{
		return new this.allTasks[type](unit)
	},
	harvest(unit:TaskUnit,srcId:Id<Source>):Task<HarvestTaskMem>{
		const t=new HarvestTask(unit)
		t.init(srcId)
		return t
	},
	goto(unit:TaskUnit,pos:RoomPosition,range?:number):Task<GotoTaskMem>{
		const t=new GotoTask(unit)
		t.init(pos, range)
		return t
	}
}
Tasks.allTasks[TaskType.HARVEST]=HarvestTask
Tasks.allTasks[TaskType.GOTO]=GotoTask
