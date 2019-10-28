const express = require('express');
const app = express();

require('./db/fakeDB');

//middleware
app.use(express.static('public'));

//Home route
app.get('/',(req,res)=>{
    res.render('users/show.ejs',{
        loggedIn: true,
        username: "AFinnerty",
        userID: "id1",
    });
})

app.listen(3000,()=>{
    console.log("app is listening on port 3000");
})