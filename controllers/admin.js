const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.post('/login/admin', async (req, res) => {
    console.log("log-in route");
    // find if the user exists
    try {
      console.log(req.body);                         
      const foundUser = await User.findOne({username: req.body.username});
      // if User.findOne returns null/ or undefined it won't throw an error
      if(foundUser){
        console.log("user found");
          // compare their passwords
          if(bcrypt.compareSync(req.body.password, foundUser.password) && bcrypt.compareSync(req.body.admin_password, foundUser.admin_password)){
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