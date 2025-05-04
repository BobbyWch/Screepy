const enum ColonyState{
	BOOT0,BOOT,NORMAL,DEFENDING,OUTPOST
}
interface ColonyMemory{
	state:ColonyState
	hatch?:HatcheryMemory
	tower?:TowerMemory
	workGroup: { [t:number]:WorkGroupMemory }
	ids:IdCache
	centerP:string
}
interface IdCache{
	ps?:Id<StructurePowerSpawn>;
	nu?:Id<StructureNuker>;
	fa?:Id<StructureFactory>;
	cl?:Id<StructureLink>;
	ul?:Id<StructureLink>;
	nt?:Id<StructureTower>;
	ob?:Id<StructureObserver>;
	pc?:string;
	ss?:Id<Source>[]
}