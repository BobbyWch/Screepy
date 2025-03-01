const enum ColonyState{
	BOOT,NORMAL,DEFENDING,OUTPOST
}
interface ColonyMemory{
	state:ColonyState
}