export class Colony implements RuntimeObject{
	private static colonies:{[rn:string]:Colony}={}
	static get(room:Room):Colony{
		return this.colonies[room.name]||(this.colonies[room.name]=new Colony(room))
	}

	protected room:Room
	private constructor(room:Room) {
		this.room=room
		this._ke=room.name
	}
	update():void{
		this.room=Game.rooms[this._ke]
	}

	_ke: string;

	run(): void {

	}

}