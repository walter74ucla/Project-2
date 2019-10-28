const express = require('express');
const router = express.Router();
const Habit = require('../models/habit.js');
const Activity = require('../models/activity.js');
const User = require('../models/user.js');


//Index route async-await
router.get('/', async(req, res) => {
  console.log("habits index routes");
	try {
		//find all the habits
		const allHabits = await Habit.find({});
		// render index.ejs and inject data
		res.render('habits/index.ejs', {
      habits: allHabits,
      loggedIn: res.session.logged,
      username: res.session.username,
      userID: res.session.userID,
		}) 

	} catch(err) {
		res.send(err);
  }
});


//new route
router.post('/new', (req, res) => {
	// user must be logged in to to get to this page
  // render new view
  console.log("hitting new habit");
	//res.render('/habits/new.ejs');
});


//Post route async-await
router.post('/:id', async(req, res) => {
  console.log("hitting create habit");
  try {
    // create habit
    const newHabit = await Habit.create(req.body);
    // find user by id (req.body.userId)
    const foundUser = await User.findById(req.params.id);
    // push newly created habit into foundUser.habits array
    foundUser.habits.push(newHabit._id);
    // save foundUser
    foundUser.save();
    console.log('foundUser: ', foundUser);
    // res.redirect to index route
    res.redirect('/habits');

  } catch(err) {
    res.send(err);
  }
});

//Edit route async-await
//Does this route need to be tied to a specific user?
router.get('/:id/edit', async(req, res) => {
  try {
    const foundHabit = await Habit.findById(req.params.id);
      res.render('habits/edit.ejs', {
        habit: foundHabit
      }) 

  } catch(err) {
    res.send(err);
  }

});


//Put route async-await
//Does this need to be tied to a specific user?
router.put('/:id', async(req,res) => {
  try {
    const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.redirect('/habits/' + req.params.id);
  
  } catch(err) {
    res.send(err);
  }

});


//Show route async-await
router.get('/:id', async(req,res) => {
// find user by the id in their habits array
	try {
		const foundUser = await User.findOne({'habits': req.params.id})
	                                .populate(
	                                  {
	                                    path: 'habits',
	                                    match: {
	                                      _id: req.params.id
	                                    }
	                                  }
	                                )
	                                .exec();
	    // render habits view and inject data
	    res.render('/habits/show.ejs', {//Or User My page-->show page??
	      user: foundUser,
	      habit: foundUser.habits[0]
	    });
	
	} catch(err) {
		res.send(err);
	}
});

//Delete route await-async
//Does this need to be tied to a specific user?
router.delete('/:id/:index', async(req, res) => {
  // find the habit and delete it
  console.log("hitting delete route");
  try {
    const deletedHabit = await Habit.findByIdAndRemove(req.params.id);
        // redirect to habits index    
        res.redirect('/habits');
  } catch(err) {
    res.send(err);
  }

});



module.exports = router;