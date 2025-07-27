Room.prototype.buff=function (){
    return global.Heap.room[this.name]||(global.Heap.room[this.name]={} as RoomBuffer)
}
/**
 * 不应该修改获取的数组元素
 */
Room.prototype.structs=function (type:StructureConstant){
    if (!this._str_c) this._str_c={}
    if (!this._str_c[type]){
        this._str_c[type]=this.find(FIND_STRUCTURES).filter(s=>s.structureType==type)
    }
    return this._str_c[type]
}
Room.prototype.findEnemy=function (pc){
    if (!this._em) this._em=this.find(FIND_HOSTILE_CREEPS).filter(c=>!Memory.whiteList.includes(c.owner.username))
    if (pc){
        if (!this._emp){
            this._emp=(this.find(FIND_HOSTILE_POWER_CREEPS).filter(c=>
                !Memory.whiteList.includes(c.owner.username)) as AnyCreep[]).concat(this._em)
        }
        return this._emp
    }else return this._em
}