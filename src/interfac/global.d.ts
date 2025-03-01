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
