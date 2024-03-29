const express = require('express');
const router = express.Router();
const Habit = require('../models/habit.js');
const Activity = require('../models/activity.js');
const User = require('../models/user.js');

//Index route async-await
router.get('/', async(req, res) => {
	try {
		//find all the activities
		const allActivities = await Activity.find({});
		// render index.ejs and inject data
		res.render('activities/index.ejs', {
      activities: allActivities,
      admin: req.session.admin
		}) 

	} catch(err) {
		res.send(err);
	}

});

//New route
router.get('/new', (req, res) => {
	// user must be logged in to to get to this page
	// render new view
	res.render('/activities/new.ejs');
});

//create route async-await
router.post('/:id', async(req, res) => {
  console.log("hitting create activity route");
  console.log(req.body);
  try {
    // create activity object with formatted date
    const loadObj = {
      date: req.body.month + "-" + req.body.day + "-" + req.body.year,
      time: req.body.time,
      habitId: req.body.habitId,
      likes: 0
    }
    const newActivity = await Activity.create(loadObj);
    // find user by id (req.body.userId)
    const foundUser = await User.findById(req.params.id);
    // push newly created activity into foundUser.activities array
    foundUser.activities.push(newActivity);
    //search for habit id in user habits array; if not found, add to array
    if(!foundUser.habits.includes(req.body.habitId)){
      console.log("habit not in array!");
      
    }
    // save foundUser
    foundUser.save();
    // res.redirect to users page
    res.redirect('/users/'+req.params.id);

  } catch(err) {
    res.send(err);
  }
});


//Edit route async-await
router.get('/:userid/:activityid/:activityIndex/edit', async(req, res) => {
  console.log("hitting activities edit");
  try {
    const foundActivity = await Activity.findById(req.params.activityid);
    const foundHabit = await Habit.findById(foundActivity.habitId);
    foundActivity.habit.push(foundHabit);
    const allHabits = await Habit.find({});
    console.log(foundActivity);
      res.render('activities/edit.ejs', {
        activity: foundActivity,
        loggedIn: req.session.logged,
        username: req.session.username,
        userID: req.params.userid,
        index: req.params.activityindex,
        habits: allHabits
      }) 
  } catch(err) {
    res.send(err);
  }
});


//Put route async-await
router.put('/:id/', async(req,res) => {
  console.log("hitting activities update route");
  console.log(req.body);
  try {
    const loadObj = {
      date: req.body.month + "-" + req.body.day + "-" + req.body.year,
      time: req.body.time,
      habitId: req.body.habitId,
    }
    const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, loadObj, {new: true});
    console.log(updatedActivity);
    res.redirect('/');
  
  } catch(err) {
    res.send(err);
  }
});

//Show route async-await
router.get('/:id', async(req,res) => {
// find user by the id in their activities array
	try {
		const foundUser = await User.findOne({'activities': req.params.id})
	                                .populate(
	                                  {
	                                    path: 'activities',
	                                    match: {
	                                      _id: req.params.id
	                                    }
	                                  }
	                                )
	                                .exec();
	    // render activities view and inject data
	    res.render('/activities/show.ejs', {
	      user: foundUser,
	    });
	
	} catch (err) {
		res.send(err);
	}
});


//Delete route await-async
router.delete('/:userid/:id/:index', async(req, res) => {
  console.log("delete activity route");
  // find the activity and delete it
  try {
    
    const deletedActivity = await Activity.findByIdAndRemove(req.params.id);
    console.log(deletedActivity);
    console.log(req.params.userid);
    const foundUser = await User.findById(req.params.userid);
    foundUser.activities.splice(req.params.index,1);
    foundUser.save();
        // redirect to activities index    
    res.redirect('/users/'+req.params.userid);
  } catch(err) {
    res.send(err);
  }
});



module.exports = router;