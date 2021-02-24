






// ================== packages==========================


const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');

// ================== app ==============================

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3099;
// console.log(process.env.PORT);
// ================== Routes. ==========================
// console.log(process.env.GEOCODE_API_KEY)


app.get('/location', handleGetLocation)
function handleGetLocation(req, res) {
    var search = req.query.city;
    console.log(req.query);
    superagent.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${search}&format=json`)
        .then(data => { console.log(data.body[0])
            const output = new Location(data.body[0], search);
            res.send(output);
        })
        .catch(errorThatComesBack => {
            res.status(500).send(errorThatComesBack)
        })

    function Location(data, search) {
        this.search_query = search;
        this.formatted_query = data.display_name;
        this.latitude = data.lat;
        this.longitude = data.lon;

    }
}

app.get('/weather', handleGetWeather)
function handleGetWeather(req, res) {
    console.log("in the weather", req.query);
    
    superagent.get(`http://api.weatherbit.io/v2.0/current?key=${process.env.WEATHER_API_KEY}&lat=${req.query.latitude}&lon=${req.query.longitude}`)
        .then(weatherData => { console.log(weatherData.body.data)

            const wxArr = weatherData.body.data.map(wxOutput);
            function wxOutput(day){
                return new Weather(day);
            }
            res.send(wxArr);
        })
        .catch(errorThatComesBack => {
            res.status(500).send(errorThatComesBack)
        })

    function Weather(wxData) {
        this.forecast = wxData.weather.description;
        this.time = wxData.datetime;
    }


}


// [{
//     "forecast": "Partly cloudy until afternoon.",
//     "time": "Mon Jan 01 2001"
// },
// {
//     "forecast": "Mostly cloudy in the morning.",
//     "time": "Tue Jan 02 2001"
// }

// ])
// ================== Initialization====================

app.listen(PORT, () => console.log('app is up on http://localhost:' + PORT));
