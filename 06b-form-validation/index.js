const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');

const app = express();
app.set('view engine', 'hbs');

waxOn.on(hbs.handlebars);
waxOn.setLayoutPath('./views/layouts');

//enable forms
app.use(express.urlencoded({
    extended:false
}))

app.get('/', function(req,res){
    res.send("it's alive")
});

app.get('/login', function(req,res){
    res.render('login')
})

app.post('/login', function(req,res){
    //validation rules:
    //1. email must not be empty and containes at least one @
    //2. password must not be empty and contains at least three characters
    let email = req.body.email;
    let password = req.body.password;

    let hasError = false;

    // if the email is null, undefined or empty string. then we report the error
    if (!email) {
        hasError = true;
    }
    // make sure email is not undefined or empty string
    // make use of logical short circuit
    if (email && !email.includes('@')) {
        hasError = true;
    }

    // make sure the password is not undefined or empty string first,
    // then make sure it has at least three characters.
    if (password && password.length < 3) {
        hasError = true;
    }
    
    if (hasError) {
        res.sendStatus(418);
    } else {
        res.send('success');
    }
})

app.get('/lostnfound', function(req,res){
    res.render('lostnfound');
})

app.post('/lostnfound', function(req,res){
    let item = req.body.item;
    let email = req.body.email;
    let location = req.body.location;
    let properties = []
    if (req.body.properties) {
       if (Array.isArray(req.body.properties)){
        properties = req.body.properties;
       } else {
        properties = [ req.body.properties ];
       }
}

    let hasError = false;

    if(!item) {
        hasError = true;
    }

    if (item && item.length > 200 || item.length < 3){
        hasError = true;
    }

    if (!email) {
        hasError = true;
    }
    if (email && !email.includes('@') && !email.includes('.')){
        hasError = true;
    }

    if (!location) {
        hasError = true;
    }

    if (properties && (properties.length < 1 || properties.length > 3)){
        hasError = true;
    }
    
    if (hasError) {
        res.sendStatus(418);
    } else {
        res.send('success');
    }
})

app.listen(3000, function(){
    console.log("Server has started");
});
