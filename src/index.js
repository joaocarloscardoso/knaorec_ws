// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// defining configuration settings
const config = require('../env/config.js');

const portfolio = require('./portfolio.js');

// defining the Express app
const app = express();

// defining an array to work as the database (temporary solution)
const ads = [
    {title: 'Hello, world (again)!'}
];

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

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

// endpoint to delete a portfolio
app.delete('/DeleteData/:id', (req, res) => {
    portfolio.DeletePortfolio(req.params.id).then(function(Result){
        res.send(Result);
    });
});

// endpoint to update a portfolio
app.post('/AddData', async (req, res) => {
    const NewPortfolio = req.body;
    console.log(NewPortfolio);
    portfolio.CreatePortfolio(NewPortfolio, config.userid).then(function(Result){
        res.send(Result);
    });
});

// starting the server
app.listen(config.port, () => {
    console.log('listening on port ' + config.port);
});