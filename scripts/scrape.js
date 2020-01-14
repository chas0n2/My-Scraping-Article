// Scrape Script
// .get axios
// Require Cheerio
const router = require("express").Router();
var axios = require("axios");
var request = require("request");
var cheerio = require("cheerio");

// This function scrapes articles from link below
var scrape = function() {
  // Scrape the techradar.com website
  router.get("/scrape", function(req, res) {
    // Scrape the techradar.com website
    
    return axios.get("https://www.techradar.com/", function(err, res, body) {
      var $ = cheerio.load(body);
  
      var articles = [];
        console.log(articles);
      $("h2").each(function(i, element) {
  
        var head = $(this)
          .children("a")
          .text()
          .trim();
          console.log("the head is: " + head)
  
        // Grab the URL of the article
        var url = $(this)
          .children("a")
          .attr("href");
  
        var sum = $(this)
          .children("a")
          .text()
          .trim();
  
        if (head && sum && url) {
  
          var dataToAdd = {
            headline: head,
            summary: sum,
            url: url
          };
  
          articles.push(dataToAdd);
          // console.log("the articles are: " + articles)
        
      });
       return articles;
      });

// Export the function, so other files in our backend can use it.

module.exports = scrape