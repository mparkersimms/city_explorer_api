






// ================== packages==========================


const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');
const pg = require('pg');

// ================== app ==============================

const app = express();
app.use(cors());

const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
client.on('error', error => console.log(error));

const PORT = process.env.PORT || 3099;


// console.log(process.env.PORT);
// ================== Routes. ==========================
// console.log(process.env.GEOCODE_API_KEY)

// app.get('/', (req, res) => {

//     const sqlString = 'INSERT INTO Places_To_Go (name, latlon) VALUES($1,$2)';
//     const sqlArray = ['Manhattan', 2346];
//     client.query(sqlString,sqlArray)
//         .then((results)=> {
//             console.log(results.rows);
//             res.send(results);

//         })
// client.query('SELECT * FROM Places_To_Go')
//     .then(results => {
//         console.log(results);
//         res.send(results);
//     })
// })

app.get('/location', handleGetLocation)
function handleGetLocation(req, res) {
    var search = req.query.city;
    const sqlString = 'SELECT * FROM city WHERE search_query = $1';
    const sqlArray = [search];
    client.query(sqlString, sqlArray)
        .then(results => {
            console.log(results);
            if (results.rows.length > 0) {
                console.log('already there', results.rows[0]);
                res.send(results.rows[0]);
            }
            else {

                console.log(req.query);
                superagent.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${search}&format=json`)
                    .then(data => {
                        console.log(data.body[0])
                        const output = new Location(data.body[0], search);
                        const sqlStr = 'INSERT INTO city (search_query, formatted_query, latitude, longitude) VALUES($1,$2,$3,$4)';
                        const sqlArr = [output.search_query, output.formatted_query, output.latitude, output.longitude];
                        client.query(sqlStr, sqlArr)
                            .then(info => {
                                console.log('added to the table', info);
                            })
                        res.send(output);
                    })
                    .catch(errorThatComesBack => {
                        res.status(500).send(errorThatComesBack)
                    })
            }
            function Location(data, search) {
                this.search_query = search;
                this.formatted_query = data.display_name;
                this.latitude = data.lat;
                this.longitude = data.lon;

            }
        })
}

app.get('/weather', handleGetWeather)
function handleGetWeather(req, res) {
    console.log("in the weather", req.query);

    superagent.get(`http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${req.query.latitude}&lon=${req.query.longitude}`)
        .then(weatherData => {
            console.log("in the weather.then", weatherData.body.data[0])

            const wxArr = weatherData.body.data.map(wxOutput);
            function wxOutput(day) {
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
app.get('/parks', handleGetParks)
function handleGetParks(req, res) {
    console.log("in the park", req.query.formatted_query);
    superagent.get(`https://developer.nps.gov/api/v1/parks?limit=5&start=0&q=${req.query.formatted_query}&sort=&api_key=${process.env.PARKS_API_KEY}`)
        .then(parkData => {
            const parkInfo = parkData.body.data.map(parkOutput)
            function parkOutput(info) {
                return new Park(info);
            }

            res.send(parkInfo);
        })
        .catch(errorThatComesBack => {
            res.status(500).send(errorThatComesBack)
        });

    function Park(parkData) {
        this.name = parkData.fullName;
        this.address = parkData.addresses[0].line2 + " " + parkData.addresses[0].city + " " + parkData.addresses[0].stateCode + " " + parkData.addresses[0].postalCode;
        this.fee = parkData.entranceFees[0].cost;
        this.description = parkData.description;
        this.url = parkData.url
    }

}
// ================== Initialization====================

client.connect().then(() => {
    app.listen(PORT, () => console.log('app is up on http://localhost:' + PORT));
});

