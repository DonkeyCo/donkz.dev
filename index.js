const express = require('express');
const request = require("request");
const app = express();
const server = require('http').createServer(app);

const port = 5000;
const hostname = "134.255.217.12";
const config = require("./config.json");

//Start listening to port 443
app.listen(port, hostname, function() {
    console.log("Webserver laeuft auf Port " + port)
})

//Root directory
app.use(express.static(__dirname + "/public"))

//Create a header to authenticate to Github API
const header = {
    "User-Agent": config["production"]["user_agent"],
    "Authorization": "token " + config["production"]["github"]
}

//Request for all public repositories
const optionsList = {
    url: "https://api.github.com/user/repos?type=public",
    method: "GET",
    headers: header
}

var responses = []
request(optionsList, function(err, res, body) {
    //Request for my public repositories
    var result = JSON.parse(body);
    //show the result at [url]/api/github-repos
    app.get("/api/github-repos", function(req, res) {
        res.send(result)
    })

    //Determine languages of repositories
    //get a list of allrepositories
    var repoList = getRepoList(result);
    //list of all responses [needed because of async] (preparation) + counter
    var responses = {repo_count: repoList.length, repos: {}};
    var c_requests = 0;
    //Iterate through all Repositories and send a request
    for(var i = 0; i < repoList.length; i++) {
        //pattern for all requests regarding the used languages
        var langList = {
            url: "https://api.github.com/repos/DonkeyCo/" + repoList[i] +"/languages",
            method: "GET",
            headers: header
        }
        //Request for the used languages in one repository
        request(langList, function(err, res, body) {
            //retrieve the name of the repository
            var name = res.request.path.replace("/repos/DonkeyCo/", "").replace("/languages", "");
            var result = JSON.parse(body);

            //save the keys inside of a variable
            var resultKeys = Object.keys(result);
            var responsesKeys = Object.keys(responses);
            //if there are no keys, it means the repository has no language -> category: other
            if(resultKeys.length == 0) {
                //if an item already exists in this category, push to its list, else create a new list
                if(keyExists("Other", responses)) {
                    responses["repos"]["Other"].push(name);
                } else {
                    responses["repos"]["Other"] = [name];
                }
            } else {
                //same procedure, but iterating through all keys
                for(var rKey in result) {
                    if(keyExists(rKey, responses)) {
                        responses["repos"][rKey].push(name);
                    } else {
                        responses["repos"][rKey] = [name];
                    }
                }
            }
            //increment counter
            c_requests++;
            //if counter equals count of all repositories, all requests are finished
            if(c_requests == repoList.length) {
                //create a page accessible with [url]/api/github-repos.lang where the result can be seen
                app.get("/api/github-repos-lang", function(req, res) {
                    res.send(responses);
                })
            }
        })
    }
})

/** Returns a list of all repository names */
function getRepoList(result) {
    var repoList = [];
    for(var i = 0; i < result.length; i++) {
        repoList.push(result[i]["name"])
    }
    return repoList;
}

/** Checks if the key already exists inside of the given list */
function keyExists(key, responses) {
    for(var respKey in responses["repos"]) {
        if(respKey.localeCompare(key) == 0) { 
            return true;
        }
    }
    return false;
}