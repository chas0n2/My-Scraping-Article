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
    router.get("/api/headlines", function(res, req) {
        const query = {};
        if (req.query.saved) {
            query = req.query;
        }

        headlinesCon.get(query, function(data) {
            res.json(data);
        });
    });
    router.delete("/api/healines/:id", function (req, res) {
        const query = {};
        query._id = req.params.id;
        headlinesCon.delete(query, function(err, data) {
            res.json(data);
        });
    });
    router.patch("/api/headlines", function(req, res) {
        headlinesCon.update(req.body, function(err, data) {
            res.json(data);
        });
    });
    router.get("/api/headlines/_id?", function(req, res) {
        const query = {};
        if (req.params.headline_id) {
            query._id = req.params.headline_id;
        }

        notesCon.get(query, function(err, data) {
            res.json(data);
        });
    });

    router.delete("api/notes/:id", function(req, res) {
        const query = {};
        query._id = req.params.id;
        notesCon.delete(query, function(err, data) {
            res.json(data);
        });
    });
    
    router.post("/api,notes", function(req, res) {
        notesCon.save(req.body, function(data) {
            res.json(data);
        });
    });
}

