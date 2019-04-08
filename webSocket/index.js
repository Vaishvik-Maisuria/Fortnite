// const safeJsonStringify = require('safe-json-stringify');
var model = require('./model')
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
		const check = JSON.stringify(finalc, getCircularReplacer())

		if(ws.readyState === ws.OPEN){
			ws.send(check);
		}else{
			ws.close()
		}
	}
	// const c = {...mainStage.actors, 'id': clientCounter}
}


wss.on('connection', function(ws) {
	ws.on('message', function(message) {
		const data = JSON.parse(message)
		handleClientAction(data, ws)
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

function handleClientAction(data, ws){
	
	switch (data.type) {
		case 'deadPlayer':
			mainStage.removePlayer(data.playerIndex)
			break
		case 'userName':
			//Data has the username
			mainStage.addNewPlayer(data.id)
			break
		case 'pickup':
			// mainStage.player.setPickup(true);
			mainStage.setPickUpPlayer(data.playerIndex)	
			break;
		case 'movement':
			//now we need to set the direction with a mainStage method
			mainStage.setDirectionPlayer(data.x, data.y, data.playerIndex)
			break
		case 'touchClick':
			mainStage.mouseMovePlayer(data.x, data.y, data.playerIndex)
			mainStage.mouseClickPLayer(data.x, data.y, data.playerIndex)
			break

		case 'mouseMovement':
			mainStage.mouseMovePlayer(data.x, data.y, data.playerIndex)
			break
		case 'mouseClick':
			mainStage.mouseClickPLayer(data.x, data.y, data.playerIndex)
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


