import express, { json } from 'express';
import cors from 'cors';
import { mariaConnection } from './TestDatabase/TestDatabase.js';
import { SignIn } from './UserArea/Login.js';
import { SignUp } from './UserArea/SignUp.js';
import { TestToken } from './misc/Fun.js';
import { PostReview } from './Review/PostReview.js';
import { GetReview } from './Review/GetReview.js';
import { GetPlaces } from './Place/GetPlaces.js';
import { GetDetailedPlace } from './Place/GetDetailedPlace.js';
import { PostPlace } from './Place/PostPlace.js';
import { CheckPlace } from './Place/CheckPlace.js';
import { CheckFollow } from './Follow/CheckFollow.js';
import { PostFollow } from './Follow/PostFollow.js';
import { DeleteFollow } from './Follow/DeleteFollow.js';
import { GetFollows } from './Follow/GetFollows.js';
import { DeleteReview } from './Review/DeleteReview.js';

var app = express();


app.use(json());//specifichiamo che i messaggi verranno spediti in JSON


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
    res.send({
        message: 'Questo é un test',
        token: req.headers.token
    });
});



app.get('/db', mariaConnection);
app.post('/login', SignIn);
app.post('/user/signup', SignUp);

app.post('/place/post/', PostPlace);

app.get('/places', GetPlaces);
app.get('/follow/check/:place_id', CheckFollow);
app.get('/follow/get', GetFollows);
app.post('/follow/post', PostFollow);
app.delete('/follow/delete', DeleteFollow);
app.get('/place/check/:place_id', CheckPlace);
app.get('/place/detailed/:place_id', GetDetailedPlace);
app.get('/review/get/:place_id', GetReview);
app.post('/review/post/:place_id', PostReview);
app.delete('/review/delete', DeleteReview);

app.get('/user/auth', TestToken);



app.listen(5445, function () {
    console.log('CORS-enabled web server listening on port 5445')
})

