const request = require('request');
const bodyParser = require('body-parser');
const express = require('express');
const app = express()
const apiKey = "<api-key-here>";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index', { weather: null, error: null });
});

app.post('/', function (req, res) {
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

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
