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
            database.DeleteSearchData(dbparams).then(function(Resultdel){
            });
            resolve(Result);
        });
    });
};

function CreatePortfolio(data, userid) {
    //if exists acts as an update (delete first, add next)
    //else acts as an insert
    var dbparams = {userid: userid,
        portfolioid: data.portfolioid
    };
    var doc1 = new Dom().parseFromString(data.data);
    var DescrData = new XMLSerializer().serializeToString(xpath.select("/portfolio/name",doc1)[0]);
    var Portfolio = {
        userid: userid,
        datepub: (new Date()).toJSON(),
        portfolioid: data.portfolioid,
        description: '<?xml version="1.0" encoding="UTF-8"?>' + DescrData, //data.description,
        coverage: data.coverage,
        org: data.org,
        publish: data.publish,
        data: data.data
    };
    return new Promise(function(resolve, reject){
        database.InsertData(dbparams, Portfolio).then(function(Result){
            //delete on recsearch
            database.DeleteSearchData(dbparams).then(function(Resultdel){
                var doc = new Dom().parseFromString(data.data);
                var vAudits = xpath.select("/portfolio/audits/Audit/About/@id",doc);
                for (var i=0; i<vAudits.length; i++) {
                    var vRecommendations = xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/../Recommendations/Recommendation/@nr",doc);
                    for (var j=0; j<vRecommendations.length; j++) {
                        //insert on recsearch
                        //var datadb = new XMLSerializer().serializeToString(xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[j].nodeValue + "']",doc));
                        var aboutData = new XMLSerializer().serializeToString(xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/.",doc)[0]);
                        var backgroundData = new XMLSerializer().serializeToString(xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/../Background",doc)[0]);
                        var scopeData = new XMLSerializer().serializeToString(xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/../Scope",doc)[0]);
                        var datadb = new XMLSerializer().serializeToString(xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[j].nodeValue + "']/.",doc)[0]);
                        var Recommendation = {
                            userid: userid,
                            portfolioid: data.portfolioid,
                            auditid: vAudits[i].nodeValue,
                            about: '<?xml version="1.0" encoding="UTF-8"?>' + aboutData,
                            background: '<?xml version="1.0" encoding="UTF-8"?>' + backgroundData,
                            scope: '<?xml version="1.0" encoding="UTF-8"?>' + scopeData,
                            recid: vRecommendations[j].nodeValue,
                            data: '<?xml version="1.0" encoding="UTF-8"?>' + datadb
                        };
                        //resolve(Resultdel);
                        database.InsertSearchData(Recommendation).then(function(ResultInsert){
                            //resolve(ResultInsert);
                        });
                    };
                };
            });
            resolve(Result);
        });
    });
};

module.exports.ListPortfolios = ListPortfolios;
module.exports.GetPortfolio = GetPortfolio;
module.exports.CreatePortfolio = CreatePortfolio;
module.exports.DeletePortfolio = DeletePortfolio;