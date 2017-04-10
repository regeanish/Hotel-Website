
// connecting to the database using mongoDB.

var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/meanhotel';

var _connection = null;

var open = function(){
    //set connection
MongoClient.connect(dburl, function(err,db){
if(err){
    console.log("Connection to the database failed");
    return;
}
_connection = db;
console.log("database connection open", db);
});
}

var get = function(){
    return _connection;
}

module.exports ={
    open:open,
    get:get
};