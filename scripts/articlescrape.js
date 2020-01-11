// Scrape Script
// .get axios
// Require Cheerio
const request = require("request");
const cheerio = require("cheerio");

const scraper = function(cb) {
    request("https://www.pcmag.com/", function(err, res, body){
        const $ = cheerio.load(body);
        const articles = [];
        
        $(".theme-summary").each(function(i, element){

            const head = $(this).children(".story-heading").text().trim();
            const sum = $(this).children(".summary").text().trim();

            if(head && sum){
                const headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                const sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                const dataToAdd = {
                    headline: headNeat,
                    summary: sumNeat
                };
                articles.push(dataToAdd);
            }
        });
        cb(articles);
    });
};
module.exports = scraper