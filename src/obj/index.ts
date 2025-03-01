import {Runtime} from "@/framework/runtime";
import {Colony} from "@/obj/Colony/colony";
import {XFrame} from "@/framework/frame";
import {uu} from "@/modules/util";

XFrame.addMount(()=>{
	let key:string,room:Room
	if (uu.firstKey(Memory.colony)){
		const cs=Colony.reloadAll()
		let c
		for (c of cs){
			Runtime.addColony(c)
		}
	}else {
		for (key in Game.rooms){
			room=Game.rooms[key]
			if (room.controller&&room.controller.my){
				const c=Colony.get(room)
				c.setState(ColonyState.BOOT)
				Runtime.addColony(c)
			}
		}
	}

})