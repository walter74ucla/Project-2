const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: String,
  password: String,
  visible: Boolean,
  habits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit' // all the id's reference a Habit document
  }], // this array will be an array of habit id's
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity' // all the id's reference an Activity document
  }], // this array will be an array of activity id's
  follows: []//this is a stretch goal
});


// model is always Capitalized and singluar by convention
const User = mongoose.model('User', userSchema);


module.exports = User;
