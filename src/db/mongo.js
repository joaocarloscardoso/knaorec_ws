//env used in the app
var env = require('../../env/config.js');

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var urlDB = env.mongoDB.urlDB;

function InsertData(myquery, data){
    //if exists acts as an update (delete first, add next)
    //else acts as an insert
    return new Promise(function(resolve, reject){
        MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db(env.mongoDB.dbportfolio);
            //var myquery = { answer: "no" };
            dbo.collection(env.mongoDB.colportfolio).deleteMany(myquery, function(err, obj) {
                if (err) throw err;
                dbo.collection(env.mongoDB.colportfolio).insertOne(data, function(err, res) {
                    if (err) throw err;
                    console.log("Document inserted");
                    resolve(res.insertedId);
                    db.close();
                });
            });
        });
    });
};

function UpdateData(id, data){
    var myquery = { _id: ObjectID(id) };

    return new Promise(function(resolve, reject){
        MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;                
            var dbo = db.db(env.mongoDB.dbportfolio);       
            dbo.collection(env.mongoDB.colportfolio).updateOne(myquery, data, function(err, res) {
                if (err) throw err;
                console.log(res.result.nModified + " Document updated");
                resolve(res.result.nModified);
                db.close();
            });
        });
    });
};

function DeleteData(myquery){
    return new Promise(function(resolve, reject){
        MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db(env.mongoDB.dbportfolio);
            //var myquery = { requestid: RequestID };
            dbo.collection(env.mongoDB.colportfolio).deleteMany(myquery, function(err, obj) {
                if (err) throw err;
                console.log(obj.result.n + " document(s) deleted");
                resolve(obj.result.n + " document(s) deleted");
                db.close();
            });
        });
    });
};

function DeleteSearchData(myquery){
    return new Promise(function(resolve, reject){
        MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db(env.mongoDB.dbportfolio);
            //var myquery = { requestid: RequestID };
            dbo.collection(env.mongoDB.colsearch).deleteMany(myquery, function(err, obj) {
                if (err) throw err;
                //console.log(obj.result.n + " search document(s) deleted");
                resolve(obj.result.n + " search document(s) deleted");
                db.close();
            });
        });
    });
};

function InsertSearchData(data){
    //if exists acts as an update (delete first, add next)
    //else acts as an insert
    return new Promise(function(resolve, reject){
        MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db(env.mongoDB.dbportfolio);
            //var myquery = { answer: "no" };
            dbo.collection(env.mongoDB.colsearch).insertOne(data, function(err, res) {
                if (err) throw err;
                //console.log("Search Document inserted");
                resolve(res.insertedId);
                db.close();
            });
        });
    });
};

function QueryData(myquery, myfields, sortfields){
    return new Promise(function(resolve, reject){
        MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db(env.mongoDB.dbportfolio);
            //var myquery = { answer: "no" };
            dbo.collection(env.mongoDB.colportfolio).find(myquery, { projection: myfields }).sort(sortfields).toArray(function(err, result) {
                if (err) throw err;
                resolve(result);
                db.close();
            });
        });
    });
};

module.exports.InsertData = InsertData;
module.exports.UpdateData = UpdateData;
module.exports.DeleteData = DeleteData;
module.exports.QueryData = QueryData;
module.exports.DeleteSearchData = DeleteSearchData;
module.exports.InsertSearchData = InsertSearchData;

