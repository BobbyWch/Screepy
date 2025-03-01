const enum WorkGroupType{
	UPGRADE,SPAWN,HARVEST,MINE,CARRY
}

interface WorkerPlan{

}
interface WorkGroupMemory{

}
interface HarvestGMemory extends WorkGroupMemory{
	num:number
}