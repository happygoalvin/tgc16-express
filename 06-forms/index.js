// SETUP //////////////////
const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');

// create the express application
const app = express();
app.set('view engine', 'hbs'); // the second argument hbs as string, not the object

waxOn.on(hbs.handlebars);  // the first argument is the hbs object, not string
waxOn.setLayoutPath('./views/layouts'); 

app.use(express.static('public')); // set the static folder to public

// ENABLE FORMS
app.use(express.urlencoded({extended:false}));


// ROUTES /////////////////

// The route below is HTTP GET /add-food
app.get('/add-food', function(req,res){
    res.render('add-food')
})

app.get('/calculate_bmi', function(req,res){
    res.render('calculate_bmi')
})

app.post('/calculate_bmi', function(req,res){
    let weight = parseFloat(req.body.weight);
    let height = parseFloat(req.body.height);
    calculateBmi = weight / height ** 2
    res.render('results',{
    'calculateBmi': calculateBmi
    })
});

// intercept the data of the form
// that is render at GET /add-food
app.post('/add-food', function(req,res){
    console.log(req.body);
    res.send("Form recieved");
})

app.get('/fruits', function(req, res){
    res.render('fruits')
})

app.post('/fruits', function(req,res){
    let fruits = [];
    if(req.body.items) {
        if (Array.isArray(req.body.items)) {
            fruits = req.body.items;
        } else {
            fruits = [ req.body.items ]
        }
    }
    // METHOD 1
    // if (fruits.includes('apple')) {
    //     cost += 3;
    // }
    // if (fruits.includes('durian')) {
    //     cost += 15;
    // }
    // if (fruits.includes('orange')) {
    //     cost += 6
    // }
    // if (fruits.includes('banana')) {
    //     cost += 4;
    // }

    let cost = 0;
    let priceChart = {
        'durian':15,
        'apple':3,
        'orange':6,
        'banana':4,
    };
    // METHOD 2
    // for (let f of fruits) {
    //     cost += priceChart[f]
    // }

    // METHOD 3
    cost = fruits.reduce(function(previous,current){
        return previous+ priceChart[current]
    }, 0);
    res.send("Total cost is" + cost);
})


// LISTEN
app.listen(3000, function(){
    console.log("Server has started")
})
