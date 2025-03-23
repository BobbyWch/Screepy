interface UnitMemory{
    inQueue:boolean
    home:string
    group?:WorkGroupType
    body?:BodyGen
}

interface TaskUnitMemory extends UnitMemory{
    currTask:UnitTaskType
    taskQueue:UnitTaskType[]
    taskData:{[type:number]:TaskMemory}
}
interface TaskMemory{

}
const enum UnitTaskType{
    HARVEST,BUILD,UPGRADE
}

const TASK_END=1
const TASK_FAIL=2