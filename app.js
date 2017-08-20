//connection using mongoose
require('./api/data/db.js');

// connection using mongoDB
// require('./api/data/dbconnection.js').open();

var express= require ('express');
var app =  express();
var path = require ('path');// this is important for res.sendFile
var routes =  require('./api/routes');
var bodyParser = require('body-parser');

app.set('port',3000);


// to get these static files log put it always above the static file path. 
// middlewares do run sequentially. The order of the middlware is important.
// this function would display the method and url used in the console.
app.use(function(req,res,next){
console.log(req.method,req.url);
next();
});


// app.use('/css', function(req,res,next){
// console.log(req.method,req.url);
// next();
// });


// middleware which would directly route to the file if thats available in the public folder
app.use(express.static(path.join(__dirname,'public')));
app.use('/node_modules',express.static(__dirname+ '/node_modules'));

app.use(bodyParser.urlencoded({extended: false}));

// app.get('/', function(req,res)
//     console.log('this is my home page');
//     res.sendFile(path.join(__dirname,'public','index.html'));
// });

app.use('/api', routes);


app.get('/json', function(req,res){
    console.log('this is a json');
    res.json({"firstname": "Anish"});
});

app.get('/file', function(req,res){
    console.log('this is a regular file');
    res.sendFile(path.join(__dirname, 'app.js'));
});



var server = app.listen(app.get('port'),function(){
var port =  server.address().port;
console.log('Magic happens at port '+ port);
});





