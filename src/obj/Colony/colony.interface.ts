const enum ColonyState{
	BOOT0,BOOT,NORMAL,DEFENDING,OUTPOST
}
const enum MineSiteState{
	drop=1,container=2,link=3,multi
}
interface ColonyMemory{
	state:ColonyState
	hatch?:HatcheryMemory
	tower?:TowerMemory
	workGroup: { [t:number]:WorkGroupMemory }
	ids:IdCache
	centerP:string
	MSite:{[id:string]:MineSiteMemory}
	base:ColBaseMemory
}
interface MineSiteMemory{
	id:Id<Source>
	link?:Id<StructureLink>
	con?:Id<StructureContainer>
	state:MineSiteState
	used:number
	workNum:number
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