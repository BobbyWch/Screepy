import {Unit} from "@/obj/Unit/unit";
import {Colony} from "@/obj/Colony/colony";
import {XFrame} from "@/framework/frame";
import {Roles} from "@/obj/Colony/parts/hatchery";


export class WorkGroup implements RuntimeObject{
	units:{[role:string]:Unit[]};
	// plan:WorkerPlan;
	colony:Colony;
	type:WorkGroupType

	constructor(colony:Colony,type:WorkGroupType) {
		this.colony=colony
		this.type=type
		if (!this.memory) {
			this.colony.memory.workGroup[this.type]={} as WorkGroupMemory
		}
	}
	run(){

	}

	update(): void {
		
	}
	get memory():WorkGroupMemory{
		return this.colony.memory.workGroup[this.type]
	}

	static wgClasses:{}
	static createByType(colony:Colony,type:WorkGroupType):WorkGroup{
		return new this.wgClasses[type](colony)
	}

}
XFrame.addMount(()=>{
	// class NumedGroup extends WorkGroup{
	// 	num:number
	//
	// }

	class UpgradeGroup extends WorkGroup{
		constructor(colony:Colony) {
			super(colony,WorkGroupType.UPGRADE);
		}

		get memory(): HarvestGMemory {
			return this.colony.memory.workGroup[WorkGroupType.UPGRADE] as HarvestGMemory
		}
	}
	class HarvestGroup extends WorkGroup {
		constructor(colony: Colony) {
			super(colony, WorkGroupType.HARVEST);
			if (!this.memory) {

				this.colony.memory.workGroup[WorkGroupType.HARVEST]={
					num:colony.room.find(FIND_SOURCES).length
				} as HarvestGMemory
			}
		}
		run() {
			if (this.units[Roles.harvester].length<this.memory.num){
				this.units[Roles.harvester].push(this.colony.hatchery.addTask({_role:Roles.harvester}))
			}
		}


		get memory(): HarvestGMemory {
			return this.colony.memory.workGroup[WorkGroupType.HARVEST] as HarvestGMemory
		}
	}
	WorkGroup.wgClasses[WorkGroupType.UPGRADE]=UpgradeGroup
	WorkGroup.wgClasses[WorkGroupType.HARVEST]=HarvestGroup

})
