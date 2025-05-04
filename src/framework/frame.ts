import {Logger} from "@/modules/Logger";
import {uu} from "@/modules/util";

export let OLD_MEMORY=false

export const XFrame= {
	mounts: {
		first: [] as Array<() => void>,
		normal: [] as Array<() => void>
	},
	mtd: false,
	lMem: null,
	mTime: 0,//mem hack time
	errT: 0,
	addMount(fn: () => void, runFirst?: boolean): void {
		if (runFirst) this.mounts.first.push(fn)
		else this.mounts.normal.push(fn)
	},
	doMount(): void {
		if (this.mtd) return
		else {
			this.memoryInit()
			let fn
			for (fn of this.mounts.first) fn()
			for (fn of this.mounts.normal) fn()
			delete this.mounts
			this.mtd = true
		}
	},
	wrapError(fn: Function, cb: Function): Function {
		return function () {
			try {
				fn(...arguments)
			} catch (e) {
				if (e instanceof Error) {
					let msg
					if (cb) {
						try {
							msg = cb(...arguments)
						} catch (eCB) {
							msg = "Error happened in Callback ------Stack Begin:\n"
							msg += _.escape(eCB.stack)
							msg += "\n------End"
						}
					}
					msg += "\nError stack:\n" + _.escape(e.stack)
					console.log(msg)
					Game.notify(msg, 30)
				} else throw e
			}
		}
	},
	load(): void {
		global.Gtime = Game.time;
		uu.cNum = 0
		//mem hack
		if (this.lMem) {
			if (global.Gtime == this.mTime + 1) {
				// @ts-ignore
				delete global.Memory;
				// @ts-ignore
				global.Memory = this.lMem;
				// @ts-ignore
				RawMemory._parsed = this.lMem;
				OLD_MEMORY = true
			} else {
				const cpu = Game.cpu.getUsed()
				Memory.rooms; // forces parsing
				console.log(`Reparse memory costs ${Game.cpu.getUsed() - cpu} cpu`)
				// @ts-ignore
				this.lMem = RawMemory._parsed;
				this.errT++
				if (this.errT > 4) {
					this.globalUniqueId = this.globalUniqueId || Math.random().toString(16).slice(2);
					Logger.err("Global switched!" + Game.time + '/' + this.mTime + '(id: ' + this.globalUniqueId + ')', true);
				}
				OLD_MEMORY = false
			}
		} else {
			const cpu = Game.cpu.getUsed()
			Memory.rooms; // forces parsing
			console.log(`Parse memory costs ${Game.cpu.getUsed() - cpu} cpu`)
			// @ts-ignore
			this.lMem = RawMemory._parsed;
			OLD_MEMORY = false
		}
		this.mTime = global.Gtime;

		this.doMount()
	},
	memoryInit(): void {
		if (!Memory.avoids) Memory.avoids=[]
		if (!Memory.colony) Memory.colony = {}
		if (!Memory.units) Memory.units = {}
	},
	cleanHeap() {
		global.Heap.enemyC = {}
	}
}