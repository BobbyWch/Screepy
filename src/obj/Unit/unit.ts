import {WorkGroup} from "@/obj/WorkGroup/workgroup";
import {OLD_MEMORY} from "@/framework/frame";
import {Colony} from "@/obj/Colony/colony";
import {Task, taskName, Tasks} from "@/obj/Unit/tasks/task";
import {Colors, Logger} from "@/modules/Logger";
import {Runtime} from "@/framework/runtime";
import {uu} from "@/modules/util";

export class Unit implements RuntimeObject,CanEqual{
	group:WorkGroup<any>
	pos:RoomPosition

	update():void {
		this.creep = Game.creeps[this._name]
		if (this.creep){
			this.pos=this.creep.pos
		}
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
		else {
			return (this._mm = Memory.units[this._name])
		}
	}

	static units:{[rn:string]:Unit}={}
	static get(creepName:string):Unit{
		return this.units[creepName]||(this.units[creepName]=new Unit(creepName,Memory.creeps[creepName].belong))
	}

	creep:Creep

	public constructor(name:string,home:string) {
		this._name=name
		if (!this.memory){
			if (home){
				Memory.units[name]={
					home,
					reg:{}
				} as UnitMemory
				Runtime.addUnit(this)
			}else throw new Error("missing home name:"+name)
		}
		if (this.memory.group) this.group=Colony.get(home).getWorkGroup(this.memory.group)

		Unit.units[name]=this
	}

	_name: string;

	sleep(time:number){
		this.memory.sleep=time
	}
	notSpawned():boolean{
		return !this.creep||this.creep.spawning
	}
	setRole(role:string){
		if (this.group) this.group.removeUnit(this)
		this.memory.role=role
		//先删再加
		if (this.group) this.group.addUnit(this)
	}

	/**
	 * 销毁对象的准备
	 */
	finalize(){
		Runtime.removeUnit(this)
		if (this.group){
			this.group.removeUnit(this)
		}
		if (this.memory.reg.mineSite){//TODO carry num 0?
			console.log("finalize",JSON.stringify(this.memory.reg.mineSite))
			if (this.memory.reg.mineSite.num<0) {
				this.home().mineSites.find(m=>m.id==this.memory.reg.mineSite.id).unRegWork(this)
			}else {
				this.home().mineSites.find(m => m.id == this.memory.reg.mineSite.id).unRegGetter(this)
			}
		}
		delete Unit.units[this._name]
		delete Memory.units[this._name]
		this._mm=null
		this.group=null
	}

	equal(obj: any): boolean {
		return this._name==obj["_name"];
	}
	home():Colony{
		return Colony.get(this.memory.home)
	}
	_bif:{[part:string]:number}
	bodyInfo():{[part:string]:number}{
		if (!this._bif){
			const result={}

			if (this.memory.body.type==BodyGenType.ZIP){
				const data=this.memory.body.data as ZippedBodyInfo
				for (let ind = 0; ind < data.length; ind++) {
					if (!result[data[ind][0]]) result[data[ind][0]]=0
					result[data[ind][0]]+=data[ind][1]
				}
			}else {
				const data=this.memory.body.data as BodyPartConstant[]
				for (let ind = 0; ind < data.length; ind++) {
					if (!result[data[ind]]) result[data[ind]]=0
					result[data[ind]]++
				}
			}
			this._bif=result
		}
		return this._bif
	}
}

export class TaskUnit extends Unit{
	lastRun:any//TODO test
	theTask:Task<any>
	taskCache:{[key:number]:Task<any>}

	drawY:number

	constructor(n1:string,n2:string) {
		super(n1,n2);
		this.taskCache={}
		if (this.memory.currTask) this.theTask=Tasks.recover(this.memory.currTask,this)
		if (!this.memory.taskData) this.memory.taskData={}
		if (!this.memory.taskQueue) this.memory.taskQueue=[]
	}

	run() {
		if(super.run()||!this.creep) return 1
		this.drawY=0

		let result
		let i=0
		while (this.theTask){
			if (i++==7){
				Logger.err("skip out!")
				break
			}
			if (this.theTask.type!=this.lastRun) console.log(this._name,"run:"+taskName(this.theTask.type))
			result=this.theTask.run()
			this.drawTask(this.theTask)
			this.lastRun=this.theTask.type
			if (!result) break
			switch (result){
				case CC.taskHang:
					Logger.log(this._name+" "+taskName(this.theTask.type)+" hang",Colors.yellow)
					this.memory.currTask=this.memory.taskQueue[0]
					this.theTask=this.getTask(this.memory.currTask)

					continue
				case CC.taskReDo://重新跑一边
					continue
				case CC.taskFinish:
					Logger.log(this._name+" "+taskName(this.theTask.type)+" finish",Colors.green)
					break
			}
			delete this.taskCache[this.theTask.type]
			delete this.memory.taskData[this.theTask.type]
			if (this.memory.taskQueue.length){
				uu.arrayRemove(this.theTask.type,this.memory.taskQueue)
				this.memory.currTask=this.memory.taskQueue[0]
				this.theTask=this.getTask(this.memory.currTask)
			}else {
				delete this.theTask
				delete this.memory.currTask
			}
		}
	}

	get memory():TaskUnitMemory{
		return super.memory as TaskUnitMemory
	}

	getTaskMem(type:TaskType):TaskMemory {
		return this.memory.taskData[type]||(this.memory.taskData[type]={} as TaskMemory)
	}
	addTask(task:Task<any>){
		console.log(this._name,"add",taskName((task.type)))
		this.memory.taskQueue.push(task.type)
		this.taskCache[task.type]=task
		if (!this.theTask){
			this.theTask=task
			this.memory.currTask=task.type
		}
	}

	/**
	 * 在队列顶端插入
	 * 不会强制切换task
	 * @param task
	 */
	insertTask(task:Task<any>){
		console.log(this._name,"insert",task.type)
		this.taskCache[task.type]=task
		this.memory.taskQueue.unshift(task.type)
	}
	getTask(type:TaskType):Task<any>|null{
		if (this.taskCache[type]) return this.taskCache[type]
		else if (this.memory.taskData[type]) return Tasks.recover(type,this)
		else return null
	}
	derX:number

	derY:number
	colorId:number
	drawTask(task:Task<any>){
		if (!this.colorId) this.colorId=0|(taskColors.length*Math.random())
		if (!this.derX) this.derX=0|(Math.random()*6-5)
		if (!this.derY) this.derY=0|(Math.random()*6-5)
		const pos=safePos(this.pos.x+this.derX,this.pos.y+this.derY+this.drawY,this.creep.room.name)
		this.drawY++
		this.creep.room.visual.text(taskName(task.type),pos,{color:taskColors[this.colorId],opacity:0.7})
		this.creep.room.visual.line(this.creep.pos,pos)
	}
}
function safePos(x,y,rn){
	if (x<0) x=0
	else if (x>50) x=50
	if (y<0) y=0
	else if (y>50) y=50
	return new RoomPosition(x,y,rn)
}
const taskColors=[
	'#ff0202',
	'#ff6200',
	'#ffcc00',
	'#bfff00',
	'#48ff00',
	'#00ffc4',
	'#0095ff',
	'#003cff',
	'#5e00ff',
	'#aa00ff',
	'#e83c7e',
]


