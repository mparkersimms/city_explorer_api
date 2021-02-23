






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
    console.log(req);
    function Location(data, search) {
        this.search_query = search;
        this.formatted_query = data[0].display_name;
        this.latitude = data[0].lat;
        this.longitude = data[0].lon;
        console.log(data[0].display_name)
    }
    res.send(output);
}
// res.send({
//     "search_query": "seattle",
//     "formatted_query": "Seattle, WA, USA",
//     "latitude": "47.606210",
//     "longitude": "-122.332071"
//   });

// ================== Initialization====================

app.listen(PORT, () => console.log('app is up on http://localhost:' + PORT));

