// connecting to the database using Mongoose

var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/meanhotel';

mongoose.connect(dburl);

mongoose.connection.on('connected', function(){
    console.log('Mongoose Connected to the database: ' + dburl);
});

mongoose.connection.on('disconnected', function(){
    console.log('Mongoose disconnected');
});

mongoose.connection.on('error', function(err){
    console.log('Mongoose connection error: ' + err);
});

// process loads when app is terminated using ctrl + C
process.on('SIGTERM', function(){
	mongoose.connection.close(function(){
		console.log('Mongoose disconnected through app termination (SIGTERM)');
		process.exit(0);
	});
});

process.on('SIGTERM', function(){
	mongoose.connection.close(function(){
		console.log('Mongoose disconnected through app termination (SIGTERM)');
		process.exit(0);
	});
});

process.once('SIGUSR2', function(){
	mongoose.connection.close(function(){
		console.log('Mongoose disconnected through app termination (SIGUSR2)');
		process.kill(process.pid,'SIGUSR2');
	});
});


// GEtting SCHEMAS AND MODELS

require('./hotels.model.js');


