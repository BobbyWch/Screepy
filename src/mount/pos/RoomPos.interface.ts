interface RoomPosition{
    freeSpace():number;
    lineDist(pos:{x:number,y:number}):number
    forRange(range:number,func:Function):void
    getStruct(type:StructureConstant):Structure|undefined
    findNear(pos:RoomPosition,range:number,self?:boolean)
    creep():Creep
    highlight(color?:string)
}