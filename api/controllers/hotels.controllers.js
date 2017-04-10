// var dbconn = require('../data/dbconnection.js');
// var ObjectId =  require('mongodb').ObjectId;
// var hotelData = require('../data/hotels-data.json');

var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.hotelsGetAll = function(req, res){

// GETTING THE DATA FROM THE MEANHOTEL DATABASE using mongodb
// var db = dbconn.get();
// var collection =  db.collection('hotels');

var offset= 0;
var count= 5;

// checking the querystring for offset and count
 if(req.query && req.query.offset){
     offset = parseInt(req.query.offset,10);
 }

 if(req.query && req.query.count){
     count = parseInt(req.query.count,10);
}


// hotels here is the collection
Hotel
    .find()
    .skip(offset) // skip to this hotel number. start from here.
    .limit(count) // limit upto this hotel number. not more than eg: 5 hotels at once to display
    // exec functions fetches data from the database which is similar to the Hotel Schema we have created.
    .exec(function(err, hotels){
        console.log('Found hotels', hotels.length);
    res
        .json(hotels);
    });



//these are using mongodb
// collection
//     .find()
//     .skip(offset)
//     .limit(count)
//     .toArray(function(err, docs){
//         console.log("Found hotels" , docs);
//         res
//             .status(200)
//             .json(docs);
//     });

// RETRIEVING THE DATA FROM THE JSON FILE.
// console.log("db", db);
// console.log("get the json file");
// console.log(req.query);

// var offset= 0;
// var count= 5;

// if(req.query && req.query.offset){
//     offset = parseInt(req.query.offset,10);
// }

// if(req.query && req.query.count){
//     count = parseInt(req.query.count,10);
// }
// var returnData= hotelData.slice(offset, offset+count);

// res
//     .status(200)
//     .json(returnData);


};


module.exports.hotelsGetOne = function(req, res){


// var db = dbconn.get();
// var collection =  db.collection('hotels');

console.log("get hotelId", hotelId);

var hotelId = req.params.hotelId;

Hotel
    .findById(hotelId)
    .exec(function(err,doc){
        res
            .status(200)
            .json(doc);

    });


// done using Mongodb
// collection
//     .findOne({
//         _id:ObjectId(hotelId)
//     },function(err,doc){
//         res
//             .status(200)
//             .json(doc);
//     });
    


// RETRIEVING A SINGLE HOTEL DATA FROM THE DATABASE
//     var hotelId = req.params.hotelId;
//     var thisHotel = hotelData[hotelId];
//     console.log("get hotelId", hotelId);
// res
//     .status(200)
//     .json(thisHotel);


};


module.exports.hotelsAddOne = function(req,res){
var db = dbconn.get();
var collection =  db.collection('hotels');
var newHotel;
console.log("post hotel");
if(req.body && req.body.name && req.body.stars) {
newHotel = req.body;
newHotel.stars = parseInt(req.body.stars,10);
//console.log(newHotel);
collection.insertOne(newHotel, function(err,response){
console.log(response);
console.log(response.ops);// shows the object inserted in the database
res
    .status(201)
    .json(response.ops);
});

} else{
    console.log("data is missing in the body");
 res
    .status(400)
    .json({"message": "Required data is missing in the body"});

}


//     console.log("POST a new hotel in the list");
//     console.log(req.body);
// res
//     .status(200)
//     .json(req.body);

};
