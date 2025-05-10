import {Unit} from "@/obj/Unit/unit";
import {Colony} from "@/obj/Colony/colony";
import {OLD_MEMORY, XFrame} from "@/framework/frame";
import {Roles} from "@/obj/Colony/parts/hatchery";
import {uu} from "@/modules/util";
import {Tasks} from "@/obj/Unit/tasks/task";


export class WorkGroup<memType extends WorkGroupMemory> implements RuntimeObject{
	units:{[role:string]:Unit[]};
	// plan:WorkerPlan;
	colony:Colony;
	type:WorkGroupType

	protected constructor(colony:Colony, type:WorkGroupType) {
		this.colony = colony
		this.type = type
		this.units = {}
		if (!this.memory) {
			this.colony.memory.workGroup[this.type] = {units: {}} as WorkGroupMemory
		}
		let key
		for (key in this.memory.units) {
			this.units[key] = this.memory.units[key].map(un => Unit.units[un])
		}
	}
	run(){

	}

	update(): void {
		
	}
	_mm:memType
	get memory():memType{
		if (OLD_MEMORY&&this._mm) return this._mm
		else return (this._mm=this.colony.memory.workGroup[this.type] as memType)
	}

	static wgClasses={}
	static createByType(colony:Colony,type:WorkGroupType):WorkGroup<any>{
		return new WorkGroup.wgClasses[type](colony)
	}

	addUnit(unit:Unit){
		if (!this.units[unit.memory.role]) this.units[unit.memory.role]=[]
		this.units[unit.memory.role].push(unit)
		if (!this.memory.units[unit.memory.role]) this.memory.units[unit.memory.role]=[]
		this.memory.units[unit.memory.role].push(unit._name)
	}
	removeUnit(unit:Unit){
		uu.arrayRemove(unit,this.units[unit.memory.role])
		uu.arrayRemove(unit._name,this.memory.units[unit.memory.role])
	}
	roleNum(role:string):number{
		if (!this.units[role]) return 0
		return this.units[role].length
	}

}
XFrame.addMount(()=>{
	// class NumedGroup extends WorkGroup{
	// 	num:number
	//
	// }

	// class UpgradeGroup extends WorkGroup{
	// 	constructor(colony:Colony) {
	// 		super(colony,WorkGroupType.UPGRADE);
	// 	}
	//
	//
	// }
	class HarvestGroup extends WorkGroup<HarvestGMemory> {
		constructor(colony: Colony) {
			super(colony, WorkGroupType.HARVEST);
			if (!this.memory.num){
				this.memory.num=this.colony.sources().length
			}
		}
		run() {
			if (this.roleNum(Roles.harvester)<this.memory.num){
				let unit=this.colony.hatchery.createUnit(Roles.harvester)

				unit.addTask(Tasks.harvest(unit,this.colony.sources()[0].id))
				unit.setRole(Roles.harvester)
				this.addUnit(unit)
				// this.units[Roles.harvester].push(this.colony.hatchery.spawn({_role:Roles.harvester}))
			}
		}
	}
	// WorkGroup.wgClasses[WorkGroupType.UPGRADE]=UpgradeGroup
	WorkGroup.wgClasses[WorkGroupType.HARVEST]=HarvestGroup

},true)
