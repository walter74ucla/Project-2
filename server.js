const express = require('express');
const app = express();

require('./db/db');

//middleware
app.use(express.static('public'));

//Home route
app.get('/',(req,res)=>{
    res.render('home.ejs');
})



app.listen(3000,()=>{
    console.log("app is listening on port 3000");
})