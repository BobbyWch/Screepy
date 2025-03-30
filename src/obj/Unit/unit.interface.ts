interface UnitMemory{
    inQueue:boolean
    home:string
    group?:WorkGroupType
    body?:BodyGen
    sleep:number
}

interface TaskUnitMemory extends UnitMemory{
    currTask:UnitTaskType
    taskQueue:UnitTaskType[]
    taskData:{[type:number]:TaskMemory}
}
interface TaskMemory{
    sleep:number
}
const enum UnitTaskType{
    HARVEST = 0,BUILD = 1,UPGRADE = 2
}
