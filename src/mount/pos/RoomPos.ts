import {XFrame} from "@/framework/frame";

XFrame.addMount(()=>{
    /**
     * 查找自己周围在目标范围内的位置
     * @param pos {RoomPosition} 目标位置
     * @param range {number} 范围
     * @param self {boolean} 是否包括自己
     * @return {RoomPosition}
     */
    // RoomPosition.prototype.findNear=function (pos,range,self){
    //     let x,y,p
    //     const terrain=Game.map.getRoomTerrain(this.roomName)
    //     for (x=this.x-1;x<this.x+2;x++){
    //         for (y=this.y-1;y<this.y+2;y++){
    //             if (x==this.x&&y==this.y&&!self) continue//排除自己
    //             if (x==pos.x&&y==pos.y) continue
    //             if (terrain.get(x,y)==TERRAIN_MASK_WALL) continue
    //             p=new RoomPosition(x,y,pos.roomName)
    //             if (pos.getRangeTo(x,y)<=range&&p.lookFor(LOOK_CREEPS).length==0&&!p.lookFor(LOOK_STRUCTURES).find(s=>s.structureType!=STRUCTURE_RAMPART&&s.structureType!=STRUCTURE_CONTAINER)){
    //                 return p
    //             }
    //         }
    //     }
    //     return null
    // }
    RoomPosition.prototype.freeSpace=function (){
        let x,y,p=0
        const terrain=Game.map.getRoomTerrain(this.roomName)
        for (x=this.x-1;x<this.x+2;x++){
            for (y=this.y-1;y<this.y+2;y++){
                if (x==this.x&&y==this.y) continue//排除自己
                if (terrain.get(x,y)!=TERRAIN_MASK_WALL) p++
            }
        }
        return p
    }
    // RoomPosition.prototype.randPos=function (range){
    //     let x,y
    //     const terrain=Game.map.getRoomTerrain(this.roomName)
    //     let result=null
    //     let time=nextRand(range*range/2)+1
    //     for (x=this.x-range;x<=this.x+range;x++){
    //         for (y=this.y-1;y<=this.y+range;y++){
    //             if (terrain.get(x,y)==TERRAIN_MASK_WALL) continue
    //             if (new RoomPosition(x,y,this.roomName).lookFor(LOOK_CREEPS).length==0){
    //                 if(--time==0) return new RoomPosition(x,y,this.roomName)
    //                 else result=new RoomPosition(x,y,this.roomName)
    //             }
    //         }
    //     }
    //     return result
    // }
    /**
     * 返回值没有开根号，只适用于比较
     * @param pos
     * @returns {number}
     */
    RoomPosition.prototype.lineDist=function (pos){
        return (this.x-pos.x)**2+(this.y-pos.y)**2
    }
    RoomPosition.prototype.forRange=function (range,func){
        let xt,yt,j
        for (let i = -range; i <= range; i++) {
            for (j = -range; j <= range; j++) {
                xt = this.x + i
                yt = this.y + j
                if ((i || j) && xt >= 0 && yt >= 0 && xt <= 49 && yt <= 49){
                    func(xt, yt)
                }
            }
        }
    }
    RoomPosition.prototype.getStruct=function (type:StructureConstant){
        return Game.rooms[this.roomName].lookForAt(LOOK_STRUCTURES,this.x,this.y).find(s=>s.structureType==type)
    }
    // RoomPosition.prototype.nearByRampart=function (noCreep){
    //     return this.findInRange(FIND_MY_STRUCTURES,1).find(r=>r.structureType==STRUCTURE_RAMPART&&(!noCreep||!r.pos.lookFor(LOOK_CREEPS).filter(c=>c.memory.dontPullMe).length))
    // }
    /**
     * creeps中在范围内可能的最大伤害,attack+range
     * @param creeps {Creep[]}
     * @param range {number}
     */
    // RoomPosition.prototype.maxDamage=function (creeps,range){
    //     let c,all=0
    //     for (c of creeps){
    //         if (this.getRangeTo(c)<=range){
    //             all+=c.damageInfo()[ATTACK]
    //             all+=c.damageInfo()[RANGED_ATTACK]
    //         }
    //     }
    //     return all
    // }
    /**
     * 跨房间的是否near to
     * @param other
     * @return {boolean}
     */
    // RoomPosition.prototype.isCrossRoomNearTo = function (other){
    //     if (this.roomName == other.roomName) return this.isNearTo(other);
    //     if (other.pos) other = other.pos;
    //     return this.crossRoomGetRangeTo(other) <= 1;
    // };
    /**
     * 跨房间的两点之间的距离
     * @param other
     * @return {number}
     */
    // RoomPosition.prototype.crossRoomGetRangeTo = function (other) {
    //     if (this.roomName == other.roomName) return this.getRangeTo(other);
    //     if (other.pos) other = other.pos;
    //     const det = this.crossRoomSubPos(other);
    //     return Math.max(Math.abs(det.x), Math.abs(det.y));
    // };
    // RoomPosition.prototype.crossRoomSubPos = function (other){
    //     if (other.pos) other = other.pos;
    //     // let sub = (this.roomName==other.roomName) ? 0 : 1;
    //     const sameRoom = this.roomName == other.roomName;
    //     const change = (e) => (sameRoom ? e : e == 49 ? 50 : e == 0 ? -1 : e); // 如果房间不一样默认交换位置
    //     const a = other.getRoomCoordinate();
    //     const b = this.getRoomCoordinate();
    //     const x = b.x - a.x;
    //     const y = b.y - a.y;
    //     return {
    //         x: change(this.y) + y * 50 - change(other.y),
    //         y: change(this.x) + x * 50 - change(other.x)
    //     };
    // };
})