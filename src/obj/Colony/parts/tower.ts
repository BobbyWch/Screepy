import {Colony} from "@/obj/Colony/colony";
import {OLD_MEMORY} from "@/framework/frame";

export class TowerAI{
	colony:Colony

	constructor(colony:Colony) {
		this.colony=colony
		if (!colony.memory.tower) {
			colony.memory.tower = {
				IDs: colony.room.find(FIND_MY_STRUCTURES).filter(s=>s.structureType==STRUCTURE_TOWER).map(t=>t.id)
			} as TowerMemory

		}


	}

	run(){

	}

	action(type:'heal'|'repair'|'attack',target){

	}

	_mm:TowerMemory
	get memory():TowerMemory{
		if (OLD_MEMORY&&this._mm) return this._mm
		else return (this._mm=this.colony.memory.tower)
	}
}