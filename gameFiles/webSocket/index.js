// import {Pair}  from '../static-content/model'

function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

const safeJsonStringify = require('safe-json-stringify');
var model = require('./model')
var clientCounter = 0
/*

Basic Dataflow
    
    The client will send info to the server via websocket (ie:  information from the controller)
    -> The webSocket will receive the information and send that data to the model
    -> The model will compute and generate the updated model and send that model back to the client.
    
    The client will receive the new updated model, and draw it out.
    
    Model will generate a canvas based on what the id of the client, which should the same as the index of the
	actors array in the model.
	


	The Model will hold the main Game Canvas

	Types of broadcasts
		new Player broadCast (with configuration)
		if it is an existing client, send in a list of players
		
	The counter is being tracked on server
	first cut:
		send everything and the player computes the canvas based on what their perspective
	
	Second Cut:
		send the clients the new positions of the object
	
	
*/


/*
The model will hold a seperate mapping of a player list,
after the client sends their username, their player will be initialized
added to the model , and a mapping to in the in this socket.
*/
var counter = 0
var mainStage = new model.Stage()

/*
playerList is a list of actors 

	each actor is an object with configuration
		position
		velocity
		colour
		radius
		isZombie
		health

		stateVars.concat["fire", "amunition", "pickup"];
		turretDirection = new Pair(1,0);
		fire = false; // whether we have to fire a bullet in the next step
		pickup = false;
		ammunition = 0;

*/

//we have to use step instead

var WebSocketServer = require('ws').Server
   ,wss = new WebSocketServer({port: 8001});

wss.on('close', function() {
    console.log('disconnected');
});

wss.broadcast = function(message){
	for(let ws of this.clients){ 
		ws.send(message); 
	}
}

const getCircularReplacer = () => {
	const seen = new WeakSet();
	return (key, value) => {
	  if (typeof value === "object" && value !== null) {
		if (seen.has(value)) {
		  return;
		}
		seen.add(value);
	  }
	  return value;
	};
};


wss.sendMapCoordinates = function() {

	
	for (let ws of this.clients){
		
		const finalc = {
			id: 0,
			data: mainStage.actors,
		}
		// console.log(finalc.id);
		const check = JSON.stringify(finalc, getCircularReplacer())

		ws.send(check);
	}
	// const c = {...mainStage.actors, 'id': clientCounter}
}


wss.on('connection', function(ws) {

	//new Player needs to be added to the player list
	// const playerIndex  = mainStage.addNewPlayer()
	// mainStage.actors[playerIndex].assignId(ID()) //Each player has been assigned
	// console.log("Player id", mainStage.actors[playerIndex].id );
	
	// wss.sendMapCoordinates()
	

	ws.on('message', function(message) {
		const data = JSON.parse(message)
		handleClientAction(data)
	});
});

/*
Possible Actions
	making a new Player  --> makes a new Players based on the id provided 
	enabling pickUP ---> requires id
	movement ---> required id
	mouseMove ---> requires id
	mouseClick ---> required id

*/

function handleClientAction(data){
	console.log(data);
	
	switch (data.type) {
		case 'userName':
			//Data has the usernamem
			console.log("id Received :", data.id);
			mainStage.addNewPlayer(data.id)
		
			// console.log("Players Id",mainStage.playersID);

			break
		case 'pickup':
			console.log("-------------------------------picking up");
			mainStage.player.setPickup(true);
			// mainStage.step()
			break;
		case 'movement':
			console.log('---------------------------- Key Movement');
			mainStage.player.setDirection(data.x, data.y);
			//after setting the direction we have to use step
			// mainStage.step()
			break
		case 'mouseMovement':
			console.log('*--------------------------- Mouse Cursor Movement');
			mainStage.mouseMove(data.x, data.y);
			// mainStage.step()
			break
		case 'mouseClick':
			console.log('---------------------------- Mouse Click');
			mainStage.mouseClick(data.x, data.y)
			// mainStage.step()
			break
		default:
			break;
	}
}
function ID() {
	return '_' + Math.random().toString(36).substr(2, 9);
}

setInterval(function() {
	mainStage.step()
	wss.sendMapCoordinates()
}, 20)


