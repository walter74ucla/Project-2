const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
require('./db/db');

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

//Home route
app.get('/',(req,res)=>{
    res.render('home.ejs', {
        message: req.session.message
    });
})
    


app.listen(3000,()=>{
    console.log("app is listening on port 3000");
})