import {Colony} from "@/obj/Colony/colony";

export interface RuntimeProto{
	addColony(colony:Colony):void;
	removeColony(colony:Colony):void;
	cls:Colony[];
	shdUpd:RuntimeObject[];

	update():void
	run():void;
}
