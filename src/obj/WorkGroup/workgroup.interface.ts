const enum WorkGroupType{
	UPGRADE,SPAWN,HARVEST,MINE,CARRY,FILL,BUILD
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
