//database
var database = require('./db/mongo.js');

var xpath   = require('xpath');
var Dom     = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;

//get list of portfolios: from database
function ListPortfolios(published) {
    var dbparams = {};
    dbparams = { publish: published };

    var dbfields = { _id: 1, userid: 1, datepub: 1, portfolioid: 1, description: 1, coverage: 1, org: 1, publish: 1 };
    var sortfields = {"datepub": -1};

    return new Promise(function(resolve, reject){
        database.QueryData(dbparams, dbfields, sortfields).then(function(Result){
            resolve(Result);
        });
    });
};

function GetPortfolio(portfolioref, published) {
    var dbparams = {};
    dbparams = { portfolioid: portfolioref, publish: published };

    var dbfields = { _id: 1, userid: 1, datepub: 1, portfolioid: 1, description: 1, coverage: 1, org: 1, publish: 1 };
    var sortfields = {"datepub": -1};

    return new Promise(function(resolve, reject){
        database.QueryData(dbparams, dbfields, sortfields).then(function(Result){
            resolve(Result);
        });
    });
};

function DeletePortfolio(portfolioref) {
    var dbparams = {
        portfolioid: portfolioref
    }

    return new Promise(function(resolve, reject){
        database.DeleteData(dbparams).then(function(Result){
            resolve(Result);
        });
    });
};

function CreatePortfolio(data, userid) {
    //if exists acts as an update (delete first, add next)
    var dbparams = {userid: userid,
        portfolioid: data.portfolioid
    }
    var Portfolio = {
        userid: userid,
        datepub: (new Date()).toJSON(),
        portfolioid: data.portfolioid,
        description: data.description,
        coverage: data.coverage,
        org: data.org,
        publish: data.publish,
        data: data.data
    };
    return new Promise(function(resolve, reject){
        database.InsertData(dbparams, Portfolio).then(function(Result){
            resolve(Result);
        });
    });
};

module.exports.ListPortfolios = ListPortfolios;
module.exports.GetPortfolio = GetPortfolio;
module.exports.CreatePortfolio = CreatePortfolio;
module.exports.DeletePortfolio = DeletePortfolio;