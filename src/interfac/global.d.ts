declare namespace NodeJS{
	interface Global{
		Gtime:number;
		market:object;
	}
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
	harvestStateDrop=4
}
