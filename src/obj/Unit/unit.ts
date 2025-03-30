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
	}
	_mm:UnitMemory
	get memory():UnitMemory{
		if (OLD_MEMORY&&this._mm) return this._mm
		else return (this._mm=Memory.units[this._name])
	}

	private static units:{[rn:string]:Unit}={}
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
}

export class TaskUnit extends Unit{
	theTask:UnitTask<any>

	run() {
		if(super.run()) return 1
		let result
		while (this.theTask){
			result=this.theTask.run()
			if (!result) break
			//TODO 处理result

			if (this.memory.taskQueue.length){
				this.memory.currTask=this.memory.taskQueue.shift()
				this.theTask=Tasks.harvest(this,(this.getTaskMem(UnitTaskType.HARVEST) as HarvestTaskMem).src)
			}else {
				delete this.theTask
				delete this.memory.currTask
			}
		}
	}

	get memory():TaskUnitMemory{
		return super.memory as TaskUnitMemory
	}

	getTaskMem(type:UnitTaskType):TaskMemory {
		return this.memory.taskData[type]||(this.memory.taskData[type]={} as TaskMemory)
	}
	addTask(task:UnitTask<any>){
		this.memory.taskQueue.push(task.type)
		if (!this.theTask){
			this.theTask=task
			this.memory.currTask=task.type
		}
	}
}

export class UnitTask<memType extends TaskMemory>{
	unit:TaskUnit
	type:UnitTaskType
	constructor(type:UnitTaskType, unit:TaskUnit) {
		this.unit=unit
		this.type=type
		if (!this.unit.memory.taskData[this.type]) this.unit.memory.taskData[this.type]={} as TaskMemory

	}

	_mm:memType
	get memory():memType{
		if (OLD_MEMORY&&this._mm) return this._mm
		else return (this._mm=this.unit.memory.taskData[this.type] as memType)
	}

	run():number{
		return 0
	}

	// sleep(time:number){
	//     this.memory.sleep=time
	// }
	// isSleep():boolean{
	//     return --this.memory.
	// }
}
export const Tasks={
	allUnitTask:{},
	harvest(unit:TaskUnit,srcId:Id<Source>){
		return new this.allUnitTask[UnitTaskType.HARVEST](unit,srcId)
	}
}

XFrame.addMount(()=>{
	class HarvestTask extends UnitTask<HarvestTaskMem>{
		constructor(unit:TaskUnit,srcId:Id<Source>) {
			super(UnitTaskType.HARVEST,unit);
			this.memory.src=srcId
			this.memory.mineNum=unit.creep.bodyInfo()[WORK]*2
			const source=Game.getObjectById(srcId)
			this.updStore(source,source.pos.findInRange(FIND_STRUCTURES,2))

		}

		run() {
			super.run();
			const source=Game.getObjectById(this.memory.src),creep=this.unit.creep
			if (creep.pos.isNearTo(source)){
				if (creep.store.getFreeCapacity()>this.memory.mineNum) creep.harvest(source)
			}else {
				this.unit.creep.moveTo(Game.getObjectById(this.memory.src))
			}


			return 0
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
	class GotoTask extends UnitTask<GotoTaskMem>{

	}

	Tasks.allUnitTask[UnitTaskType.HARVEST]=HarvestTask
})
