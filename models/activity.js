const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
	name: String,
	time: Number,//in minutes
	date: String, //maybe String
	habitId: mongoose.Schema.Types.ObjectId,
	habit: [],   
  	likes: Number //this is a stretch goal
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;