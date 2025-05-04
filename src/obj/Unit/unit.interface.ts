interface UnitMemory{
    inQueue:boolean
    home:string
    group?:WorkGroupType
    body?:BodyGen
    sleep:number
    spawning:boolean
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
const enum TaskType{
    HARVEST = 4,BUILD = 1,UPGRADE = 2,GOTO=3
}
