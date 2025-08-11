const enum WorkGroupType{
	UPGRADE=1,SPAWN,HARVEST,MINE,CARRY,FILL,BUILD,FREE
}

interface WorkerPlan{

}
interface WorkGroupMemory{
	units:{[r:string]:string[]}
}
interface HarvestGMemory extends WorkGroupMemory{
	num:number
}
interface FillGMem extends WorkGroupMemory{
	num:number
}
