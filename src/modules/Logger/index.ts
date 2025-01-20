export const Logger:LoggerProto={
	err(e: string, notify?: boolean): void {
		console.log(this.$colorful(e,Colors.red))
		if (notify) Game.notify(e,30)
	},
	log(s: string): void {
		console.log(s)
	},
	$colorful(s: string, color: string): string {
		return `<text style="color: ${color}; ">${s}</text>`;
	}
}
export const Colors={
	red: '#e04545',
	green: '#6dce30',
	yellow: '#ffff00',
	blue: '#20adfa'
}