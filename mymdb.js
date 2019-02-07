/*
	Homework #10 
	Michelle Monteith
	CSC 337 Fall 2018

    Makes the proper GET requests to the server for movie results based on the 
    user inputted actor. 


	URL: http://localhost:3000/?mode={}&first={}&last={}

    mode: all, show all movies for the actor
          bacon, show all movies for the actor and Kevin Bacon

    first: first name of actor
    last: last name of actor
*/

"use strict";

(function() {	

    let movies;

	window.onload = function() {
        document.getElementById("allMovies").onclick = getAllMovies;
        document.getElementById("withKevin").onclick = getBaconMovies;
	};  

    /**
        Sends a GET request to mymdb service specifically for all movies
        that the actor has been in.
    */
    function getAllMovies(){
        let first = capitalize(document.getElementById("firstAll").value.trim());
        let last = capitalize(document.getElementById("lastAll").value.trim());

        let url = "http://localhost:3000/?mode=all&first="+first+"&last="+last;
        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                resetContent("all", first, last);
                setMovies(JSON.parse(responseText), "all", first, last);
            })
        .catch(function(error) {
            console.log(error);
        });
    }

    /**
        Sends a GET request to mymdb service specifically for all movies
        that the actor has been in with Kevin Bacon.
    */
    function getBaconMovies(){
        let first = capitalize(document.getElementById("firstBacon").value.trim());
        let last = capitalize(document.getElementById("lastBacon").value.trim());

        let url = "http://localhost:3000/?mode=bacon&first="+first+"&last="+last;
        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                resetContent("bacon", first, last);
                setMovies(JSON.parse(responseText), "bacon", first, last);
            })
        .catch(function(error) {
            console.log(error);
        });
    }

    /**
        Update the page to show the movie results from the GET request.
    */
    function displayResults(){
        
        let content = document.getElementById("content");

        // Set up the movies table.
        let table = document.getElementById("table");
        let header = document.createElement("tr");
        let num = document.createElement("th");
        let mv = document.createElement("th");
        let year = document.createElement("th");

        mv.innerHTML = "Title";
        num.innerHTML = "#";
        year.innerHTML = "Year";

        header.appendChild(num);
        header.appendChild(mv);
        header.appendChild(year);
        table.appendChild(header);

        // Add all the movies from the GET response to the table.
        for(let i = 0; i < movies.length; i++){
            let entry = document.createElement("tr");
            let n = document.createElement("td");
            let movie = document.createElement("td");
            let yr = document.createElement("td");

            n.innerHTML = i + 1;
            movie.innerHTML = movies[i]["title"];
            yr.innerHTML = movies[i]["year"];

            entry.appendChild(n);
            entry.appendChild(movie);
            entry.appendChild(yr);
            table.appendChild(entry);
        }
        content.appendChild(table);
    }

    /**
        Resets the content div to prepare it for new results.
    */
    function resetContent(mode, first, last){
        let title = document.getElementById("title");
        title.innerHTML = "Results for " + first + " " + last;
  
        resetTable();
        removeKevinImg();

        let desc = document.getElementById("subtitle");
        if(mode == "all"){
            desc.innerHTML = "Films starring " + first + " " + last;
        }else{
            desc.innerHTML = "Films starring " + first + " " + last + " and Kevin Bacon";
        }
    }  


    /**
        Helper function to remove the image of kevin bacon
    */
    function removeKevinImg(){
        let kev = document.getElementById("kevin");
        if(kev) {
            kev.remove();
        }
    }

    /**
        From the JSON response, put all the movies into a list.
    */
    function setMovies(results, mode, first, last){
        if(Object.keys(results).length == 0){
            actorNotFound(mode, first, last);
            return;
        }
        movies = results;
        displayResults();
    }

    /**
        Updates the content div if the actor wasn't found in the imdb. 
    */
    function actorNotFound(mode, first, last){
        let title = document.getElementById("title");
        title.innerHTML = "";

        let desc = document.getElementById("subtitle");
        if(mode == "all"){
            desc.innerHTML = "Actor " + first + " " + last + " not found.";
        }else{
            desc.innerHTML = "Actor " + first + " " + last + " was not in \
            any movies with Kevin Bacon";
        }

        resetTable();
        removeKevinImg();
    }

    /**
        Resets the table to be empty.
    */
    function resetTable(){
        let table = document.getElementById("table");
        table.innerHTML = "";
    }

    /**
        Helper function to ensure good input
    */
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    /**
        Returns the response text if the status is in the 200s
        otherwise rejects the promise with a message including the status
    */
    function checkStatus(response) {  
        if (response.status >= 200 && response.status < 300) {  
            return response.text();
        } else if (response.status == 404) {
            // sends back a different error when we have a 404 than when we have
            // a different error
            return Promise.reject(new Error("Sorry, we couldn't find that page")); 
        } else {  
            return Promise.reject(new Error(response.status+": "+response.statusText)); 
        } 
    }
})();
