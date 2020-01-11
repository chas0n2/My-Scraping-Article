const scraper = require("../scripts/articlescrape");

const headlinesCon = require("../controllers/headlines");
const notesCon = require("../controllers/note");


module.exports = function(router) {
    //Homepage
    router.get("/", function(req, res) {
        res.render("home");
    });
    //saved articles page
    router.get("/saved", function(req, res) {
        res.render("saved");
    });
    router.get("/api/fetch", function(req, res) {
        headlinesCon.fetch(function(err, docs) {
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "There are no new articles available today, check back tomorrow!"
                });
            }
            else {
                res.json({
                    message: "New Articles " + docs.insertedCount + " Have been added!"
                });
            }
        });
    });

}

