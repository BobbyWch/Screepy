import {Tasks, TaskUnit, Unit} from "@/obj/Unit/unit";
import {Colony} from "@/obj/Colony/colony";
import {OLD_MEMORY, XFrame} from "@/framework/frame";
import {Roles} from "@/obj/Colony/parts/hatchery";
import {uu} from "@/modules/util";


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

	addUnit(unit:Unit,role:string){
		if (!this.units[role]) this.units[role]=[]
		this.units[role].push(unit)
		if (!this.memory.units[role]) this.memory.units[role]=[]
		this.memory.units[role].push(unit._name)
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
				this.addUnit(unit,Roles.harvester)
				// this.units[Roles.harvester].push(this.colony.hatchery.spawn({_role:Roles.harvester}))
			}
		}
	}
	// WorkGroup.wgClasses[WorkGroupType.UPGRADE]=UpgradeGroup
	WorkGroup.wgClasses[WorkGroupType.HARVEST]=HarvestGroup

},true)
