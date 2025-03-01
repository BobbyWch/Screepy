import {Unit} from "@/obj/Unit/unit";
import {Colony} from "@/obj/Colony/colony";


export class WorkGroup{
	units:Unit[];
	plan:WorkerPlan;

	constructor(colony:Colony) {
	}
}