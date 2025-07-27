interface UnitMemory{
    inQueue:boolean
    home:string
    group?:WorkGroupType
    body?:BodyGen
    sleep:number
    spawning:boolean
    role?:string
    reg:UnitRegistry
}
interface UnitRegistry{
    mineSite?:{
        id:string
        num?:number
    }
}

interface TaskUnitMemory extends UnitMemory{
    currTask:TaskType
    taskQueue:TaskType[]
    taskData:{[type:number]:TaskMemory}
}
interface TaskMemory{
    sleep:number
    init:boolean
}
interface HatchFillMem extends TaskMemory{
    targetId:Id<HatchEgg>
    target:Id<HatchEgg>
    getting:boolean
}
type HatchEgg=StructureSpawn|StructureExtension
//不能有0！！
const enum TaskType{
    HARVEST = 4,BUILD = 1,UPGRADE = 2,GOTO=3,HATCH_FILL=5,FETCH=6,COLLECT=7,REPAIR=8
}
