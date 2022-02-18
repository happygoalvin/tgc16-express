// SETUP
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const axios = require('axios');

// create the app
const app = express();

// set the template engine to hbs
app.set('view engine', 'hbs'); // 2nd arg is string

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// static folder
app.use(express.static('public')); // static files goes into /public

// enable forms processing
app.use(express.urlencoded({extended:false}));

const BASE_API_URL = "https://ckx-restful-api.herokuapp.com";

// ROUTES
app.get('/', async function(req,res){
    // all the routes have to send back something
    let response = await axios.get(BASE_API_URL + '/sightings');
    res.render('index',{
        'sightings': response.data
    })
})

app.get('/sightings/create', async function(req,res){
    res.render('create-food')
})

app.post("/sightings/create", async function(req,res){
    // res.send(req.body); // echo back the form data
    // let description = req.body.description;
    // let food = req.body.food;
    // let datetime = req.body.datetime;
    let {description, food, datetime } = req.body;  // object destructuring

    // let payload = {
    //     'description': description, // where the key of the property matches the variable name of the value
    //     'food' : food,
    //     'datetime': datetime
    // }
    
    food = food.split(',');  // return an array of string and reassign back to food
    let payload = {description, food, datetime }; // it means the key of each property 
                                                  // is the name of the variable

    // axios.post send a POST request to the endpoint
    // first arg: endpoint URL
    // second arg: the body (or the data to send)
    await axios.post( BASE_API_URL + '/sighting', payload);

    res.redirect('/'); // send a response back to the client
                       // and tell it to automatically go to / route

})

// example: update the sightings with id 123456
// then the url will look like: /sightings/123456/update
app.get('/sightings/:sighting_id/update', async function(req,res){
    let sightingId = req.params.sighting_id;
    let response = await axios.get(BASE_API_URL + '/sighting/' + sightingId);
    
    let sighting = response.data;
    sighting.datetime = sighting.datetime.slice(0, -1); // remove the last character
                                                        // needed to display the sighting date time correctly
    
    res.render('update-food', {
        'sighting': sighting
    })                                                    
})

app.post('/sightings/:sighting_id/update', async function(req,res){
    let payload = {
        'description': req.body.description,
        'food': req.body.food.split(','),
        'datetime': req.body.datetime
    }
    let sightingId = req.params.sighting_id;
    await axios.put(BASE_API_URL + '/sighting/' + sightingId, payload);
    res.redirect('/');
})

app.get('/sightings/:sighting_id/delete', async (req,res)=>{
  let response = await axios.get(BASE_API_URL + '/sightings/' + req.params.sighting_id);
  let sighting = response.data;
  res.render('delete_sighting', {
    sighting
  })
})

app.post('/sightings/:sighting_id/delete', async (req,res)=>{
  let response = await axios.delete(BASE_API_URL + '/sighting/' + req.params.sighting_id);
  res.redirect('/');
})

// BEGIN SERVER (aka LISTEN)
app.listen(3000, function(){
    console.log("server begins");
})