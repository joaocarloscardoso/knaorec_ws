// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
//uncomment in production
//const https = require('https');
//comment in production
const https = require('http');
var fs = require("fs");

// defining configuration settings
const config = require('../env/config.js');

const portfolio = require('./portfolio.js');

//oauth libraries import
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');


// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
//app.use(bodyParser.json());

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));


// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all portfolios
app.get('/GetData', (req, res) => {
    portfolio.ListPortfolios('1').then(function(Result){
        res.send(Result);
    });
});

// defining an endpoint to return a portfolio
app.get('/GetData/:id', (req, res) => {
    portfolio.GetPortfolio(req.params.id,'1').then(function(Result){
        res.send(Result);
    });
});

//uses for oauth authentication: free plan on https://auth0.com/
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-0paifw0y.eu.auth0.com/.well-known/jwks.json'
    }),

    // Validate the audience and the issuer.
    audience: 'https://ads-api',
    issuer: 'https://dev-0paifw0y.eu.auth0.com/',
    algorithms: ['RS256']
});

app.use(checkJwt);

// endpoint to update a portfolio
app.post('/AddData', async (req, res) => {
    const NewPortfolio = req.body;
    portfolio.CreatePortfolio(NewPortfolio, config.userid).then(function(Result){
        res.send(Result);
    });
});

// endpoint to delete a portfolio
app.delete('/DeleteData/:id', (req, res) => {
    portfolio.DeletePortfolio(req.params.id).then(function(Result){
        res.send(Result);
    });
});

// starting the server
//pass app to https server
https.createServer({
    //uncomment in production
    // key: fs.readFileSync('./key.pem'),
    // cert: fs.readFileSync('./cert.pem'),
    // passphrase: 'aitam'
},app).listen(config.port);


// app.listen(config.port, () => {
//     console.log('listening on port ' + config.port);
// });