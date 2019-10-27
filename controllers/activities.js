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
			activities: allActivities
		}) 

	} catch {
		res.send(err);
	}

});


//New route
router.get('/new', (req, res) => {
	// user must be logged in to to get to this page
	// render new view
	res.render('/activities/new.ejs');
});


//Post route async-await
router.post('/', async(req, res) => {
  try {
    // create activity
    const newActivity = await Activity.create(req.body);
    // find user by id (req.body.userId)
    const foundUser = await User.findById(req.body.userId);
    // push newly created activity into foundUser.activities array
    foundUser.activities.push(newActivity);
    // save foundUser
    foundUser.save();
    // console.log('foundUser: ', foundUser);
    // res.redirect to index route
    res.redirect('/activities');

  } catch {
    res.send(err);
  }

});


//Edit route async-await
//Does this route need to be tied to a specific user?
router.get('/:id/edit', async(req, res) => {
  try {
    const foundActivity = await Activity.findById(req.params.id);
      res.render('activities/edit.ejs', {
        activity: foundActivity
      }) 

  } catch {
    res.send(err);
  }

});


//Put route async-await
//Does this need to be tied to a specific user?
router.put('/:id', async(req,res) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.redirect('/activities/' + req.params.id);
  
  } catch {
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
	    res.render('/activities/show.ejs', {//Or User My page-->show page??
	      user: foundUser,
	      activity: foundUser.activities[0]
	    });
	
	} catch {
		res.send(err);
	}

});


//Delete route await-async
//Does this need to be tied to a specific user?
router.delete('/:id', async(req, res) => {
  // find the activity and delete it
  try {
    const deletedActivity = await Activity.findByIdAndRemove(req.params.id);
        // redirect to activities index    
        res.redirect('/activities');
  
  } catch {
    res.send(err);
  }

});








module.exports = router;