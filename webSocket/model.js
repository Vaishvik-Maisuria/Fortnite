function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

class Stage {
    //Stage in the server wont have any players initially
	constructor(){
        
        // this.canvas = document.createElement('canvas')
        this.canvas = null
        this.canvasImg = null

        // this.canvas = canvas;
        
		
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
		this.player= null; // a special actor, the player
		this.playersID = []
		this.bullets = []
		// the logical width and height of the stage
		/**
		this.width=canvas.width;
		this.height=canvas.height;
		**/
		

		this.width=10000;
		this.height=10000;


		this.canvasWidth=700
		this.canvasHeight=700
		// this.canvasWidth=canvas.width;
		// this.canvasHeight=canvas.height;


		// The player
		// let s = this.randomState();
		// var sampleColor = 'rgba(0,0,0,1)'
		// var b = new Tank(this, s.position, s.velocity, sampleColor, s.radius);

		// this.addPlayer(b);
		this.totalPlayers = 0

		let numBalls=100, numBoxes=numBalls*10, numOpponents=numBalls;
		// Some balls
		
		const check = new Pair(10, 10)
		console.log("Sample type check", typeof(check));
			

		for(let i=0;i<numBalls;i++){
			let s = this.randomState();
			var b = new Ball(this, s.position, s.velocity, s.colour, s.radius);
			this.addActor(b);
		}

		// Lots of boxes
		for(let i=0;i<numBoxes;i++){
			let s = this.randomState();
			var b = new Box(this, s.position, s.colour,40);
			this.addActor(b);
		}
	}
	
	randomState(){
		var red=randint(255), green=randint(255), blue=randint(255), alpha = Math.random();
		var x=Math.floor((Math.random()*this.width)),
			y=Math.floor((Math.random()*this.height));
	
		return {
			radius : randint(20),
			colour: 'rgba('+red+','+green+','+blue+','+alpha+')',
			position : new Pair(x,y),
			velocity : new Pair(rand(20), rand(20)),
		}
	}

	/** Handle the mouse movement on the stage in canvas coordinates **/
	mouseMovePlayer(x,y, playerIndex){
		var canvasPosition=new Pair(x,y);
		var worldPosition = this.mapCanvasToWorldPlayer(canvasPosition, playerIndex)
		this.actors[playerIndex].pointTurret(worldPosition)
	}

	// Map an canvas coordinates to world coordinates
	mapCanvasToWorldPlayer(canvasPosition, playerIndex){
		var halfCanvas = (new Pair(this.canvasWidth/2, this.canvasHeight/2)).toInt();
		var playerPosition = this.actors[playerIndex].position.toInt()
		var worldPosition = canvasPosition.vecAdd(playerPosition.vecSub(halfCanvas));
		return worldPosition;
	}

	setPickUpPlayer(playerIndex) {
		this.actors[playerIndex].setPickup(true)
	}

	/** Handle the mouse click on the stage in canvas coordinates **/
	mouseClick(x,y){
		var canvasPosition=new Pair(x,y);
		var worldPosition=this.mapCanvasToWorld(canvasPosition);
		this.player.setFire(true);
	}

	/** Handle the mouse click on the stage in canvas coordinates **/
	mouseClickPLayer(x,y, playerIndex){
		// var canvasPosition=new Pair(x,y);
		// var worldPosition=this.mapCanvasToWorld(canvasPosition);
		
		this.actors[playerIndex].setFire(true)
		// this.player.setFire(true);
	}

	addPlayer(player){
		this.addActor(player);
		this.player=player;
	}

	removePlayer(){
		this.removeActor(this.player);
		this.player=null;
	}

	addBullets(bullet){
		console.log("added bullet");
		let acttorLength = this.playersID.length + 5; 
		this.actors.splice(acttorLength, 0, bullet)
		// console.log(this.actors);
		// this.bullets.push(bullet)
		// this.actors.unshift(actor);
	}

	addActor(actor){
		this.actors.push(actor);
	}
	
	setDirectionPlayer(x, y,index) {
		//index represents the index in the actors list
		this.actors[index].setDirection(x,y)
	}

	/*
	Now we have to figure out how each player movement should be configured
	*/
	addNewPlayer(id){
		//each new Player is added to the front of the list
		//Tank player object will have a id , and the playersID object in the stage
		//will also keep that updated
		let s = this.randomState();
		var sampleColor = 'rgba(0,0,0,1)'
		var fixPosition = new Pair(250,250)
		//@Todo
		var b = new Tank(this, fixPosition, s.velocity, s.colour, s.radius);
		b.assignId(id)
		this.actors.splice(0,0,b)
		this.playersID.splice(0,0,id)
		
	}

	removeActor(actor){
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
		}
    }
    
	animate(){
		this.step();
		// this.draw();
		// Remove zombies
		this.actors = this.actors.filter(actor => !actor.isZombie);
	}

	// Take one step in the animation of the game.  
	// Do this by asking each of the actors to take a single step. 
	step(){
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].step();
			this.checkDeadState(i)
		}
	}

	checkDeadState(index){
		if (this.actors[index].actorType == 'Tank'){
			if (this.actors[index].health <= 0){
				this.actors[index].setDead(true)
			}
		}
		
	}

	draw(){
		var context = this.canvas.getContext('2d');

		let playerPosition = this.player.position.toInt();
		let x=playerPosition.x;
		let y=playerPosition.y;
		// console.log("x="+x+" y="+y);

		let xt=-x+this.canvasWidth/2;
		// if(x<this.canvasWidth/2)xt=0;
		// if(x>this.width-this.canvasWidth/2)xt=-this.width+this.canvasWidth;

		let yt=-y+this.canvasHeight/2;
		// if(y<this.canvasHeight/2)yt=0;
		// if(y>this.height-this.canvasHeight/2)yt=-this.height+this.canvasHeight;

		context.resetTransform();

		context.fillStyle = '#6f6';
		context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		context.translate(xt,yt);
		context.fillRect(0, 0, this.width, this.height);

		for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
        }
        
        this.canvasImg = context.canvas.toDataURL("image/png")
	}

	// return the first actor at coordinates (x,y) return null if there is no such actor
	getActor(x, y){
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}
		return null;
    }


} // End class Stage

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



class Actor {
	constructor(stage, position, velocity, colour, radius){
		this.stage = stage;

		// Below is the state of this
		this.position=position;
		this.velocity=velocity;
		this.colour = colour;
		this.radius = radius;
		this.isZombie = false;
		this.health = 10;

		this.stateVars = [ "position" , "velocity", "colour", "radius", "isZombie", "health" ]; // should be static
		this.savedState = {};
	}
	saveState(){
		this.savedState={};
		for(var s in this.stateVars){
			this.savedState[this.stateVars[s]]= this[this.stateVars[s]];
		}
	}
	

	makeZombie(){ this.isZombie = true; }

	collide(other){ 
		
		// Stop us moving when we collide with someone else
		this.position = this.savedState.position;
		this.velocity = new Pair(0,0);
	}

	// Return a list of actors close this
	getCloseActors(delta){
		var closeActors = [];
 		for(var i in this.stage.actors){
			var other = this.stage.actors[i];
			if(other==this)continue;
			var distanceBetween = this.position.vecSub(other.position).norm2();
			if(distanceBetween<=(this.radius+other.radius+delta)){
				closeActors.push(other);
			}
                }
		return closeActors;
	}

	step(){
		// Save our previous state, just in case
		this.saveState(); 
		this.position=this.position.vecAdd(this.velocity);

		var collidingActors = this.getCloseActors(0);
		for(var i in collidingActors)this.collide(collidingActors[i]);
			
		// bounce off the walls
		if(this.position.x<0){
			this.position.x=0;
			this.velocity.x=Math.abs(this.velocity.x);
		}
		if(this.position.x>this.stage.width){
			this.position.x=this.stage.width;
			this.velocity.x=-Math.abs(this.velocity.x);
		}
		if(this.position.y<0){
			this.position.y=0;
			this.velocity.y=Math.abs(this.velocity.y);
		}
		if(this.position.y>this.stage.height){
			this.position.y=this.stage.height;
			this.velocity.y=-Math.abs(this.velocity.y);
		}
	}

	draw(context){
		context.fillStyle = this.colour;
   		// context.fillRect(this.x, this.y, this.radius,this.radius);
		context.beginPath(); 
		var intPosition = this.position.toInt();
		context.arc(intPosition.x, intPosition.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();   
	}
}

class Ball extends Actor {
	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		this.actorType = 'Ball'
	}
	
	headTo(position){
		this.velocity = position.vecSub(this.position).normalize();
	}

	toString(){
		return this.position.toString() + " " + this.velocity.toString();
	}
}

class Box extends Actor {
	constructor(stage, position, colour, radius){
		var velocity = new Pair(0,0);
		super(stage, position, velocity, colour, radius);
		this.actorType = "Box"
	}
	draw(context){
		var intPosition = this.position.toInt();
		var x=intPosition.x-this.radius;
		var y=intPosition.y-this.radius; 
		var width = this.radius*2; 
		context.fillStyle = this.colour;
		context.fillRect(x,y,width,width); 
		context.strokeStyle="x000";
		context.strokeRect(x,y,width,width);
	}
	step(){ return; }
}

class Tank extends Actor {
	constructor(stage, position, velocity, colour, radius){

		super(stage, position, velocity, colour, 10);

		this.stateVars.concat["fire", "amunition", "pickup"];
		this.actorType = "Tank"
		this.turretDirection = new Pair(1,0);
		this.fire = false; // whether we have to fire a bullet in the next step
		this.pickup = false;
		this.ammunition = 0;
		this.id = 0
		this.turtPosition = this.getTurretPosition()
		this.dead = false
	}

	assignId(id){
		this.id = id
		// this.stage.playersID.push(this.id)
	}
	
	setDead(val){
		this.dead = val
	}

	// Point the turret at crosshairs in world coordinates
	pointTurret(crosshairs){
		var delta = crosshairs.toInt().vecSub(this.position.toInt());
		if(delta.x!=0 || delta.y !=0){
			this.turretDirection = delta.normalize();
		}
	}
	getTurretPosition(){
		// position = ((x,y)+turretDirection*this.radius).toInt()
		return this.position.vecAdd(this.turretDirection.sProd(this.radius));
	}

	collide(other){ 
		
		
		
		// Stop us moving when we collide with someone else
		this.position = this.savedState.position;
		this.velocity = new Pair(0,0);
	}

	step(){
		console.log("The health of the actor = " + this.health);
	
		if(this.fire && this.amunition>0){
			this.amunition--;
			console.log("In the tanks ")
			var bulletVelocity = this.turretDirection.sProd(5).vecAdd(this.velocity);
			var bulletPosition = this.position.vecAdd(this.turretDirection.sProd(this.radius*2));;
			var bullet = new Bullet(this.stage, bulletPosition, bulletVelocity, "#000000", this.radius/5);
			this.stage.addBullets(bullet);
			// console.log("step function is getting called and bullet is getting added to the stage");
			// this.stage.addActor(bullet);
		}
		this.setFire(false);
		console.log("this.pickup: " + this.pickup);
		if(this.pickup){
			var closeActors = this.getCloseActors(5); // we may not be touching, but pick them up just the same
			var closeActor = closeActors.find(actor => actor.constructor.name=="Box");
			if(closeActor){
				this.amunition=30;
				this.health = 10;
			}
		}
		this.setPickup(false);		
		
		super.step();
		this.velocity=this.velocity.sProd(.95);
		this.turtPosition = this.getTurretPosition().toInt()
	}
	setDirection(dx,dy){
		var newDirection = new Pair(dx,dy);
		var newVelocity = this.velocity.vecAdd(newDirection);
		var m = newVelocity.norm2();
		if(m>5)newVelocity=newVelocity.normalize().sProd(5);
		this.velocity = newVelocity;
	}

	
	setFire(val){ this.fire = val; }
	setPickup(val){ 
		// console.log('Pick up enabled');
		
		this.pickup = val; 
	}
}

class Opponent extends Tank {
	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, "#ff0000", 10);
		this.health=1;
		this.stateVars.concat["fireDelay"];
		this.amunition=100;
		this.fireDelay = 400;
	}
	setDirection(dx,dy){
		var newDirection = new Pair(dx,dy);
		var newVelocity = this.velocity.vecAdd(newDirection);
		var m = newVelocity.norm2();
		if(m>2)newVelocity=newVelocity.normalize().sProd(2);
		this.velocity = newVelocity;
	}
	step(){
		var player = this.stage.player;
		var toPlayer = player.position.vecSub(this.position).normalize();
		this.setDirection(toPlayer.x, toPlayer.y);
		this.pointTurret(player.position);
		if(toPlayer.norm2()<100){
			this.fireDelay=this.fireDelay-1;
			if(this.fireDelay<=0){
				this.setFire(true);
				this.fireDelay = 400;
			}
		}
		super.step();
	}
}

class Bullet extends Actor {
	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		this.lifetime = 200;
		this.actorType = 'Bullet'
	}

	collide(other, newState){
		this.makeZombie();
		other.health--;

		if(other.health<=0)other.makeZombie();
	}

	step(){
		super.step();
		this.lifetime = this.lifetime -1;
		if(this.lifetime <= 0)this.makeZombie();
	}
	draw(context){
		context.fillStyle = this.colour;
		context.beginPath(); 
		var intPosition = this.position.toInt();
		context.arc(intPosition.x, intPosition.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();   
	}
}

module.exports = {Stage, Pair, Actor, Ball, Box, Tank, Opponent, Bullet}

