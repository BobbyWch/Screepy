const enum WorkGroupType{
	UPGRADE=1,SPAWN,HARVEST,MINE,CARRY,FILL,BUILD,FREE
}

interface WorkerPlan{

}
interface WorkGroupMemory{
	units:{[r:string]:string[]}
}
interface HarvestGMemory extends WishMemory{

}
interface FillGMem extends WishMemory{

}
interface WishMemory extends WorkGroupMemory{
	num:number
}