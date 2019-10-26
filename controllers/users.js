const express = require('express');
const router = express.Router();
const User   = require('../models/user');
const bcrypt = require('bcryptjs');



router.post('/login', async (req, res) => {

  // find if the user exits
  try {                         
    const foundUser = await User.findOne({username: req.body.username});
    // if User.findOne returns null/ or undefined it won't throw an error
    if(foundUser){

        // compare their passwords
        if(bcrypt.compareSync(req.body.password, foundUser.password)){
          // if true let's log them in
          // start our session
          req.session.message = '';
          // if there are failed attempts get rid of the message
          // from the session
          req.session.username = foundUser.username;
          // user_id???
          req.session.logged   = true;

          res.redirect('users/show.ejs');//User My page-->show page??


        } else {
            // if the passwords don't match
           req.session.message = 'Username or password is incorrect';
           res.redirect('/');// home page??
        }


    } else {

      req.session.message = 'Username or password is incorrect';
      res.redirect('/');// home page??
      // / is where the form is


    }


  } catch(err){
    res.send(err);
  }


});


router.post('/registration', async (req, res) => {
  try {
    // first thing to do is hash the password
    const password = req.body.password; // the password from the form
    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    // check to see if the username already exists
    const foundUser = await User.findOne({username: req.body.username});
    // if username already exists, message: please create a different username
    if(foundUser){
      req.session.message = 'Username already exists.  Please try again.';
      res.redirect('/');// home page??
    } else {
    // if username does not exist, proceed
    const userDbEntry = {};
    // right side of these are the info from the form
    ///and our hashed password not the password from the form
    userDbEntry.username = req.body.username;
    userDbEntry.password = passwordHash;
    userDbEntry.email    = req.body.email;

    // added the user to the db
    const createdUser = await User.create(userDbEntry);
    // console.log(createdUser);
    req.session.username = createdUser.username;
    req.session.logged = true;

    res.redirect('users/show.ejs');//User My page-->show page??
    }
  } catch {
    res.send(err);
  }
});


router.get('/logout', (req, res) => {

  // creates a brand new cookie, without any of our properties
  // that we previously added to it
  req.session.destroy((err) => {
    if(err){
      res.send(err);
    } else {
      res.redirect('/');
    }
  })

});



module.exports = router;
