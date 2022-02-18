const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');
const axios = require('axios');

const app = express();

app.set('view engine', 'hbs'); // 2nd arg is string

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// static folder
app.use(express.static('public')); // static files goes into /public

// enable forms processing
app.use(express.urlencoded({extended:false}));

const BASE_API_URL = "https://ckx-restful-api.herokuapp.com";

app.get("/", async (req, res) => {
    let response = await axios.get(BASE_API_URL + "/sightings"); 
    let sightings = response.data;
    res.render('index', {
      'sightings': sightings 
    })
  });
  

app.get('/', function(req,res){
    res.send("It's alive!")
})

app.listen(3000, function(){
    console.log("Server has started");
})

