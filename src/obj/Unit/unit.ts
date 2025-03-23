import {WorkGroup} from "@/obj/WorkGroup/workgroup";
import {OLD_MEMORY} from "@/framework/frame";
import {UnitTask} from "@/obj/Unit/tasks/unit_task";
import {Colony} from "@/obj/Colony/colony";

export class Unit implements RuntimeObject{
	group:WorkGroup<any>

	update():void {
		this.creep = Game.creeps[this._name]
	}

	run(): void {
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
}

export class TaskUnit extends Unit{
	theTask:UnitTask<any>

	run() {
		super.run();
		let result
		while (this.theTask){
			result=this.theTask.run()
			if (!result) break
			//TODO 处理result

			if (this.memory.taskQueue.length){
				this.memory.currTask=this.memory.taskQueue.shift()
				this.theTask=UnitTask.createTask(this.memory.currTask,this)
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
		return this.memory.taskData[type]||(this.memory.taskData[type]={})
	}
}