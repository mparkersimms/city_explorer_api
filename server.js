






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
console.log(process.env.GEOCODE_API_KEY)


app.get('/location', handleGetLocation)
function handleGetLocation(req, res) {
    // const dataFromTheFile = require('./data/location.json');
    // // const output = {
    // //     search_query: '',
    // //     formatted_query: dataFromTheFile,
    // //     latitude: '',
    // //     longitude: ''
    // // }
    var search = req.query.city;
    // console.log(req);
    
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


    const dataFromTheWxFile = require('./data/weather.json');

    const wxArr = dataFromTheWxFile.data.map(wxOutput);

    function wxOutput(day){
        return new Weather(day);
    }

    function Weather(wxData) {
        this.forecast = wxData.weather.description;
        this.time = wxData.valid_date;
    }

    res.send(wxArr);
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
