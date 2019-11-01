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
    console.log(allHabits);
		// render index.ejs and inject data
    console.log(req.session, 'habits index');
		res.render('habits/index.ejs', {
      habits: allHabits,
      loggedIn: req.session.logged,
      username: req.session.username,
      userID: req.session.userID
		}); 
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
    console.log('newHabit', newHabit);
    // find user by id (req.body.userId)
    const foundUser = await User.findById(req.params.id);
    // push newly created habit into foundUser.habits array
    foundUser.habits.push(newHabit._id);
    // save foundUser
    foundUser.save();
    console.log('foundUser: ', foundUser);
    // res.redirect to index route
    res.redirect('/habits'
    //   , {
    //   user: foundUser,
    //   loggedIn: req.session.logged,
    //   username: req.session.username,
    //   userID: req.params.id,
    //   habits: foundHabits
    // }
    );


  } catch(err) {
    res.send(err);
  }
});

//Edit route async-await
//Does this route need to be tied to a specific user?
router.get('/:userid/:habitid/:habitindex/edit', async(req, res) => {
  console.log('hitting edit habit route');
  console.log(req.session.userID);
  try {
    const foundHabit = await Habit.findById(req.params.habitid);
      res.render('habits/edit.ejs', {
        habit: foundHabit,
        loggedIn: req.session.logged,
        username: req.session.username,
        userID: req.params.userid,
        index: req.params.habitindex
      }) 

  } catch(err) {
    res.send(err);
  }

});


//Put route async-await
//Does this need to be tied to a specific user?
router.put('/:userid/:habitid/:habitindex', async(req,res) => {
  console.log("hitting update route");
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

//Delete habit from user route await-async
//Does this need to be tied to a specific user?
router.delete('/:id/:index', async(req, res) => {
  // find the habit and delete it
  console.log("hitting habit delete from user route");
  try {
    //must delete habit from user array
    const foundUser = await User.findById(req.params.id);
    console.log(foundUser);
    const foundHabit = foundUser.habits[req.params.index];
    console.log(foundHabit);
    const deletedHabit = await Habit.findByIdAndRemove(foundHabit._id);
        // redirect to users index
    res.redirect('/users/'+req.param.id);
  } catch(err) {
    res.send(err);
  }
});

//Delete habit from DB
router.delete('/:userId/:habitId/:habitIndex', async(req, res) => {
  // find the habit and delete it
  console.log("hitting habit delete route");
  try {
    //must delete habit from user array
    const deletedHabit = await Habit.findByIdAndRemove(req.params.habitId);
    const foundUser = await User.findById(req.params.userId);
    foundUser.habits.splice(req.params.habitIndex,1);

    console.log(deletedHabit);
        // redirect to users index   
    res.redirect('/users/'+req.params.userId);
  } catch(err) {
    res.send(err);
  }
});



module.exports = router;