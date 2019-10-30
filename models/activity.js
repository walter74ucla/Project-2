const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
	name: String,
	time: Number,//in minutes
	date: Date, //maybe String
	// habitId: {
    // 	type: mongoose.Schema.Types.ObjectId, //only 1 habitID per activity
	// },
	// micah suggestion 1
	habitId: mongoose.Schema.Types.ObjectId,
	habit: [],   
  	likes: Number //this is a stretch goal
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;