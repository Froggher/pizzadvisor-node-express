var express = require('express')
var cors = require('cors')
var app = express()


app.use(express.json())//specifichiamo che i messaggi verranno spediti in JSON


//https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue

// Aggiungi gli header prima delle configurazione delle route
app.use(function (req, res, next) {

    // Siti che hanno il consnenso di connettersi
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');

    // Metodi che possono essere effettuati (per il preflight di cors)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Header che possono essere utilizzati
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token');

    //Per utilizzo di cookie
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Prossimo middleware
    next();
});

//app.options('*', cors(corsOptionsDelegate))
//app.options("/", cors(corsOptionsDelegate));

app.get('/', function (req, res, next) {
    console.log("corsOptionsDelegate")
    res.json({ msg: 'This is CORS-enabled for an allowed domain.',
            token: req.headers.token })
})


app.listen(5445, function () {
    console.log('CORS-enabled web server listening on port 5445')
})


console.log("hello world")