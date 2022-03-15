'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const weather = require('./data/weather.json');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.send('testing testing...is this thing on??')
});

app.get('/weather', async (request, response) => {
  let lat = request.query.lat;
  let lon = request.query.lon;
  let searchQuery = request.query.searchQuery; // city we searched for

  console.log("lat, lon", lat, lon)

    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&days=7&lat=${lat}&lon=${lon}`;
  console.log(url);
  
  try {
    const weatherData = await axios.get(url);
    console.log(weatherData.data.data)
    const weatherArray = weatherData.data.data.map(day => new Forecast(day));

    response.status(200).send(weatherArray);

  } catch(error) {
    console.log(error);
    response.status(500).send('city not found')
  }

})


function Forecast(day) {
  this.day = day.valid_date
  this.description = day.weather.description
}


// Create a function to handle errors from any API call.
app.use('*', (request, response) => response.status(404).send('that endpoint does not exists'));

// tells the express app which port to listen on
app.listen(PORT, () => console.log(`listening on port ${PORT}`));