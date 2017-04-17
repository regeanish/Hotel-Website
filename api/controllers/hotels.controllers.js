// var dbconn = require('../data/dbconnection.js');
// var ObjectId =  require('mongodb').ObjectId;
// var hotelData = require('../data/hotels-data.json');

var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');


var runGeoQuery = function(req, res){
    var lat = parseFloat(req.query.lat);
    var lng = parseFloat(req.query.lng);

    //create a geoPoint 
    var point = {
        type:"Point",
        coordinates:[lng,lat]
    };

    var geoOptions = {
        spherical: true, // means to check whether the dist is on flat surface or round
        maxDistance: 2000, // distance between 2 particular hotels
        num: 5 // max number of hotels

    }

    Hotel
        .geoNear(point,geoOptions,function(err,results,stats){
            console.log('Geo Results', results);
            console.log('Geo stats', stats);
            res
                .status(200)
                .json(results);

        });

}

module.exports.hotelsGetAll = function(req, res){

// GETTING THE DATA FROM THE MEANHOTEL DATABASE using mongodb
// var db = dbconn.get();
// var collection =  db.collection('hotels');

var offset= 0;
var count= 5;
var maxCount = 10;

//Finding document based on geo-cooridinates
if(req.query && req.query.lat && req.query.lng){
    runGeoQuery(req,res);
    return;
}

// checking the querystring for offset and count
 if(req.query && req.query.offset){
     offset = parseInt(req.query.offset,10);
 }

 if(req.query && req.query.count){
     count = parseInt(req.query.count,10);
}

// to check the count value doesnt exceed 10
if(count > maxCount){
    res
        .status(400)
        .json({
            "message": "max count of 10 exceeded"
        });
    return;

}

// check if the count and offset is a number or not. eg count:two is not allowed
if(isNaN(offset) || isNaN(count)){
    res
        .status(400)
        .json({
            "message": "the count and offset should be numbers and not strings"
        });
        return;
}

 
Hotel
    .find()
    .skip(offset) // skip to this hotel number. start from here.
    .limit(count) // limit upto this hotel number. not more than eg: 5 hotels at once to display
    // exec functions fetches data from the database which is similar to the Hotel Schema we have created.
    .exec(function(err, hotels){   
        if(err){                                    // handling error object
            console.log("Error finding hotels");
            res
                .status(500)
                .json(err);
        }else{
        console.log('Found hotels', hotels.length);
        res
            .json(hotels);
        }

        
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



var hotelId = req.params.hotelId;

console.log("GET hotelId", hotelId);
Hotel
    .findById(hotelId)
    .exec(function(err,doc){
        var response = {
            status:200,
            message:doc
        };

        if(err){  
            console.log("Error finding hotel");
                response.status =400;
                response.message = err;
        }else if(!doc){ // hotel not found by id
            res
                response.status = 404;
                response.message = {
                    "message": "Hotel ID not found"
                };
        }
            res
            .status(response.status)
            .json(response.message);
        
    
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


var _splitArray = function(input){
    var output;
    if(input && input.length>0){
        output = input.split(";");
    }else {
        output = [];
    }
    return output;
};




// Creating a hotel
module.exports.hotelsAddOne = function(req,res){

console.log(req.body);


    Hotel
        .create({
            name: req.body.name,
            description: req.body.description,
            stars: parseInt(req.body.stars,10),
            services: _splitArray(req.body.services),
            photos: _splitArray(req.body.photos),
            currency: req.body.currency,
            location: {
            address: req.body.address,
            coordinates: [
                parseFloat(req.body.lng),
                parseFloat(req.body.lat)
                        ]
                }

        }, function(err, hotel){
            if(err){
               console.log("Error creating hotel");
                res
                    .status(400)
                    .json(err); 
            } else {
                console.log("Successfully created hotel", hotel);
                res
                    .status(201)
                    .json(hotel);
            }

        });


// var db = dbconn.get();
// var collection =  db.collection('hotels');
// var newHotel;
// console.log("post hotel");
// if(req.body && req.body.name && req.body.stars) {
// newHotel = req.body;
// newHotel.stars = parseInt(req.body.stars,10);
// //console.log(newHotel);
// collection.insertOne(newHotel, function(err,response){
// console.log(response);
// console.log(response.ops);// shows the object inserted in the database
// res
//     .status(201)
//     .json(response.ops);
// });

// } else{
//     console.log("data is missing in the body");
//  res
//     .status(400)
//     .json({"message": "Required data is missing in the body"});

// }

//     console.log("POST a new hotel in the list");
//     console.log(req.body);
// res
//     .status(200)
//     .json(req.body);

};




module.exports.hotelsUpdateOne = function(req, res){

console.log("get hotelId", hotelId);

var hotelId = req.params.hotelId;

Hotel
    .findById(hotelId)
    .select("-reviews -rooms") // deselecting rooms and reviews.
    .exec(function(err,doc){
        var response = {
            status:200,
            message:doc
        };

        if(err){  
            console.log("Error finding hotel");
                response.status =400;
                response.message = err;
        }else if(!doc){ // hotel not found by id
            res
                response.status = 404;
                response.message = {
                    "message": "Hotel ID not found"
                };
        } 
        if(response.status !== 200){ // send respnse only if it has been changed.
           res
            .status(response.status)
            .json(response.message);  
        } else {

            doc.name=req.body.name,
            doc.description= req.body.description,
            doc.stars=parseInt(req.body.stars,10),
            doc.services= _splitArray(req.body.services),
            doc.photos= _splitArray(req.body.photos),
            doc.currency=req.body.currency,
            doc.location= {
            address :req.body.address,
            coordinates: [
                parseFloat(req.body.lng),
                parseFloat(req.body.lat)
                        ]
                };

                doc.save(function(err, hotelUpdated){
                    if(err){
                        res
                            .status(200)
                            .json(err);


                    } else {
                        res
                            .status(204)
                            .json();
                    }
                });
        }                 
    });
        
};

module.exports.hotelsDeleteOne = function(req, res) {
  var hotelId = req.params.hotelId;

  Hotel
    .findByIdAndRemove(hotelId)
    .exec(function(err, location) {
      if (err) {
        res
          .status(404)
          .json(err);
      } else {
        console.log("Hotel deleted, id:", hotelId);
        res
          .status(204)
          .json();        
      }
    });
};



