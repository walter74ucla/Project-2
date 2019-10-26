const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
	time: Number,//in minutes
	date: Date, //maybe String
	habitID: {
    type: mongoose.Schema.Types.ObjectId,
  	},
  	likes: Number //this is a stretch goal
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;