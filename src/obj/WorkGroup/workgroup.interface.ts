const enum WorkGroupType{
	UPGRADE,SPAWN,HARVEST,MINE,CARRY
}

interface WorkerPlan{

}
interface WorkGroupMemory{
	units:{[r:string]:string[]}
}
interface HarvestGMemory extends WorkGroupMemory{
	num:number
}
