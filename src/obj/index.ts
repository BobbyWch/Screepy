import {Runtime} from "@/framework/runtime";
import {Colony} from "@/obj/Colony/colony";
import {XFrame} from "@/framework/frame";

XFrame.addMount(()=>{
	let key:string,room:Room
	for (key in Game.rooms){
		room=Game.rooms[key]
		if (room.controller&&room.controller.my){
			Runtime.addColony(Colony.get(room))
		}
	}

})