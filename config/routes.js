module.exports = function(router) {
    //Homepage
    router.get("/", function(req, res) {
        res.render("home");
    });
    //saved articles page
    router.get("/saved", function(req, res) {
        res.render("saved");
    });
}