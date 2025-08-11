export const uu={
	cNum:0,
	cP:["a","s","d","f"][Game.shard.name[5]]||"c",
	/**
	 * 注意对象之间只比较地址，不考虑多实例
	 */
	arrayRemove(obj:any,arr:Array<any>):void{
		let i=arr.indexOf(obj)
		if (i!=-1) arr.splice(i,1)
		else {
			console.log("Remove not found!"+obj._name)
		}
	},
	objArrRemove(obj:CanEqual,arr:Array<CanEqual>):void{

	},
	firstKey(o:object):string|undefined{
		// noinspection LoopStatementThatDoesntLoopJS,UnnecessaryLocalVariableJS
		for (const a in o) return a
	},
	getCreepName:()=>`${uu.cP}${global.Gtime%10000}_${uu.cNum++}`,
	findPriority(arr:any,targets:any[],key?:string):any{
		let j,tar
		if (key){//按优先级查找对象，key为对象匹配时的键
			for (let i=0;i<targets.length;i++){
				tar=targets[i]
				for (j=0;j<arr.length;j++){
					if (arr[j][key]==tar){
						return arr[j]
					}
				}
			}
		}else {
			for (let i=0;i<targets.length;i++){
				tar=targets[i]
				for (j=0;j<arr.length;j++){
					if (arr[j]==tar){
						return arr[j]
					}
				}
			}
		}
	},

	zipPos: (pos:RoomPosition|{x:number,y:number},ignoreName?:boolean):string => {
		if (ignoreName) return `${pos.x}/${pos.y}`
		else return `${pos.x}/${pos.y}/${(pos as RoomPosition).roomName}`
	},
	unzipPos:(posStr:string):RoomPosition|{x:number,y:number} => {
		const infos = posStr.split('/')
		if (infos.length==2) return {x:Number(infos[0]),y:Number(infos[1])}
		else return new RoomPosition(Number(infos[0]),Number(infos[1]),infos[2])
	},
	nextRand(max){
		return 0|(Math.random()*max)
	}
}
export const storeProxyH={
	get(target,prop,receiver) {
		return target[prop]||0
	},
	set(target,prop,value,receiver){
		if (target[prop]) target[prop]+=value
		else target[prop]=value
	}
} as ProxyHandler<{}>

export class RoomArray {
	arr:any[]
	exec(x, y, val) {
		let tmp = this.arr[x * 50 + y]
		this.set(x, y, val);
		return tmp
	}
	get(x, y) {
		return this.arr[x * 50 + y];
	}
	set(x, y, value) {
		this.arr[x * 50 + y] = value;
	}
	init() {
		if (!this.arr)
			this.arr = new Array(50 * 50)
		for (let i = 0; i < 2500; i++) {
			this.arr[i] = 0;
		}
		return this;
	}
	forEach(func) {
		let x
		for (let y = 0; y < 50; y++) {
			for (x = 0; x < 50; x++) {
				func(x, y, this.get(x, y))
			}
		}
	}
	for4Direction(func, x, y, range = 1) {
		let xt,yt
		for (let e of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
			xt = x + e[0]
			yt = y + e[1]
			if (xt >= 0 && yt >= 0 && xt <= 49 && yt <= 49)
				func(xt, yt, this.get(xt, yt))
		}
	}
	forNear(func, x, y, range = 1) {
		let j,xt,yt
		for (let i = -range; i <= range; i++) {
			for (j = -range; j <= range; j++) {
				xt = x + i
				yt = y + j
				if ((i || j) && xt >= 0 && yt >= 0 && xt <= 49 && yt <= 49)
					func(xt, yt, this.get(xt, yt))
			}
		}
	}
	forBorder(func, range = 1) {
		for (let y = 0; y < 50; y++) {
			func(0, y, this.get(0, y))
			func(49, y, this.get(49, y))
		}
		for (let x = 1; x < 49; x++) {
			func(x, 0, this.get(x, 0))
			func(x, 49, this.get(x, 49))
		}
	}
	initRoomTerrainWalkAble(roomName) {
		let terrain = new Room.Terrain(roomName);
		this.forEach((x, y) => this.set(x, y, terrain.get(x, y) == 1 ? 0 : terrain.get(x, y) == 0 ? 1 : 2))
	}
}
global.RoomArray=RoomArray