var express = require('express')
var cors = require('cors')
var app = express()


app.use(express.json())//specifichiamo che i messaggi verranno spediti in JSON


var allowlist = ['http://example1.com', 'http://example2.com', 'localhost']

var corsOptionsDelegate = function (req, callback) {

    var corsOptions;//i valori salvati della cors

    //console.log(req.header('Origin'))
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {
            origin: true,
            methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
            headers: ['Content-Type', 'token'],
        } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
        callback('Not allowed by cors')
    }
    //console.log(corsOptions)
    callback(null, corsOptions) // callback expects two parameters: error and options
}


//app.options('*', cors(corsOptionsDelegate))
//app.options("/", cors(corsOptionsDelegate));

app.get('/', cors(corsOptionsDelegate), function (req, res, next) {
    console.log(corsOptionsDelegate)
    res.json({ msg: 'This is CORS-enabled for an allowed domain.' })
})


app.listen(5445, function () {
    console.log('CORS-enabled web server listening on port 5445')
})


console.log("hello world")