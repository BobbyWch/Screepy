import {Runtime} from "@/framework/runtime";
import {Colony} from "@/obj/Colony/colony";
import {XFrame} from "@/framework/frame";
import {uu} from "@/modules/util";
import {TaskUnit, Unit} from "@/obj/Unit/unit";

XFrame.addMount(()=>{
	let key:string,room:Room
	if (Memory.units){
		for (key in Memory.units){
			if (Memory.units[key]["taskData"]) Runtime.addUnit(new TaskUnit(key,undefined))
			else Runtime.addUnit(new Unit(key,undefined))
		}
	}

	if (uu.firstKey(Memory.colony)){
		let name,c
		for (name in Memory.colony){
			Runtime.addColony(new Colony(name))
		}
	}else {
		for (key in Game.rooms){
			room=Game.rooms[key]
			if (room.controller&&room.controller.my){
				const c=new Colony(room)
				c.setState(ColonyState.BOOT0)
				Runtime.addColony(c)
			}
		}
	}
})