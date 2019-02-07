/*
	Homework #10 
	Michelle Monteith
	CSC 337 Fall 2018

	Reaches to the imdb database.
*/

const express = require("express");
const mysql = require('mysql');

const app = express();

var actorID;
var baconID;
var movies;

var fs = require("fs");
const bodyParser = require("body-parser");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var con = mysql.createConnection({
    host: "mysql.allisonobourn.com",
    database: "csc337imdb",
    user: "csc337homer",
    password: "d0ughnut",
    debug: "true"
});

con.connect(function(err) {
    if (err) {
        res.status(500);
        res.send(err);
    }
    console.log("Connected!");
});

/**
    GET allows two different modes: all or bacon. The response is a list of movies matching the actor's
    name and depending on what mode.
*/
app.get('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    let first = req.query.first;
    let last = req.query.last;
    let mode = req.query.mode;

    // First get the ID of the searched for actor.
    let query = "SELECT id FROM actors WHERE last_name=\""+last+"\" AND first_name LIKE \""+first+"%\";"
    con.query(query, function (err, result, fields) {
        if (err || result[0] == undefined){
            res.send(JSON.stringify({}));
            return null;
        }
        setActorID(result[0]["id"]);

        // All mode, get and return all the movies the actor has been in.
        if(mode == "all"){
            query = "SELECT m.name, m.year \
                    FROM movies m \
                    JOIN roles r ON r.movie_id = m.id \
                    JOIN actors a ON r.actor_id = a.id \
                    WHERE r.actor_id="+ actorID +" \
                    ORDER BY m.year DESC, m.name ASC;";    
            con.query(query, function (err, result, fields) {
                if (err){
                    res.send(null);
                }
                setMovies(result);
                res.send(JSON.stringify(movies));
            });
        }

        // Bacon mode, get Kevin Bacon's actor id then return all the movies both actros have been in.
        if(mode == "bacon"){
            query = "SELECT id FROM actors WHERE last_name=\"Bacon\" AND first_name LIKE \"Kevin%\";"
            con.query(query, function (err, result, fields) {
                if (err || result[0] == undefined){
                    res.send(JSON.stringify({}));
                    return null;
                }
                setBaconID(result[0]["id"]);

                 query = "SELECT ma.name, ma.year\
                        FROM actors a\
                        JOIN actors b ON a.id="+actorID+" AND b.id="+baconID+" \
                        JOIN roles ra ON a.id=ra.actor_id\
                        JOIN roles rb ON b.id=rb.actor_id\
                        JOIN movies ma ON ra.movie_id = ma.id AND rb.movie_id=ma.id\
                        ORDER BY ma.year DESC, ma.name ASC;";
                con.query(query, function (err, result, fields) {
                    if (err || result[0]["name"] == undefined){
                        res.send(JSON.stringify({}));
                        return null;
                    }
                    setMovies(result);
                    res.send(JSON.stringify(movies));
                });
            });
        }
    });
});

function setActorID(id){
    actorID = id;
}

function setBaconID(id){
    baconID = id;
}

function setMovies(result){
    movies = [];
    for(let i = 0; i < result.length; i++){
        let movie = {};
        movie["title"] = result[i]["name"];
        movie["year"] = result[i]["year"];
        movies.push(movie);
    }
}

app.listen(3000);