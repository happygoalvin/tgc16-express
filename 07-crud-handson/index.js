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

const BASE_API_URL = "https://ckx-movies-api.herokuapp.com";

// ROUTES
app.get('/', async function (req,res) {
    let response = await axios.get(BASE_API_URL + '/movies');
    res.render('index', {
        'movies': response.data
    })
})

app.get('/movies/create', async (req,res)=>{
    res.render('create-movie')
})
// req contains what the browser sends
app.post('/movies/create', async (req, res)=>{
    let title = req.body.title;
    let plot = req.body.plot;
    let payload = {
        'title':title,
        'plot':plot,
    }
    await axios.post( BASE_API_URL + '/movie/create', payload);
    res.redirect('/')
})
// CRUD: ([U]PDATE)
app.get('/movies/:id/update', async (req,res)=>{
    let movieid = req.params.id;
    let response = await axios.get(BASE_API_URL + '/movie/' + movieid);

    let movie = response.data;
    res.render('update-movie', {
        'movie':movie
    })
})

app.post('/movies/:id/update', async (req,res)=>{
    let payload = {
        'title': req.body.title,
        'plot':req.body.plot,
    }
    let movieid = req.params.id;
    await axios.patch(BASE_API_URL + '/movie/' + movieid, payload);
    res.redirect('/')
})

// CRUD: ([D]elete)
app.get('/movies/:id/delete', async function (req,res){
    let response = await axios.get(BASE_API_URL + '/movie/' + req.params.id);
    let movie = response.data;
    res.render('delete-movie', {
        'movie':movie
    })
})

app.post('/movies/:id/delete', async function (req,res){
    let response = await axios.delete(BASE_API_URL + '/movie/' + req.params.id);
    res.redirect('/')
})

// BEGIN SERVER (aka LISTEN)
app.listen(3000, function(){
    console.log("server begins");
})