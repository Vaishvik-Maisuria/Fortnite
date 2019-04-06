
class Pair {
	constructor(x,y){ this.x=x; this.y=y; }
	toString(){ return "("+this.x+","+this.y+")"; }
	norm2(){ return Math.sqrt(this.x*this.x+this.y*this.y); }
	normalize(){ return this.sProd(1.0/this.norm2()); }
	toInt(){ return new Pair(Math.round(this.x), Math.round(this.y)); }
	clone(){ return new Pair(this.x, this.y); }
	sProd(z){ return new Pair(this.x*z, this.y*z); }
	dotProd(other){ return new Pair(this.x*other.x, this.y*other.y); }
	vecAdd(other){ return new Pair(this.x+other.x, this.y+other.y); }
	vecSub(other){ return new Pair(this.x-other.x, this.y-other.y); }
}

export function ID() {
	return '_' + Math.random().toString(36).substr(2, 9);
}

export function toInt(x,y){ return new Pair(Math.round(x), Math.round(y)); }


export function draw(context, config, playerIndex, clientPlayer, windowWidth, windowHeight) {
	// var context = canvas2.getContext('2d')
	
    // var player = config[playerIndex]
    var player = clientPlayer

	// if (clientPlayer == null){
	// 	clientPlayer = config[playerIndex]
	// }else{
	// 	clientPlayer.position = player.position
    // }
    
	// console.log('player id ', player.id);
	
	let playerPosition = toInt(player.position.x, player.position.y);
	let x=playerPosition.x;
	let y=playerPosition.y;
	
	// console.log("x="+x+" y="+y);

	let xt=-x+windowWidth/2;
	// if(x<this.canvasWidth/2)xt=0;
	// if(x>this.width-this.canvasWidth/2)xt=-this.width+this.canvasWidth;

	let yt=-y+windowHeight/2;
	// if(y<this.canvasHeight/2)yt=0;
	// if(y>this.height-this.canvasHeight/2)yt=-this.height+this.canvasHeight;

	context.resetTransform();

	context.fillStyle = '#6f6';
	context.clearRect(0, 0, windowWidth, windowHeight);

	context.translate(xt,yt);
	context.fillRect(0, 0, 10000, 10000);
	

	for (var i = 0; i < config.length; i ++){
		const type = config[i].actorType
	
		
		switch (type) {
			case 'Bullet':
			
				drawBullet(context, config[i])
				break
			case 'Tank':
				drawPlayer(context, config[i], clientPlayer)
				
				// console.log(i);
				break;
			case 'Ball':
				drawBall(context, config[i])
				break
			case 'Box':
				drawBox(context, config[i])
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
export function pointTurret(crosshairs, player){
	player.position = new Pair(player.position.x, player.position.y)
    var delta = crosshairs.toInt().vecSub(player.position.toInt());
    if(delta.x!=0 || delta.y !=0){
        player.turretDirection = delta.normalize();
    }
    
    return player
	// clientPlayer = player
    // console.log(this.turretDirection);
    
}

// Map an canvas coordinates to world coordinates
export function mapCanvasToWorld(canvasPosition, player, windowWidth, windowHeight){
	player.position = new Pair(player.position.x, player.position.y)

    var halfCanvas = (new Pair(windowWidth/2, windowHeight/2)).toInt();
    var playerPosition = player.position.toInt();

    var worldPosition = canvasPosition.vecAdd(playerPosition.vecSub(halfCanvas));
    return worldPosition;
}

/** Handle the mouse movement on the stage in canvas coordinates **/
export function mouseMove(x,y, player, windowWidth, windowHeight ){
	var canvasPosition=new Pair(x,y);
	
    var worldPosition= mapCanvasToWorld(canvasPosition, player, windowWidth, windowHeight);
	var updatedPlayer = pointTurret(worldPosition, player);
	
    return updatedPlayer
}

export function getTurretPosition(clientPlayer){
	// position = ((x,y)+turretDirection*this.radius).toInt()
	clientPlayer.position = makePair(clientPlayer.position)
	clientPlayer.turretDirection = makePair(clientPlayer.turretDirection)
	return clientPlayer.position.vecAdd(clientPlayer.turretDirection.sProd(clientPlayer.radius));
}

export function makePair(item){
	return new Pair(item.x, item.y)
}

export function send(){
	socket.send("new Person COnnected");
}

export function sendData (data){
	// data.type = 'initialConnection'
	data['id'] = id
	const sData = JSON.stringify(data)
	socket.send(sData)
}

/*
The client needs the position of everything
and it simply draws it out

*/

// export function clientSocketConfiguration() {
// 	socket = new WebSocket("ws://localhost:8001");

// 	socket.onopen = export function (event) {
// 		console.log("connected");
// 		send()
// 	};
// }


// export function toInt(x,y){ return new Pair(Math.round(x), Math.round(y)); }

export function drawBall(context, ball) {

	context.fillStyle = ball.colour;
	// context.fillRect(this.x, this.y, this.radius,this.radius);
	context.beginPath(); 
	var intPosition = toInt(ball.position.x, ball.position.y);
	context.arc(intPosition.x, intPosition.y, ball.radius, 0, 2 * Math.PI, false); 
	context.fill();   
	
}

export function drawBox(context, box) {
	
	var intPosition = toInt(box.position.x, box.position.y);
	var x=intPosition.x-box.radius;
	var y=intPosition.y-box.radius; 
	var width = box.radius*2; 
	context.fillStyle = box.colour;
	context.fillRect(x,y,width,width); 
	context.strokeStyle="x000";
	context.strokeRect(x,y,width,width);
}

export function drawPlayer(context, player, clientPlayer) {
	
	context.fillStyle = player.colour;
	context.beginPath(); 
	var intPosition = toInt(player.position.x, player.position.y);
	context.arc(intPosition.x, intPosition.y, player.radius, 0, 2 * Math.PI, false); 
    context.fill();
    
	if (clientPlayer.id == player.id){

		// we will use client player for mouseMovement
		var turretPos = getTurretPosition(clientPlayer)
		drawTurret(context, clientPlayer, turretPos)
	}else{
		//other Players
		var turretPos = player.turtPosition
		turretPos =  toInt(turretPos.x, turretPos.y);
		drawTurret(context, player, turretPos)
	}
	
}

export function drawTurret(context, player, turretPos){

	// console.log(turretPos);
	context.beginPath();
	context.arc(turretPos.x, turretPos.y, player.radius/2, 0, 2 * Math.PI, false); 
	context.fill();
}

export function drawBullet(context, bullet) {
	// console.log("Drawing bullet");
	// console.log(bullet.position);
	
	
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
export function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

export function getTouchPos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.touches[0].pageX - rect.left,
        y: event.touches[0].pageY - rect.top
    };
}

var mouseMovementData ={
	type: 'none',
	x: 0,
	y: 0
}