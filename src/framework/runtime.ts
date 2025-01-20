import {RuntimeProto} from "@/framework/frame.interface";
import {Colony} from "@/obj/Colony/colony";
import {uu} from "@/modules/util";

export const Runtime:RuntimeProto={
	cls:[],
	addColony(colony: Colony): void {
		this.cls.push(colony)
	},
	removeColony(colony: Colony): void {
		uu.arrayRemove(colony,this.cls)
	}

}