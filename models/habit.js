const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
	name: String,//ex. swimming
	type: String,//ex. exercise
	icon: String
});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;