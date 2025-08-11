import {TaskUnit, Unit} from "@/obj/Unit/unit";
import {Colony} from "@/obj/Colony/colony";
import {OLD_MEMORY} from "@/framework/frame";
import {Roles} from "@/obj/Colony/parts/hatchery";
import {uu} from "@/modules/util";
import {Tasks} from "@/obj/Unit/tasks/task";
import {Colors} from "@/modules/Logger";


export class WorkGroup<memType extends WorkGroupMemory> implements RuntimeObject{
	units:{[role:string]:Unit[]};
	// plan:WorkerPlan;
	colony:Colony;
	type:WorkGroupType

	protected constructor(colony:Colony, type:WorkGroupType) {
		this.colony = colony
		this.type = type
		if (!this.memory) {
			this.colony.memory.workGroup[this.type] = {units: {}} as WorkGroupMemory
		}
	}
	run(){
		if (!this.units){
			this.units = {}
			let key
			for (key in this.memory.units) {
				this.units[key] = this.memory.units[key].map(un => Unit.units[un])
			}
		}
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
	finalize(){
		let role,cs,c
		for (role in this.units){
			cs=this.units[role]
			for (c of cs){
				this.freeUnit(c)
			}
		}

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
	freeUnit(unit:Unit){
		this.removeUnit(unit)
		this.colony.addFree(unit)
		if ((unit as TaskUnit).theTask) (unit as TaskUnit).theTask.memory.noCycle=true
	}
	mallocUnit(bodyType:number){
		const u=this.colony.freeUnits.search(bodyType) as TaskUnit
		if (u){
			this.colony.freeUnits.removeUnit(u)
			if (u.theTask) {
				delete u.theTask.memory.noCycle
			}
			return u
		}
	}
	newRole(role:string):TaskUnit{
		let unit=this.colony.hatchery.createRole(role)
		unit.setRole(role)
		unit.memory.group=this.type
		unit.group=this
		this.addUnit(unit)
		return unit
	}

}
class HarvestGroup extends WorkGroup<HarvestGMemory> {
	constructor(colony: Colony) {
		super(colony, WorkGroupType.HARVEST);
		if (!this.memory.num) this.memory.num=this.workerNum()
	}
	workerNum(){
		const sources=this.colony.sources()
		let src:Source,num=0
		for (src of sources){
			num+=Math.min(3,src.pos.freeSpace())
		}
		return num
	}
	run() {
		super.run()
		if (this.colony.memory.state==ColonyState.BOOT){
			this.memory.num=this.workerNum()//TODO del
		}
		if (this.roleNum(Roles.harvester)<this.memory.num){
			let unit=this.newRole(Roles.harvester)
			const site=_.min(this.colony.mineSites,s=>s.memory.workNum)
			site.regWork(unit)
			unit.addTask(Tasks.harvest(unit,site))
		}
	}
}
class HatchFillGroup extends WorkGroup<FillGMem> {
	constructor(colony: Colony) {
		super(colony, WorkGroupType.FILL);
		if (!this.memory.num){
			this.memory.num=2
		}
	}
	run() {
		super.run()
		if (this.roleNum(Roles.spawner)<this.memory.num){
			let unit
			if (this.colony.memory.state==ColonyState.BOOT0) unit=this.colony.hatchery.createBody([CARRY,MOVE])
			else unit=this.colony.hatchery.createRole(Roles.spawner)
			unit.setRole(Roles.spawner)
			unit.memory.group=this.type
			unit.group=this
			unit.addTask(Tasks.hatchFill(unit))

			this.addUnit(unit)
			// this.units[Roles.harvester].push(this.colony.hatchery.spawn({_role:Roles.harvester}))
		}
	}
}
export class UpgradeGroup extends WorkGroup<FillGMem> {
	constructor(colony: Colony) {
		super(colony, WorkGroupType.UPGRADE);
		if (!this.memory.num){
			this.memory.num=3
		}
	}
	run() {
		super.run()
		if (this.roleNum(Roles.upgrader)<this.memory.num){
			let unit=this.newRole(Roles.upgrader)
			unit.addTask(Tasks.upgrade(unit))
		}
		if (global.Gtime%13==0){
			if (_.sum(this.colony.mineSites,s=>s.energyLeft())>1000&&this.memory.num<20) this.memory.num++
		}
	}
}
class BuildGroup extends WorkGroup<any>{
	constructor(colony: Colony) {
		super(colony, WorkGroupType.BUILD);
		if (!this.memory.num){
			this.memory.num=2
		}
	}
	run() {
		super.run();
		if (this.roleNum(Roles.builder)<this.memory.num){
			let unit=this.newRole(Roles.builder)
			unit.addTask(Tasks.build(unit))
		}
	}
}
export class FreeGroup extends WorkGroup<any>{
	constructor(colony: Colony) {
		super(colony,WorkGroupType.FREE);

	}
	addUnit(unit:Unit){
		if (!this.units.free) this.units.free=[]
		this.units.free.push(unit)
		if (!this.memory.units.free) this.memory.units.free=[]
		this.memory.units.free.push(unit._name)
	}
	removeUnit(unit:Unit){
		uu.arrayRemove(unit,this.units.free)
		uu.arrayRemove(unit._name,this.memory.units.free)
	}
	search(type:number){
		let u:Unit
		for (u of this.units.free){
			if (!(u as TaskUnit).theTask&&u.bodyType()==type) return u
		}
	}
	run(){
		super.run()
		if (this.units.free) this.units.free.forEach(u=>u.pos.highlight(Colors.green))
	}

}
// WorkGroup.wgClasses[WorkGroupType.UPGRADE]=UpgradeGroup
WorkGroup.wgClasses[WorkGroupType.HARVEST]=HarvestGroup
WorkGroup.wgClasses[WorkGroupType.FILL]=HatchFillGroup
WorkGroup.wgClasses[WorkGroupType.UPGRADE]=UpgradeGroup
WorkGroup.wgClasses[WorkGroupType.BUILD]=BuildGroup
WorkGroup.wgClasses[WorkGroupType.FREE]=FreeGroup
