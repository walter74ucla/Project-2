require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
//require('./db/db');

//middleware
// we set up our session before our routes,
// because our routes will want to know things
// about the session cookie
app.use(session({
  secret: "this is a random secret string", // is the key that opens up our session
  // which is always stored on the server
  resave: false, // only save our session when we add/or mutate
  // a property
  saveUninitialized: false // only save the cookie when
  // we add a property to it. When the user logs in or registers
  // we only really want to add stuff to our session after user
  // logs in or registers to comply with the law
}));
// setting the session as early as possible in train

app.use(express.static('public'));
app.use(methodOverride('_method'));//must come before our routes
app.use(bodyParser.urlencoded({extended: false}));

const usersController = require('./controllers/users.js');
app.use('/users', usersController);

const habitsController = require('./controllers/habits.js');
app.use('/habits', habitsController);

const activitiesController = require('./controllers/activities.js');
app.use('/activities', activitiesController);

const User = require('./models/user.js')
const Habit = require('./models/habit.js')

//Home route
app.get('/',async(req,res)=>{
    const randomUsers = [];
    //find random users to populate front page
    const count = await User.countDocuments();
    const max = count > 50 ? 50 : count;  
    for(let i = 0; i < max; i++){
        const r = Math.floor(Math.random() * count);
        const randomUser = await User.findOne().skip(r)
                                     .populate('activities')
        //only include users that have activities
        if(randomUser.visible && randomUser.activities.length){
            for(let i = 0; i < randomUser.activities.length; i++){
                const habitId = randomUser.activities[i]['habitId'];
                const foundHabit = await Habit.findById(habitId);
                randomUser.activities[i].habit.push(foundHabit);
            }
            randomUsers.push(randomUser);
            console.log(randomUser);
        }
    }
    res.render('home.ejs', {
        message: req.session.message,
        users: randomUsers,
        loggedIn: req.session.logged,
        username: req.session.username,
        userID: req.session.userID,
    });
})
    
app.listen(process.env.PORT, () => {
    console.log('listening on port 3000');
  })