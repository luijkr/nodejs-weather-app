const express = require('express');
const serverless = require("serverless-http");
const request = require('request');
const bodyParser = require('body-parser');

const app = express()
const router = express.Router();
const apiKey = process.env.WEATHER_KEY;

module.exports.handler = serverless(app);

router.get('/', (req, res) => {
    // res.render('index', { weather: null, error: null });
    res.render('index');
});

router.post('/', function (req, res) {
    const city = req.body.city;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    
    request(url, (err, response, body) => {
        if (err) {
            res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
            const weather = JSON.parse(body)
            if (weather.main == undefined) {
                res.render('index', {weather: null, error: 'Error, please try again'});
            } else {
                const weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                res.render('index', {weather: weatherText, error: null});
            }
        }
    });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
// app.set('view engine', 'ejs')
app.use("/.netlify/functions/api", router);
