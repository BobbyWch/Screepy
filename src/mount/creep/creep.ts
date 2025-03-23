import {XFrame} from "@/framework/frame";

XFrame.addMount(()=>{
    // Creep.prototype.inDest=function (rn,shard){
    // 	return this.room.name==rn&&(!shard||Game.shard.name==shard)
    // }
    Creep.prototype.bodyInfo=function (){
        if (!this._bif){
            let bodies=this.body,b
            const result={}
            for (b of bodies){
                if (result[b.type]) result[b.type]++
                else result[b.type]=1
            }
            this._bif=result
        }
        return this._bif
    }
})
export function mountCreep() {

	// const canExtend = ["target", "role", "autoRe", "belong"];
	// Creep.prototype.wayPoint = function () {
	// 	if (!this.memory.tag) {
	// 		this.memory.tag = {}
	// 	}
	// 	if (!this.memory.ways) {
	// 		const points = [], tag = this.memory.tag.patten
	// 		let i = 1, flag
	// 		while ((flag = `${tag}${i++}`) in Game.flags) {
	// 			points.push(flag)
	// 		}
	// 		if (this.memory.tag.current) {
	// 			points.splice(0, points.indexOf(this.memory.tag.current))
	// 		}
	// 		this.memory.ways = points
	// 	}
	// 	if (this.memory.ways.length) {
	// 		if (this.pos.isEqualTo(Game.flags[this.memory.ways[0]])) {
	// 			this.memory.ways.shift()
	// 			if (!this.memory.ways.length) return
	// 		}
	// 		this.memory.tag.current = this.memory.ways[0]
	// 		this.moveTo(Game.flags[this.memory.ways[0]])
	// 	}
	// }

	// Creep.prototype.getEnergyFrom = function (target) {
	// 	if (fastNear(this.pos, target.pos)) {
	// 		if (target.store) return this.withdraw(target, RESOURCE_ENERGY)
	// 		else if (target instanceof Source) return this.harvest(target)
	// 	} else {
	// 		this.moveInRoom(target)
	// 		return ERR_NOT_IN_RANGE
	// 	}
	// 	return ERR_INVALID_TARGET
	// }
	// //如果传入了result，那只要result为OK，就切换
	// Creep.prototype.checkState = function (result = 1, res) {
	// 	if (this.memory.working) {
	// 		if (result) {
	// 			if (!this.store.getFreeCapacity()) delete this.memory.working
	// 		} else delete this.memory.working
	// 	} else {
	// 		if (result) {
	// 			if (res) {
	// 				if (!this.store[res]) this.memory.working = 1
	// 			} else {
	// 				if (!this.store.getUsedCapacity()) this.memory.working = 1
	// 			}
	//
	// 		} else this.memory.working = 1
	// 	}
	// }
	// Creep.prototype.withdrawFromStore = function (notBelong) {
	// 	const st = notBelong?this.room.storage:Game.rooms[this.memory.belong].storage
	// 	if (st&&(this.room.name != st.room.name)) {
	// 		this.moveTo(st)
	// 	} else {
	// 		if (st && st.store[RESOURCE_ENERGY]) {
	// 			this.checkState(this.getEnergyFrom(st));
	// 		} else this.checkState(this.getEnergyFrom(notBelong?this.room.terminal:Game.rooms[this.memory.belong].terminal));
	// 	}
	// }
	// Creep.prototype.kite = function (enemy) {
	// 	const range = this.pos.getRangeTo(enemy)
	// 	if (range < 3) {
	// 		this.flee(enemy.pos, 8)
	// 	} else if (range > 3) {
	// 		this.moveTo(enemy)
	// 	}
	// 	this.rangedAttack(enemy)
	// }
	//
	// Creep.prototype.boostInfo = function () {
	// 	if (!this.buff.bstInfo) {
	// 		const body = {}
	// 		let b, res
	// 		for (b of this.body) {
	// 			if (body[b.type]) {
	// 				body[b.type]++
	// 			} else {
	// 				body[b.type] = 1
	// 			}
	// 		}
	// 		const info = {}
	// 		for (res of this.memory.needBoost) {
	// 			info[res] = body[boostMap[res]] * 30
	// 		}
	// 		this.buff.bstInfo = info
	// 	}
	// 	return this.buff.bstInfo
	// }
	// Creep.prototype.onTheEdge = function () {
	// 	return this.pos.x == 49 || this.pos.x == 0 || this.pos.y == 49 || this.pos.y == 0;
	// }
	// Creep.prototype.checkInjured=function(ntf=true){
	// 	if(!this.memory._ntf){
	// 		this.notifyWhenAttacked(false)
	// 		this.memory._ntf=1
	// 		this.memory._lj=this.hits
	// 	}
	// 	if(!ntf) return
	// 	if(this.hits<this.memory._lj){
	// 		const hs=this.room.find(FIND_HOSTILE_CREEPS)
	// 		if(hs.length){
	// 			const ns=_.uniq(hs.map(h=>h.owner.username))
	// 			Logger.err(`${this.memory.role} is attacked by ${ns.join(",")} in ${this.room.name}`,true)
	// 		}
	// 	}
	// 	this.memory._lj=this.hits
	// }
	//
	// /**
	//  * @param pre {number}
	//  */
	// Creep.prototype.autoRe = function (pre) {
	// 	if (!this.memory.re && this.ticksToLive < this.body.length * 3 + pre) {
	// 		const cloneM = {}
	// 		for (const key in this.memory) {
	// 			if (canExtend.includes(key)) {
	// 				cloneM[key] = this.memory[key]
	// 			}
	// 		}
	// 		Game.rooms[this.memory.belong].spawnMem(cloneM)
	// 		this.memory.re = true
	// 	}
	// }
	//
	// Creep.prototype.autoRange = function (target) {
	// 	const range = this.pos.getRangeTo(target)
	// 	if (range > 1) {
	// 		this.moveTo(target)
	// 		if (range < 4) {
	// 			return this.rangedAttack(target)
	// 		}
	// 		return ERR_NOT_IN_RANGE
	// 	} else return this.rangedMassAttack()
	// }
	// Creep.prototype.autoHeal = function (target) {
	// 	const range = this.pos.getRangeTo(target)
	// 	if (range > 1) {
	// 		this.moveTo(target)
	// 		if (range < 4) {
	// 			return this.rangedHeal(target)
	// 		}
	// 		return ERR_NOT_IN_RANGE
	// 	} else return this.heal(target)
	// }
	// Creep.prototype.transferAny = function (target) {
	// 	for (const k in this.store) {
	// 		if (this.transfer(target, k) == ERR_NOT_IN_RANGE) {
	// 			this.moveTo(target)
	// 		}
	// 		return
	// 	}
	// }
	// Creep.prototype.getTomb = function (type) {
	// 	if (this.room.memory.war) return ERR_NOT_FOUND
	// 	const tomb = this.room.find(FIND_TOMBSTONES).concat(this.room.find(FIND_RUINS)).filter(o => o.store[type] > 100 && !o._used)
	// 	if (tomb.length) {
	// 		const t = tomb[0]
	// 		t._used = true
	// 		const result = this.withdraw(t, type)
	// 		if (result == ERR_NOT_IN_RANGE) {
	// 			this.moveTo(t)
	// 		}
	// 		return result
	// 	}
	// 	return ERR_NOT_FOUND
	// }
	// Creep.prototype.getRes = function (type) {
	// 	if (this.room.memory.war) return ERR_NOT_FOUND
	// 	const ress = this.room.find(FIND_DROPPED_RESOURCES).filter(o => o.resourceType == type && o.amount > 100 && !o.used)
	// 	if (ress.length) {
	// 		const t = ress[0]
	// 		t.used = true
	// 		const result = this.pickup(t)
	// 		if (result == ERR_NOT_IN_RANGE) {
	// 			this.moveTo(t)
	// 		}
	// 		return result
	// 	}
	// 	return ERR_NOT_FOUND
	// }
	// Creep.prototype.harmful = function () {
	// 	let b
	// 	for (b of this.body) {
	// 		if ([WORK, ATTACK, RANGED_ATTACK, CLAIM].includes(b.type)) return true
	// 	}
	// 	return false
	// }
	// Creep.prototype.moveToWith=function(t,f){
	// 	if(f){
	// 		if(f.fatigue||this.fatigue) return
	// 		f.moveTo(this)
	// 		if(this.pos.isNearTo(f)) this.moveTo(t)
	// 	}else{
	// 		this.moveTo(t)
	// 	}
	// }
	// Creep.prototype.hasBody = function (bodyArr) {
	// 	let b
	// 	const bb = this.body
	// 	for (b of bb) {
	// 		if (b.hits && bodyArr.includes(b.type)) return true
	// 	}
	// 	return false
	// }
	//
	// Creep.prototype.centerCarry = function () {
	// 	const memory = this.memory
	// 	/**@type{CenterTask}*/
	// 	let task = this.room.memory.centerTasks[memory.taskId];
	// 	if (!task) {
	// 		if (this.ticksToLive < 10) {
	// 			if (this.store.getUsedCapacity()) {
	// 				this.transferAny(this.room.storage)
	// 			} else {
	// 				this.suicide()
	// 			}
	// 			return;
	// 		}
	// 		let id, i
	// 		const allTasks = this.room.memory.centerTasks
	// 		//找到可用的任务
	// 		for (i in allTasks) {
	// 			if (!allTasks[i].runner || allTasks[i].runner == this.name || !Game.creeps[allTasks[i].runner]) {
	// 				id = i
	// 				break
	// 			}
	// 		}
	// 		if (id) {
	// 			memory.taskId = id;
	// 			task = allTasks[id];
	// 			task.runner = this.id;
	// 			if (!task.num || task.num > this.store.getCapacity()) {
	// 				memory.num = this.store.getCapacity()
	// 			} else {
	// 				memory.num = task.num
	// 			}
	// 			delete memory.target
	// 			memory.working = true
	// 			memory.ready = false
	// 		} else {
	// 			if (this.store.getUsedCapacity()) {
	// 				this.transferAny(this.room.storage)
	// 			}
	// 			return;
	// 		}
	// 	}
	// 	//准备
	// 	if (!memory.ready) {
	// 		if (this.store.getUsedCapacity()) {
	// 			this.transferAny(this.room.storage)
	// 		} else {
	// 			memory.ready = true
	// 		}
	// 	}
	// 	//开始任务
	// 	let result
	// 	if (memory.working) {
	// 		const src = Game.getObjectById(memory.taskId)
	// 		result = task.num ? this.withdraw(src, task.res, memory.num) : this.withdraw(src, task.res)
	// 		if (result == ERR_NOT_IN_RANGE) {
	// 			this.moveTo(src)
	// 		} else if (result == OK) {
	// 			delete memory.working
	// 		} else {
	// 			console.log(`${this.name}任务异常`)
	// 			this.room.deleteCenter(memory.taskId)
	// 			delete memory.taskId
	// 			delete memory.working
	// 		}
	// 	} else {
	// 		const target = Game.getObjectById(task.target)
	// 		result = task.num ? this.transfer(target, task.res, memory.num) : this.transfer(target, task.res)
	// 		if (result == ERR_NOT_IN_RANGE) {
	// 			this.moveTo(target)
	// 		} else if (result == OK) {
	// 			if (task.num) {
	// 				task.num -= memory.num
	// 				if (task.num <= 0) {
	// 					this.room.deleteCenter(memory.taskId)
	// 				}
	// 			} else {
	// 				this.room.deleteCenter(memory.taskId)
	// 			}
	// 			delete memory.taskId
	// 		} else {
	// 			console.log(`${this.name}任务异常2`)
	// 			this.room.deleteCenter(memory.taskId)
	// 			delete memory.taskId
	// 		}
	// 	}
	// }
	// Creep.prototype.getEnergy = function () {
	// 	if (!this.store || this.store.getCapacity() == 0) return
	// 	if (this.getTomb(RESOURCE_ENERGY) == ERR_NOT_FOUND) {
	// 		if (this.getRes(RESOURCE_ENERGY) == ERR_NOT_FOUND) {
	// 			if (this.buff.disableStr) this.buff.disableStr--
	// 			else {
	// 				if (!this.buff.struct) {
	// 					const ss = this.room.find(FIND_STRUCTURES).filter(o => !o.my && o.store && o.store[RESOURCE_ENERGY])
	// 					if (ss.length) {
	// 						const cs = ss.filter(o => {
	// 							if (o.structureType != STRUCTURE_CONTAINER) return false
	// 							if (!o.taken) o.taken = 0
	// 							return o.store[RESOURCE_ENERGY] > o.taken
	// 						})
	// 						if (cs.length) {
	// 							this.buff.struct = _.max(cs, con => con.store[RESOURCE_ENERGY] - con.taken).id
	// 						} else this.buff.struct = ss[0].id
	// 					} else {
	// 						if (this.getActiveBodyparts(WORK)) this.buff.disableStr = 50
	// 						else {
	// 							const tower = this.room.find(FIND_MY_STRUCTURES).find(o => o.structureType == STRUCTURE_TOWER && o.store[RESOURCE_ENERGY])
	// 							if (tower) this.buff.struct = tower.id
	// 						}
	// 					}
	// 				}
	// 				if (!this.buff.struct) return;
	// 				const s = Game.getObjectById(this.buff.struct)
	// 				if (!s.taken) s.taken = 0
	// 				s.taken += this.store.getCapacity()
	// 				this.checkState(this.getEnergyFrom(s))
	// 				if (!this.memory.working) delete this.buff.struct;
	// 				return
	// 			}
	// 			if (!this.memory.src) {
	// 				this.memory.src = this.room.getSource().id
	// 			}
	// 			const src = Game.getObjectById(this.memory.src)
	// 			const result = this.harvest(src)
	// 			if (result == ERR_NOT_IN_RANGE) {
	// 				if(src.pos.findInRange(FIND_MY_CREEPS,1).length==src.pos.freeSpace()){
	// 					delete this.memory.src;
	// 				}else this.moveInRoom(src)
	// 			} else if (result == ERR_NOT_ENOUGH_RESOURCES) {
	// 				const ass=this.room.find(FIND_SOURCES_ACTIVE)
	// 				if (ass.length) {
	// 					this.memory.src = ass[0].id
	// 					this.moveTo(ass[0])
	// 				}else if (!this.pos.isNearTo(src)) this.moveTo(src)
	// 			} else {
	// 				this.memory.dontPullMe = true
	// 			}
	// 		}
	// 	}
	// 	if (!this.store.getFreeCapacity()) {
	// 		delete this.memory.working
	// 		delete this.memory.src
	// 		delete this.buff.struct
	// 		delete this.buff.disableStr
	// 	}
	// }
	// Creep.prototype.forceMove = function (target) {
	// 	if (!target) return false
	// 	if (this.pos.isEqualTo(target)) {
	// 		return true
	// 	}
	// 	this.moveTo(target)
	// 	return false
	// }
	// Creep.prototype.$rg=Creep.prototype.rangedAttack
	// Creep.prototype.rangedAttack=function (target){
	// 	if (!target.managedDamage) target.managedDamage=0
	// 	target.managedDamage+=this.damageInfo()[RANGED_ATTACK]
	// 	return this.$rg(target)
	// }
	// Creep.prototype.$rmg=Creep.prototype.rangedMassAttack
	// Creep.prototype.rangedMassAttack=function (targets){
	// 	if (!targets) targets=this.pos.findInRange(FIND_HOSTILE_CREEPS,3)
	// 	if (targets&&targets.length){
	// 		let t,r
	// 		for (t of targets){
	// 			r=this.pos.getRangeTo(t)
	// 			if (r>3) continue
	// 			if (!t.managedDamage) t.managedDamage=0
	// 			t.managedDamage+=this.damageInfo()[RANGED_ATTACK]*RANGE_DECLINE[r]
	// 		}
	// 	}
	// 	return this.$rmg()
	// }
	// Creep.prototype.$ak=Creep.prototype.attack
	// Creep.prototype.attack=function (target){
	// 	if (!target.managedDamage) target.managedDamage=0
	// 	target.managedDamage+=this.damageInfo()[ATTACK]
	// 	return this.$ak(target)
	// }
	//
	//
	// const sayings = {
	// 	sherlock: {
	// 		content: ["相爱总能和好/好马不吃回头草", "即兴的誓/烂尾的诗", "埋在心里吧/每个夜晚都思念的人", "圆有公式/但缘没有", "药是苦的/你的笑是甜的",
	// 			"手是冷的/你的怀里是暖的", "你知道我的星座吗/为你的量身定做", "不要抱怨/抱我", "不响丸辣！", "我可是深情一哥", "I am/Sherlock/A dog"]
	// 	},
	// 	ikun: {
	// 		content: ["你干嘛~~/哎呦~~~", "我喜欢唱、跳、/Rap、篮球", "Ctrl!", "你食不食油饼", "你有没有树枝", "香精煎鱼食不食", "香翅捞饭食不食"]
	// 	},
	// 	frog: {
	// 		content: ["I have/big ass", "I am frog", "把你的ass扣成/小天的形状/开不开心？"]
	// 	},
	// 	neo: {
	// 		content: ["啊哈哈哈~~/鸡汤来喽", "这孩子跟小菜似的", "哼~", "shut up", "鸡你太美", "哈哈"]
	// 	}
	// }
	// const count = (str) => {
	// 	let sum = 0, c;
	// 	for (c of str) {
	// 		sum += +(c == "/");
	// 	}
	// 	return sum;
	// }
	// let ss, content, key
	// for (key in sayings) {
	// 	ss = []
	// 	content = sayings[key].content
	// 	for (const oneSay of content) {
	// 		ss.push(count(oneSay) + 1)
	// 	}
	// 	sayings[key].sizes = ss
	// }
	// Creep.prototype.greet = function (role) {
	// 	let mem = this.memory.say
	// 	if (!mem) {
	// 		mem = this.memory.say = {}
	// 	}
	// 	if (mem.child == sayings[role].sizes[mem.index]) {
	// 		if (Gtime % 6) {
	// 			return
	// 		}
	// 		mem.child = 0
	// 		let i = nextRand(sayings[role].content.length)
	// 		if (i == mem.index) {
	// 			if (i) i--
	// 			else i++
	// 		}
	// 		mem.index = i
	// 	}
	// 	this._say = sayings[role].content[mem.index].split("/")[mem.child++]
	// 	this.say(this._say, true)
	// }

}