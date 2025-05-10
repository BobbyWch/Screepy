export const Visual={
	y:0,
	run(){
		this.globalV()
	},
	globalV(){
		const visual=new RoomVisual()
		this.y=6
		this.drawTextAndBar(visual,"CPU",Game.cpu.getUsed()/Game.cpu.limit,"#00ffe1")
		this.y+=1.3
		this.drawTextAndBar(visual,"BKT",Game.cpu.bucket/10000,"#f5e11d")
		this.y+=1.3
		this.drawTextAndBar(visual,"HEP",Game.cpu.getHeapStatistics().total_heap_size/Game.cpu.getHeapStatistics().heap_size_limit,"#FFFFFF")
		this.y+=1.3
		this.drawTextAndBar(visual,"GCL",Game.gcl.progress/Game.gcl.progressTotal,"#83ff00",5)
		this.y+=1.3
	},
	drawTextAndBar(visual,text,percent,color,digit=0){
		visual.text(text,3.1,this.y+0.8,{align:"left",color}).rect(5,this.y+0.1,8*percent,0.8,{fill:color})
			.text(`${(percent*100).toFixed(digit)}%`,9,this.y+0.75,{color})
		this.drawRect(visual,5,this.y+0.1,13,this.y+0.9,color)
	},
	drawRect(visual,x1,y1,x2,y2,color) {
		const opt={color}
		visual.line(x1, y1, x1, y2,opt).line(x1, y2, x2, y2, opt).line(x2, y2, x2, y1, opt).line(x2, y1, x1, y1,opt)
	},
	drawPanel(visual,y,title,content,content2){
		if (!content.length) content.push("(No value)")
		const height=content.length+0.95
		this.drawRect(visual,5,y,13,y+height,"#FFFFFF")
		visual.rect(5,y,8,0.95,{opacity:0.25}).text(title,5.3,y+0.7,{align:"left"})
		for (let i = 0; i < content.length; i++) {
			visual.text(content[i],5.3,y+i+1.7,{align:"left"})
			if (content2) visual.text(content2[i],12.8,y+i+1.7,{align:"right"})
		}
		return height
	}
}