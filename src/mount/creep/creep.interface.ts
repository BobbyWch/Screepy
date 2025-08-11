interface Creep{
    _bif:{[part:string]:number}
    storeLock:boolean//有store相关操作且OK
    deltaRes?:{[res:string]:number}
    bodyInfo():{[part:string]:number}
    buff():CreepBuffer

    onTheEdge():boolean
    moveTimeTo(pos:RoomPosition,range?:number):number

    r_tr(target: AnyCreep | Structure, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode;
    r_wi(target: Structure | Tombstone | Ruin, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode;
    r_pi(target: Resource): CreepActionReturnCode | ERR_FULL;

    syncRes(res:ResourceConstant):number;

}
interface CreepBuffer{
    _bif:{[p:string]:number};
}

interface CreepMemory{
    move:GoData

    src:Id<Source>;
    frozen:number;
    re:boolean;
    prePos:string;
    stand:boolean;
    belong: string;
    role: string;
    creepType:"heal"|"attack";//squad使用

    working: boolean|number;
    labWorking: number;
    ready: boolean;
    target: Id<Structure>;
    dontPullMe:boolean;
    forcePull:boolean
    _repair:Id<Structure>;
    endTime:number;
    state:"con"|"link"|"site";
    taskId: Id<Structure>;
    needBoost:MineralBoostConstant[];
    boosted:boolean;
    say:{ index:number, child:number; };
    tag:CreepTag;
    ways:string[];
    flagName:string;
    mission:CreepMissionModel;
    portalId:Id<StructurePortal>;
    site:Id<ConstructionSite>;
    shard:"shard3"|"shard2"|"shard1"|"shard0";
}
interface CreepMissionModel{
    id:string;//RoomMemory中MissionModel的id
    bound:boolean;
    data:any;
}
interface CreepTag{
    patten:string;
    current:string;
}
interface GoData {
    mode:string
    dest?:RoomPosition
    range?:number
    flee:boolean
}