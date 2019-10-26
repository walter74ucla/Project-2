const express = require('express');
const router = express.Router();
const Habit = require('../models/habit.js');
const Activity = require('../models/activity.js');
const User = require('../models/user.js');

//Index route
router.get('/', async(req, res) => {
	try {
		//find all the habits
		const allHabits = await Habit.find({});
		// render index.ejs and inject data
		res.render('habits/index.ejs', {
			habits: allHabits
		}) 

	} catch {
		res.send(err);
	}

});



//New route
router.get('/new', (req, res) => {
	res.render('/habits/new.ejs');
})


//Show route
router.get('/:id', async(req,res) => {
// find habit by userId

})


module.exports = router;