
// this is done in mongo shell for adding reviews in the hotel id. VL29
// this is reuqired to be done so that the controller reviewGetOne works efficiently as we need
// individual id's to be fetched.

db.hotels.update(
	{},
	{
		$set :{
			"reviews.0._id":ObjectId()
		}
	},
	{
		multi:true
	}
)


//hotel with 2 reviews


db.hotels.update(
	{
		"name": "Grand Hotel Palatino"
	},
	{
		$set :{
			"reviews.1._id":ObjectId()
		}
	}
)