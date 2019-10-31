const express = require('express');
const router = express.Router();
const User   = require('../models/user');
const Habit = require('../models/habit');
const Activity = require('../models/activity');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  console.log("log-in route");
  // find if the user exists
  try {
    console.log(req.body);                         
    const foundUser = await User.findOne({username: req.body.username});
                                

    // if User.findOne returns null/ or undefined it won't throw an error
    if(foundUser){
      console.log("user found");
        // compare their passwords
        if(bcrypt.compareSync(req.body.password, foundUser.password)){
          console.log("password matches");
          // if true let's log them in
          // start our session
          req.session.message = '';
          // if there are failed attempts get rid of the message
          // from the session
          req.session.username = foundUser.username;
          req.session.logged   = true;

          res.redirect('/users/'+foundUser._id);//User My page-->show page

        } else {
          console.log("wrong password");
            // if the passwords don't match
           req.session.message = 'Username or password is incorrect';
           res.redirect('/');// home page??
        }

    } else {
      console.log("user not found");
      req.session.message = 'Username or password is incorrect';
      res.redirect('/');//User My page-->show page
      // / is where the form is

    }

  } catch(err){
    res.send(err);
  }

});

//new user
router.get('/new', (req,res) => {
  console.log("hitting new user route");
  //create new user
  res.render('./users/new.ejs', {
     loggedIn: false
  });
})

//register user
router.post('/registration', async (req, res) => {
  console.log("hitting registration");
  try {
    // first thing to do is hash the password
    const password = req.body.password; // the password from the form
    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    // check to see if the username already exists
    const foundUser = await User.findOne({username: req.body.username});
    console.log('foundUser', foundUser);
    // if username already exists, message: please create a different username
    if(foundUser){
      req.session.message = 'Username already exists.  Please try again.';
      res.redirect('/users/registration');// home page??
    } else {
      // if username does not exist, proceed
      const userDbEntry = {};
      // right side of these are the info from the form
      ///and our hashed password not the password from the form
      userDbEntry.username = req.body.username;
      userDbEntry.password = passwordHash;
      userDbEntry.email = req.body.email;
      userDbEntry.visible = req.body.visible === "on" ? true : false;

      // added the user to the db
      const createdUser = await User.create(userDbEntry);
      console.log('createdUser', createdUser);
      req.session.username = createdUser.username;
      req.session.userID = createdUser._id;
      req.session.logged = true;
      req.session.message = '';

      res.redirect('/users/'+createdUser._id);//User My page-->show page
    }
  } catch(err) {
    res.send(err);
  }
});

//logout
router.get('/logout', (req, res) => {
  // creates a brand new cookie, without any of our properties
  // that we previously added to it
  console.log("hitting logout route");
  req.session.destroy((err) => {
    if(err){
      res.send(err);
    } else {
      res.redirect('/');
    }
  })
});


//Edit user route async-await
router.get('/:id/edit', async(req, res) => {
  console.log("hitting edit route");
  try {
    const foundUser = await User.findById(req.params.id);
      res.render('users/edit.ejs', {
        user: foundUser,
        loggedIn: req.session.logged,
        username: req.session.username,
        userID: req.session.userID
      })  
  } catch(err) {
    res.send(err);
  }
});


//Update route async-await
router.put('/:id', async(req,res) => {
  console.log("hitting update route");
  try {
    if(req.body.password !== ""){
      const password = req.body.password; // the password from the form
      const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      req.body.password = passwordHash;
    }
    req.body.visible = req.params.visible === "on" ? true : false;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.redirect('/users/' + req.params.id)
  } catch(err) {
    res.send(err);
  }
});


//Show route async-await
router.get('/:id', async(req, res) => {
  console.log("hitting show route");
  try {
    const foundUser = await User.findById(req.params.id)
                                // .populate({
                                //   path: 'activities',
                                //   // populate: { path: 'habits', 
                                //   //             //match: { _id: activityIds},
                                //   //           } 
                                // })
                                // .populate({
                                //   path: 'habits',
                                // })
                                .populate('activities')
                                // .populate('activities.habitId')
                                .exec();
    //temp until we get populate working
    //load habit information into activities
    for(let i = 0; i < foundUser.activities.length; i++){
        console.log(foundUser.activities[i]);
        const habitId = foundUser.activities[i]['habitId'];
        const foundHabit = await Habit.findById(habitId);
        foundUser.activities[i].habit.push(foundHabit);
    }
    //load all habits for dropdown menus
    const foundHabits = await Habit.find({});
    res.render('users/show.ejs', {
        user: foundUser,
        loggedIn: req.session.logged,
        username: req.session.username,
        userID: req.params.id,
        habits: foundHabits
      });

  } catch(err) {
    res.send(err);
  }
});

//index route async-await
router.get('/', async(req, res) => {
  console.log("user index route");
  try {
    const allUsers = await User.find({});
    res.render('users/index.ejs', {
      users: allUsers,
      loggedIn: req.session.logged,
      username: req.session.username,
      userID: req.session.userID
    });
  } catch(err) {
    res.send(err);
  }
});

//Delete route await-async
router.delete('/:id', async(req, res) => {
  console.log("delete user");
  try {
    //find user and delete
    //delete habits and activities associated with user
    const habitIds = [];
    const activityIds = [];
    const deletedUser = await User.findByIdAndRemove(req.params.id);
    for(let i = 0; i < deletedUser.habits.length; i++){
          habitIds.push(deletedUser.habits[i]._id);
      }
      Habit.deleteMany(
            {
              _id: {
                $in: habitIds
              }
            },
            (err, data) => {
              for(let j=0; j < deletedUser.activities.length; j++){
                activities.push(deletedUser.activities[i]._id);
              }
              Activity.deleteMany(
                      {
                        _id: {
                        $in: activityIds
                      }
                    },
                    (err, data) => {
                      res.redirect('/');          
                    }    
              )
            }     
        );
  } catch(err) {
    res.send(err);
  }

});

module.exports = router;
