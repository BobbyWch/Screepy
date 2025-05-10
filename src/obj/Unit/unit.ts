import {WorkGroup} from "@/obj/WorkGroup/workgroup";
import {OLD_MEMORY, XFrame} from "@/framework/frame";
import {Colony} from "@/obj/Colony/colony";
import {Task, Tasks} from "@/obj/Unit/tasks/task";

export class Unit implements RuntimeObject,CanEqual{
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

	static units:{[rn:string]:Unit}={}
	static get(creepName:string):Unit{
		return this.units[creepName]||(this.units[creepName]=new Unit(creepName,Memory.creeps[creepName].belong))
	}

	creep:Creep

	public constructor(name:string,home:string) {
		this._name=name
		if (!Memory.units[name]){
			if (home){
				Memory.units[name]={home} as UnitMemory
			}else throw new Error("missing home")
		}
		if (this.memory.group) this.group=Colony.get(home).workGroups[this.memory.group]

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
		if (this.group){
			this.group.removeUnit(this)
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
				case CC.taskHang:
					this.memory.currTask=this.memory.taskQueue[0]
					this.theTask=this.getTask(this.memory.currTask)
					continue
			}
			if (this.memory.taskQueue.length){
				this.memory.currTask=this.memory.taskQueue.shift()
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
		this.taskCache[task.type]=task
		this.memory.taskQueue.unshift(task.type)
	}
	getTask(type:TaskType):Task<any>|null{
		if (this.taskCache[type]) return this.taskCache[type]
		else if (this.memory.taskData[type]) return Tasks.recover(type,this)
		else return null
	}
}


