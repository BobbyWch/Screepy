const enum ColonyState{
	BOOT0,BOOT,NORMAL,DEFENDING,OUTPOST
}
interface ColonyMemory{
	state:ColonyState
	hatch?:HatcheryMemory
	tower?:TowerMemory
	workGroup:WorkGroupMemory[]

}