stage=null;
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
document.addEventListener('DOMContentLoaded', function() {
	//This executes after the main html has loaded
	//Meaning everything is loaded
	canvas2 = document.getElementById('stage2')

	socket = new WebSocket("ws://localhost:8001");
	socket.onopen = function (event) {
		// const check = randint(100)
		// sendData(check)
		//send in a new Data
		// id = ID()
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
		// console.log("in on message");
		var item = JSON.parse(event.data)
		// console.log(item);
		
		// console.log(item);
		// console.log("id:", item.id);
		// console.log(item.id);
		
		// const check = item.playerList[id]
		// console.log(check);
		
		// id = item.id
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

	// setInterval(function() {
	// 	const data = JSON.stringify(mouseMovementData)
	// 	socket.send(data);
	
	// }, 400)
	
	

})

function ID() {
	return '_' + Math.random().toString(36).substr(2, 9);
}


function draw(context) {
	// var context = canvas2.getContext('2d')
	
	
	var player = config[playerIndex]
	// if (clientPlayer == null){
	// 	clientPlayer = config[playerIndex]
	// }
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

function clientSocketConfiguration() {
	socket = new WebSocket("ws://localhost:8001");

	socket.onopen = function (event) {
		console.log("connected");
		send()
	};
}


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
	if (id == player.id){
		if (clientPlayer == null){
			clientPlayer = player
		}
	}else{
		clientPlayer = player
	}

	// console.log('client', clientPlayer.turretDirection);
	

	context.fillStyle = player.colour;
	context.beginPath(); 
	var intPosition = toInt(player.position.x, player.position.y);
	context.arc(intPosition.x, intPosition.y, player.radius, 0, 2 * Math.PI, false); 
	context.fill();   
	
	// clientPlayer.position = player.position
	var turretPos = null
	if (id == player.id){
		//Client Player
		clientPlayer.position = player.position
		var turretPos = getTurretPosition()
		console.log('in here');
		
	}else {
		var turretPos = player.turtPosition
	} 
	// var turretPos = getTurretPosition()
	// var turretPos = player.turtPosition
	turretPos =  toInt(turretPos.x, turretPos.y);
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





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

gui_state = {
	isLoggedIn : false,
	user     : "",
	password : ""
};

//This controls which ui to show
function showUI(ui){
	// initalizingListiners()
	$(".ui_top").hide();
	clearErrors(ui);
	if(!gui_state.isLoggedIn){
		$("#ui_nav").hide();
		if(ui!="#ui_login" && ui!="#ui_register"){
			ui="#ui_login";
			
		}
	} else {
		var ui_name = ui.substr(1); // remove the #
		$("#ui_nav").show();
		$("#ui_nav a").removeClass("nav_selected");
		$("#ui_nav a[name="+ui_name+"]").addClass("nav_selected");
	}
	if(ui=="#ui_play"){
		console.log("in play");
		
		setupGame();
		startGame();
		// drawCanvas(config)
	}else{pauseGame();}
	$(ui).show();
}

//Get Mouse Position relative to the canvas size
// function getMousePos(canvas, evt) {
//     var rect = canvas.getBoundingClientRect();
//     return {
//         x: evt.clientX - rect.left,
//         y: evt.clientY - rect.top
//     };
// }

//Creates a instance of the game and initializes the eventListener
function setupGame(){
	// send()
	canvas=document.getElementById('stage');
	// console.log(config);
	
	stage=new Stage(canvas);

	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', function(event){
		var key = event.key;
		var moveMap = { 
			'a': { "dx": -1, "dy": 0},
			's': { "dx": 0, "dy": 1},
			'd': { "dx": 1, "dy": 0},
			'w': { "dx": 0, "dy": -1}
		};
		if(key in moveMap){
			stage.player.setDirection(moveMap[key].dx, moveMap[key].dy);
		} else if(key=="e"){
			stage.player.setPickup(true);
		}
	});
	//report the mouse position on click
	canvas.addEventListener("mousemove", function (event) {
    		var mousePos = getMousePos(canvas, event);
    		// console.log(mousePos.x + ',' + mousePos.y);
		stage.mouseMove(mousePos.x, mousePos.y);
	}, false);
	canvas.addEventListener("click", function (event) {
    		var mousePos = getMousePos(canvas, event);
    		// console.log(mousePos.x + ',' + mousePos.y);
		stage.mouseClick(mousePos.x, mousePos.y);
	}, false);
}

//Starts up the game animation 
function startGame(){
	interval=setInterval(function(){ stage.animate(); },20);
}


//Pauses the game, clears the interval
function pauseGame(){
	clearInterval(interval);
	interval=null;
}

//updates the logout flow
function gui_logout(){
	gui_state.isLoggedIn=false;
	gui_state.user="";
	gui_state.password="";
	showUI("#ui_login");
}

//Clears up the error to a empty string
function clearErrors(ui){
	$(ui+" .form-errors").html("");
}

//Fills up the error element with the errors
function showErrors(ui,response){
	let s="";
	let errors=response.error;
	for(let e in errors){
		s = s+errors[e]+"<br/>";
	}
	$(ui+" .form-errors").html(s);
}

//Handles the login flow
function gui_login(){
	var user = $("#ui_login [name=user]").val();
	var password = $("#ui_login [name=password]").val();
	clearErrors("#ui_login");
	var f = function(data, success){
		var s = success && data.success;
		if(s){
			gui_state.isLoggedIn=true;
			gui_state.user=user;
			gui_state.password=password;
                        setupGame(); 
                        showUI("#ui_play");
		} else {
			gui_state.isLoggedIn=false;
			gui_state.user="";
			gui_state.password="";
                        showUI("#ui_login");
			showErrors("#ui_login",data);
		}
	}
	api_login(user, password, f);
}

function checkboxSelected(value){
	if(value)return true;
	return false;
}

function getProfileFromForm(formId){
	var data = {
		user : $(formId+" [data-name=user]").val(),
		password : $(formId+" [data-name=password]").val(),
		confirmpassword : $(formId+" [data-name=confirmpassword]").val(),
		skill : $(formId+" [data-name=skill]:checked").val(),
		year: $(formId+" [data-name=year]").val(),
		month: $(formId+" [data-name=month]").val(),
		day: $(formId+" [data-name=day]").val(),
		playmorning: checkboxSelected($(formId+" [data-name=playmorning]:checked").val()),
		playafternoon: checkboxSelected($(formId+" [data-name=playafternoon]:checked").val()),
		playevening: checkboxSelected($(formId+" [data-name=playevening]:checked").val())
	};
	return data;
}

function gui_register(){
	clearErrors("#ui_register");
	var data = getProfileFromForm("#ui_register");
	var f = function(response, success){
		if(success){
                        showUI("#ui_login");
		} else {
			showErrors("#ui_register",response);
		}
	}
	api_register(data, f);
}

function gui_profile(){
	clearErrors("#ui_profile");
	var data = getProfileFromForm("#ui_profile");
	var f = function(response, success){
		if(success){
			gui_state.password = data.password; // in case password changed
		} else {
			showErrors("#ui_profile",response);
		}
	}
	var credentials = { user: gui_state.user, password: gui_state.password };
	api_profile(data, f, credentials);
}

function putDataIntoProfileForm(data){
	var formId="#ui_profile";
	$(formId+" [data-name=user]").html(data.user);
	$(formId+" [data-name=password]").val(data.password);
	$(formId+" [data-name=confirmpassword]").val(data.password);
	$(formId+" [data-name=skill][value="+data.skill+"]").attr('checked',true);
	$(formId+" [data-name=year]").val(data.year);
	$(formId+" [data-name=month]").val(data.month);
	$(formId+" [data-name=day]").val(data.day);
	$(formId+" [data-name=playmorning]").attr('checked', data.playmorning==1);
	$(formId+" [data-name=playafternoon]").attr('checked', data.playafternoon==1);
	$(formId+" [data-name=playevening]").attr('checked', data.playevening==1);
}

function gui_profile_load(){
	var credentials = { user: gui_state.user, password: gui_state.password };
	var f = function(response, success){
		if(success){
			// response.data has fields to load into our form
			putDataIntoProfileForm(response.data);
			showUI("#ui_profile");
		} else {
			showErrors("#ui_profile",response);
		}
	}
	var credentials = { user: gui_state.user, password: gui_state.password };
	api_profile_load(f, credentials);
}

// This is executed when the document is ready (the DOM for this document is loaded)
$(function(){
        showUI("#ui_login");
});

