const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const path = require("path");
// import Sql from 'better-sqlite3';
// import fs from 'fs';

// start the express app
const app = express();

// app uses the following
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use('/', express.static(path.join(__dirname, '/frontend/dist')));
app.use(bodyParser.json());

// app gets the components 
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./frontend/dist/index.html"))});


const sqlite3 = require('sqlite3').verbose();

// will create the db if it does not exist
var db = new sqlite3.Database('db/database.db', (err) => {
	if (err) {
		// console.error(err.message);
	}
	console.log('Connected to the database.');
});
// need to intilize sqlite3
// if (!fs.existsSync('db/database.db')) {
//   fs.mkdirSync('db/database.db')
// }

// var db = new sqlite3.Database('db/database.db', (err) => {
// 	if (err) {
// 		console.error(err.message);
// 	}
	
// });

// const databaseMiddleware = (req, res, next) => {
//   const env = process.env.NODE_ENV
//   const db = new Sql(path.join('db/database.db', `${env}.db`))
//   console.log('Connected to the database.');
// }

// app.use(databaseMiddleware);

// // will create the db if it does not exist
// let db = new sqlite3.Database('db/database.db', (err) => {
// 	if (err) {
// 		console.error(err.message);
// 	}
// 	console.log('Connected to the database.');
// });






//Hello World 
app.get('/api/greeting', (req, res) => {
	
  const name = req.body.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

// login 
function isEmptyObject(obj){
	return Object.keys(obj).length === 0;
}

app.post('/api/login', function (req, res) {
	var user = req.body.user;
	var password = req.body.password;

	var result = { "error": {} , "success":false};
	if(user==""){
		result["error"]["user"]="user not supplied";
	}
	if(password==""){
		result["error"]["password"]="password not supplied";
	}
	if(isEmptyObject(result["error"])){
		let sql = 'SELECT * FROM user WHERE user=? and password=?;';
		db.get(sql, [user, password], function (err, row){
  			if (err) {
				res.status(500); 
    				result["error"]["db"] = err.message;
  			} else if (row) {
				res.status(200);
				result.success = true;
			} else {
				res.status(401);
				result.success = false;
    				result["error"]["login"] = "login failed";
			}
			res.json(result);
		});
	} else {
		res.status(400);
		res.json(result);
	}
});

function validateUser(data){
	result = {};

	var user = data.user;
	var password = data.password;
	var confirmpassword = data.confirmpassword;
	var skill = data.skill;
	var year= data.year;
	var month= data.month;
	var day= data.day;

	console.log(user,password,confirmpassword,skill,year,month,day + "\n\n");

	if(!user || user==""){
		result["user"]="user not supplied";
	}
	if(!password || password==""){
		result["password"]="password not supplied";
	}
	if(!confirmpassword || password!=confirmpassword){
		result["confirmpassword"]="passwords do not match ";
	}
	if(!skill || -1==["beginner","intermediate","advanced"].indexOf(skill)){
		result["skill"]="invalid skill";
	}
	if(!year || !/^\d{4}$/.test(year)){
		result["year"]="invalid year";
	} else {
		year = parseInt(year);
		if(!(1900<=year && year<=2100))result["year"]="invalid year";
	}
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	if(!month || -1==months.indexOf(month)){
		result["year"]="invalid month";
	}
	if(!day || !/^\d{1,2}$/.test(day)){
		result["day"]="invalid day";
	} else {
		day = parseInt(day);
		if(!(1<=day && day<=31))result["day"]="invalid day";
	}
	return result;
}

// Create a new user
app.post('/api/user/:user', function (req, res) {
// app.post('/api/user', function (req, res) {
	console.log('adding in new user');
	console.log(req.user,req.password,req.confirmpassword,req.skill,req.year,req.month,req.day + "\n\n");
	var result = { error: validateUser(req.body) , success:false};
	if(!isEmptyObject(result["error"])){
		let sql = 'INSERT INTO user '+
			'(user, password, skill, year, month, day, playmorning, playafternoon, playevening) ' +
			' VALUES(?,?,?,?,?,?,?,?,?);';
		let d = req.body;
		let params = [d.user, d.password, d.skill, d.year, d.month, d.day, d.playmorning, d.playafternoon, d.playevening];

		db.run(sql, params, function (err){
  			if (err) {
				res.status(500); 
    				result["error"]["db"] = err.message;
  			} else {
				if(this.changes!=1){
    					result["error"]["db"] = "Not updated";
					res.status(404);
				} else {

					let sql = 'insert into score (username) values(?);'
					db.run(sql,[d.user], function(err){
						if (err){
							res.status(500); 
							result["error"]["db"] = err.message;
						}else{
							res.status(200);
							result.success = true;
						}
							
					})
					// res.status(200);
					// result.success = true;
				}
			}
			res.json(result);
		});
	} else {
		res.status(400);
		res.json(result);
	}
});

// Update user
app.put('/api/user/:user', function (req, res) {
	var result = { error: validateUser(req.body) , success:false};
	if(isEmptyObject(result["error"])){
		let sql = 'UPDATE user SET '+
			' password=?, skill=?, year=?, month=?, day=?, playmorning=?, playafternoon=?, playevening=? ' +
			' WHERE user=? AND password=?;';
		let d = req.body;
		let params = [d.password, d.skill, d.year, d.month, d.day, d.playmorning, d.playafternoon, d.playevening, d.credentials.user, d.credentials.password];

		db.run(sql, params, function (err){
  			if (err) {
				res.status(500); 
    				result["error"]["db"] = err.message;
  			} else {
				if(this.changes!=1){
    					result["error"]["db"] = "Not updated";
					res.status(404);
				} else {
					res.status(200);
					result.success = true;
				}
			}
			res.json(result);
		});
	} else {
		res.status(400);
		res.json(result);
	}
});

// /api/user/addKills/

app.put('/api/user/addKills/:user', function (req, res) {
	console.log('in add kills');
	console.log("Data", req.body);

	var result = { data: null, success: false, error: {}}
	result.data = "Something New";
	if(isEmptyObject(result["error"])){
		// let sql = 'SELECT * FROM score WHERE username=?'
		let sql = "UPDATE score SET score=(Select score from score where username=?) + ? where username=?;"
		let d = req.body;

		db.get(sql, [d.userName,10,d.userName ], function(err, row){
			if (err) {
				res.status(500); 
				result["error"]["db"] = err.message;
			}else {
				console.log(row);
				// updateScore(row, d.kills)
				res.status(200);
				// if(this.changes!=1){
				// 	result["error"]["db"] = "Not updated";
				// 	res.status(404);
				// } else {
				// 	
				// 	console.log('row score', row);
				// 	result.success = true;
				// }	
			}
			// res.json(result);
		});
	} else {
		res.status(400);
		res.json(result);
	}
});



// Update user
app.put('/api/user/:user', function (req, res) {
	var result = { error: validateUser(req.body) , success:false};
	if(isEmptyObject(result["error"])){
		let sql = 'UPDATE user SET '+
			' password=?, skill=?, year=?, month=?, day=?, playmorning=?, playafternoon=?, playevening=? ' +
			' WHERE user=? AND password=?;';
		let d = req.body;
		let params = [d.password, d.skill, d.year, d.month, d.day, d.playmorning, d.playafternoon, d.playevening, d.credentials.user, d.credentials.password];

		db.run(sql, params, function (err){
  			if (err) {
				res.status(500); 
    				result["error"]["db"] = err.message;
  			} else {
				if(this.changes!=1){
    					result["error"]["db"] = "Not updated";
					res.status(404);
				} else {
					res.status(200);
					result.success = true;
				}
			}
			res.json(result);
		});
	} else {
		res.status(400);
		res.json(result);
	}
});


// get user and password
app.get('/api/user/:user', function (req, res) {
	// console.log(JSON.stringify(req));
	// var user = req.body.user;
	// var password = req.body.password;

	var user = req.params.user;
	var password = req.query.password;

	var result = { error: {} , success:false};
	if(user==""){
		result["error"]["user"]="user not supplied";
	}
	if(password==""){
		result["error"]["password"]="password not supplied";
	}
	if(isEmptyObject(result["error"])){
		let sql = 'SELECT * FROM user WHERE user=? and password=?;';
		db.get(sql, [user, password], function (err, row){
  			if (err) {
				res.status(500); 
    				result["error"]["db"] = err.message;
  			} else if (row) {
				res.status(200);
				result.data = row;
				result.success = true;
			} else {
				res.status(401);
				result.success = false;
    				result["error"]["login"] = "login failed";
			}
			res.json(result);
		});
	} else {
		res.status(400);
		res.json(result);
	}
});


app.get('/api/users/', function (req, res) {
	// console.log(JSON.stringify(req));
	// var user = req.body.user;
	// var password = req.body.password;
	var result = { error: {} , success:false};
	let sql = 'SELECT * FROM score;';
	db.all(sql, function (err, row){
		// console.log("row, err", row, err);
		
		if (err) {
			res.status(500); 
				result["error"]["db"] = err.message;
		} else if (row) {
			res.status(200);
			result.data = row;
			result.success = true;
			// console.log('info received', row);
			
		} else {
			res.status(401);
			result.success = false;
				result["error"]["login"] = "login failed";
		}
		res.json(result);
	});
	
});


app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);