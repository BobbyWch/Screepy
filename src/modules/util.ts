export const uu={
	cNum:0,
	cP:["a","s","d","f"][Game.shard.name[5]]||"c",
	/**
	 * 注意对象之间只比较地址，不考虑多实例
	 */
	arrayRemove(obj:any,arr:Array<any>):void{
		let i=arr.indexOf(obj)
		if (i!=-1) arr.splice(i,1)
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
	}
}