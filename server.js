'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { request, response } = require('express');
//const weather = require('./data/weather.json');
const app = express();
app.use(cors());
const weather = require('./modules/weather.js');

//set the port variable
const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
    response.send('hello from home route')
});
app.get('./weather', weatherHandler);
async function weatherHandler(request, response) {
    let lat = request.query.lat;
    let lon = request.query.lon;
    console.log('lat', 'lon', lat, lon);
     await weather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch(error => {
        console.error(error);
        response.status(500).send('Sorry something went wrong');
    })
}

app.get('/weather', async (request, response) => {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.searchQuery;

    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&days=7&lat=${lat}&lon=${lon}`;

    try {
        const weatherData = await axios.get(url);
        console.log(weatherData.data.data)
        const weatherArray = weatherData.data.data.map(day => new Forecast(day));
        //const weatherData = city.data.map(day => new Forecast(day));
        response.status(200).send(weatherArray);


    } catch { error } {
        console.log(error);
        response.status(500).send('city not found');
        //response.send('city not found');
    }

})
function Forecast(day) {
    this.day = day.valid_date
    this.description = day.weather.description
}

app.use('*', (request, response) => response.status(404).send('that end point does not exist'));


app.listen(PORT, () => console.log(`listening on port ${PORT}`));