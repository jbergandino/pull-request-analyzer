const express = require('express');
const app     = express();
const port    = 8081;
const http    = require("http");
const server  = app.listen(port, () => {
    console.log('***** Listening on port: ' + port + ' *****');
});
const redis   = require("redis");
const client  = redis.createClient();
const fetch   = require("node-fetch");

app.set("view engine", "ejs");

client.on('error', (err) => {
    console.log("Error " + err);   // output any redis errors to the console
});

app.get('/', (req, res) => {
    const redisCacheKey = 'user:pullrequests';   // key to store results in redis
    return client.get(redisCacheKey, (err, json) => {
        if (json) {   // if key DOES exist in redis, use that data
            console.log('--------------- PULLING FROM CACHE ---------------');
            const source = 'cache';
            json = JSON.parse(json);
            return res.render("index", { json, source });
        } else {     // if key does NOT exist in redis, fetch the data
            let prevPage = false;
            let nextPage = 1;
            let lastPage = false;
            let fetchUrl = 'https://api.github.com/search/issues?q=+type:pr+org:ramda&sort=created&order=asc&per_page=100&page=';

            fetch(fetchUrl + nextPage)
                .then(response => {
                    prevPage = nextPage;
                    lastPage = extractLastPage(response.headers.get('Link'));
                    return response.json();
                }).then(json => {
                        console.log('--------------- FETCHING FROM LIVE ENDPOINT ---------------');
                        // save initial response data in redis, with data expiration (# seconds)
                        client.setex(redisCacheKey, 1200, JSON.stringify(json));
                        // save initial response data in redis list that doesn't expire
                        const now = Date.now();
                        client.rpush("pullrequests", `${now}:${prevPage}:${JSON.stringify(json)}`);
                        // after obtaining initial page data and finding out the total page count, fetch all the others and cache the data
                        for(let i = 2; i <= lastPage; i++) {
                            fetch(fetchUrl + i)
                                .then(innerResponse => innerResponse.json())
                                    .then(innerJson => {
                                        const now = Date.now();
                                        console.log('----- FETCHING ' + fetchUrl + i + ' -----');
                                        client.rpush("pullrequests", `${now}:${i}:${JSON.stringify(innerJson)}`);
                                    })
                        }
                        const source = 'api';
                        return res.render("index", { json, source });
                    }).catch(error => {
                        const errorMessage = error.toString();
                        return res.render("index", { errorMessage });   // if we catch an error, pass details to template
                    })
        }
    });
});



function extractLastPage(links) {
    if (!links) return false;
    const endingCharIndex = links.search(/>; rel=\"last\"/g);
    if (endingCharIndex == -1) return false;
    let beginningCharIndex = endingCharIndex - 1;
    while (links[beginningCharIndex] !== '=') {
        beginningCharIndex--;
    }
    return links.substring(beginningCharIndex + 1, endingCharIndex);
}
