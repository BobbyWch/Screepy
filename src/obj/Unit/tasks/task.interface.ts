interface HarvestTaskMem extends TaskMemory{
	src:Id<Source>
	state:CC.harvestStateLink|CC.harvestStateSite|CC.harvestStateContainer|CC.harvestStateDrop
	store:Id<StructureLink|StructureContainer|ConstructionSite>
	mineNum:number
}

interface GotoTaskMem extends TaskMemory{

}