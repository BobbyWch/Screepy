declare namespace NodeJS{
	interface Global{
		Gtime:number;
		market:object;
		Heap:HeapData;
	}
}
interface HeapData{
	creep:{[p:string]:CreepBuffer}
	enemyC:{[p:string]:CreepBuffer}
}

declare var global: NodeJS.Global & typeof globalThis;
interface Memory{
	colony:{[rn:string]:ColonyMemory};
	units:{[name:string]:UnitMemory};
}
const enum CC{
	/**
	 * @see {HarvestTaskMem}
	 */
	harvestStateLink=1,
	harvestStateContainer=2,
	harvestStateSite=3,
	harvestStateDrop=4,


	taskOK=0,
	taskFinish=1,
	taskNext=2,
}
