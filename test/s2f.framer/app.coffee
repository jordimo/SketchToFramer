{ActivityCard} = require 'ActivityCard'
{TopNav} = require 'TopNav'
{SignIn} = require 'SignIn'


mainScroll = new ScrollComponent
	width:  Screen.width
	height: Screen.height
	
tn = new TopNav
	superLayer : mainScroll.content
	

aC = new ActivityCard
	superLayer : mainScroll.content
	y : tn.maxY

	
sI = new SignIn
	superLayer : mainScroll.content
	y : aC.maxY
	
mainScroll.updateContent()
mainScroll.speedX = 0
	