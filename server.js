






// ================== packages==========================


const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ================== app ==============================

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3099;
// console.log(process.env.PORT);
// ================== Routes. ==========================

app.get('/location', handleGetLocation)
function handleGetLocation(req, res) {
    const dataFromTheFile = require('./data/location.json');
    // // const output = {
    // //     search_query: '',
    // //     formatted_query: dataFromTheFile,
    // //     latitude: '',
    // //     longitude: ''
    // // }
    var search = req.query.city;
    const output = new Location(dataFromTheFile, search);
    // console.log(req);
    function Location(data, search) {
        this.search_query = search;
        this.formatted_query = data[0].display_name;
        this.latitude = data[0].lat;
        this.longitude = data[0].lon;

    }
    res.send(output);
}

app.get('/weather', handleGetWeather)
function handleGetWeather(req, res) {


    const dataFromTheWxFile = require('./data/weather.json');
    const wxOutput = [];

    dataFromTheWxFile.data.forEach(day =>{
        wxOutput.push(new Weather(day));
    })

    function Weather(wxData) {
        this.forecast = wxData.weather.description;
        this.time = wxData.valid_date;
        console.log(wxData.weather.description);
        console.log(wxData.valid_date);

    }
    res.send(wxOutput);
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
