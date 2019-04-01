// stage=null;
view = null;
interval=null;
canvas=null;
canvas2 = null
socket = null;
var config = null
clientPlayer = null
// id = null
id = ID()
playerIndex = 0

/*
Step 1: Send the id from the client to the server 

*/



//on connecting to the server the client will send a initial message with a 
//unique username, and the server will add it to its mapping
export function initializeGame (canvas) {
	//This executes after the main html has loaded
	//Meaning everything is loaded
	// canvas2 = document.getElementById('stage2')
    canvas2 = canvas
    console.log('something is happenin');
    
	socket = new WebSocket("ws://localhost:8001");
	socket.onopen = function (event) {
		
		console.log("Sending in id", id);
		
		const data = {
			type: 'userName',
			id: id
		}
		sendData(data)
		
		console.log("connected");
	};

	socket.onmessage = function (event) {	
		//when a message has been relased
		var item = JSON.parse(event.data)
	
		config = item.data
		const ids = config[0].stage.playersID
		console.log(ids);
		
		canvas2.width = 700
		canvas2.height = 700

		var context = canvas2.getContext('2d')
		if (ids.includes(id)){
			console.log('in drawing');
			playerIndex  = ids.indexOf(id)
			
			draw(context)
		}

	}
    
	document.addEventListener('keydown', function(event){
		var key = event.key;
		if(key in moveMap2){
	
			keyPressData.x = moveMap2[key][0]
			keyPressData.y = moveMap2[key][1]
			keyPressData['id'] = id
			keyPressData['playerIndex'] = playerIndex
	
			if (key == 'e')
				keyPressData.type = 'pickUp'
			else
				keyPressData.type = 'movement'
			// stage.player.setDirection(moveMap[key].dx, moveMap[key].dy);
		}
		
		sendData(keyPressData)
		// const data = JSON.stringify(keyPressData)
		// socket.send(data);
		
	});

	document.addEventListener('keyup', function(event){
		var key = event.key;
		if(key in moveMap2){
			keyPressData.x = 0
			keyPressData.y = 0
			keyPressData.type = 'none'
		} 
	
	});

	canvas2.addEventListener("mousemove", function (event) {
		var mousePos = getMousePos(canvas2, event);
		// console.log(mousePos.x + ',' + mousePos.y);
		mouseMovementData = {
			playerIndex: playerIndex,
			id: id,
			type: 'mouseMovement',
			x: mousePos.x,
			y: mousePos.y
		}
		// console.log(mouseMovementData);
		mouseMove(mousePos.x, mousePos.y, clientPlayer)

	}, false);

	// canvas2.addEventListener("click", function (event) {
	// 	var mousePos = getMousePos(canvas2, event);
	// 	// console.log(mousePos.x + ',' + mousePos.y);
	// 	mouseMovementData = {
	// 		type: 'mouseClick',
	// 		x: mousePos.x,
	// 		y: mousePos.y
	// 	}
	// 	console.log(mouseMovementData);

	// 	sendData(mouseMovementData)
	// 	// stage.mouseClick(mousePos.x, mousePos.y);
	// }, false);

	setInterval(function() {
		const data = JSON.stringify(mouseMovementData)
		socket.send(data);
	
	}, 400)
	

}

function ID() {
	return '_' + Math.random().toString(36).substr(2, 9);
}

function draw(context) {
	// var context = canvas2.getContext('2d')
	
	var player = config[playerIndex]

	if (clientPlayer == null){
		clientPlayer = config[playerIndex]
	}else{
		clientPlayer.position = player.position
	}
	console.log('player id ', player.id);
	
	let playerPosition = toInt(player.position.x, player.position.y);
	let x=playerPosition.x;
	let y=playerPosition.y;
	
	// console.log("x="+x+" y="+y);

	let xt=-x+700/2;
	// if(x<this.canvasWidth/2)xt=0;
	// if(x>this.width-this.canvasWidth/2)xt=-this.width+this.canvasWidth;

	let yt=-y+700/2;
	// if(y<this.canvasHeight/2)yt=0;
	// if(y>this.height-this.canvasHeight/2)yt=-this.height+this.canvasHeight;

	context.resetTransform();

	context.fillStyle = '#6f6';
	context.clearRect(0, 0, 700, 700);

	context.translate(xt,yt);
	context.fillRect(0, 0, 10000, 10000);

	for (var i = 0; i < config.length; i ++){
		const type = config[i].actorType
		// console.log(type);
		switch (type) {
			case 'Tank':
				drawPlayer(context, config[i])
				// console.log(i);
				break;
			case 'Ball':
				drawBall(context, config[i])
				break
			case 'Box':
				drawBox(context, config[i])
				break
			case 'Bullet':
				drawBullet(context, config[i])
				break
			default:
				break;
		}

	}
	// requestAnimationFrame(draw)
}

/*
Main Idea: Render the turret position is predicted within the client, and the state is updated 
in the server
*/
//assuming player.position is a Pair object
function pointTurret(crosshairs, player){
	player.position = new Pair(player.position.x, player.position.y)
    var delta = crosshairs.toInt().vecSub(player.position.toInt());
    if(delta.x!=0 || delta.y !=0){
        player.turretDirection = delta.normalize();
	}
	clientPlayer = player
    // console.log(this.turretDirection);
    
}

// Map an canvas coordinates to world coordinates
function mapCanvasToWorld(canvasPosition, player){
	player.position = new Pair(player.position.x, player.position.y)

    var halfCanvas = (new Pair(700/2, 700/2)).toInt();
    var playerPosition = player.position.toInt();

    var worldPosition = canvasPosition.vecAdd(playerPosition.vecSub(halfCanvas));
    return worldPosition;
}

/** Handle the mouse movement on the stage in canvas coordinates **/
function mouseMove(x,y, player){
    var canvasPosition=new Pair(x,y);
    var worldPosition= mapCanvasToWorld(canvasPosition, player);
    pointTurret(worldPosition, player);
}

function getTurretPosition(){
	// position = ((x,y)+turretDirection*this.radius).toInt()
	clientPlayer.position = makePair(clientPlayer.position)
	clientPlayer.turretDirection = makePair(clientPlayer.turretDirection)
	return clientPlayer.position.vecAdd(clientPlayer.turretDirection.sProd(clientPlayer.radius));
}

function makePair(item){
	return new Pair(item.x, item.y)
}

function send(){
	socket.send("new Person COnnected");
}

function sendData (data){
	// data.type = 'initialConnection'
	data['id'] = id
	const sData = JSON.stringify(data)
	socket.send(sData)
}

/*
The client needs the position of everything
and it simply draws it out

*/

// function clientSocketConfiguration() {
// 	socket = new WebSocket("ws://localhost:8001");

// 	socket.onopen = function (event) {
// 		console.log("connected");
// 		send()
// 	};
// }


function toInt(x,y){ return new Pair(Math.round(x), Math.round(y)); }

function drawBall(context, ball) {

	context.fillStyle = ball.colour;
	// context.fillRect(this.x, this.y, this.radius,this.radius);
	context.beginPath(); 
	var intPosition = toInt(ball.position.x, ball.position.y);
	context.arc(intPosition.x, intPosition.y, ball.radius, 0, 2 * Math.PI, false); 
	context.fill();   
	
}

function drawBox(context, box) {
	
	var intPosition = toInt(box.position.x, box.position.y);
	var x=intPosition.x-box.radius;
	var y=intPosition.y-box.radius; 
	var width = box.radius*2; 
	context.fillStyle = box.colour;
	context.fillRect(x,y,width,width); 
	context.strokeStyle="x000";
	context.strokeRect(x,y,width,width);
}

function drawPlayer(context, player) {
	
	context.fillStyle = player.colour;
	context.beginPath(); 
	var intPosition = toInt(player.position.x, player.position.y);
	context.arc(intPosition.x, intPosition.y, player.radius, 0, 2 * Math.PI, false); 
	context.fill();

	if (id == player.id){
		//we will use client player for mouseMovement
		var turretPos = getTurretPosition()
		drawTurret(context, clientPlayer, turretPos)
	}else{
		//other Players
		var turretPos = player.turtPosition
		turretPos =  toInt(turretPos.x, turretPos.y);
		drawTurret(context, player, turretPos)
	}
	
}

function drawTurret(context, player, turretPos){

	console.log(turretPos);
	context.beginPath();
	context.arc(turretPos.x, turretPos.y, player.radius/2, 0, 2 * Math.PI, false); 
	context.fill();
}

function drawBullet(context, bullet) {
	console.log("Drawing bullet");
	console.log(bullet.position);
	
	
	context.fillStyle = bullet.colour;
	context.beginPath(); 
	// console.log(bullet.position,'----------');
	
	var intPosition = toInt(bullet.position.x, bullet.position.y)
	context.arc(intPosition.x, intPosition.y, bullet.radius, 0, 2 * Math.PI, false); 
	context.fill(); 
}

var moveMap2 = { 
	'a': [-1, 0],
	's': [0, 1],
	'd': [1, 0],
	'w': [0, -1],
	'e': [0,0]
};

var keyPressData = {
	type: 'none',
	x: 0,
	y: 0
}


//adding in mouse movement and actions
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

var mouseMovementData ={
	type: 'none',
	x: 0,
	y: 0
}

