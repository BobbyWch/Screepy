interface HarvestTaskMem extends TaskMemory{
	// src:Id<Source>
	state:CC.harvestStateLink|CC.harvestStateSite|CC.harvestStateContainer|CC.harvestStateDrop
	store:Id<StructureLink|StructureContainer|ConstructionSite>
	mineNum:number
	siteId:string
}

interface GotoTaskMem extends TaskMemory{
	range:number
	zipPos:string
}
interface FetchTaskMem extends TaskMemory{
	res:ResourceConstant
	num?:number
	fetchWay:FetchWayType
}
const enum FetchWayType{
	SOURCE=1
}
interface CollectTaskMem extends TaskMemory{
	srcId:Id<Source>
}
interface UpgTaskMem extends TaskMemory{

}
interface BuildTaskMem extends TaskMemory{

}
interface RepairTaskMem extends TaskMemory{

}