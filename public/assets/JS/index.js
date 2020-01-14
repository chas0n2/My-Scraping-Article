$(document).ready(function() {

    const articleContainer = $(".article-container");
    $(document).on("click", ".btn-save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);

    initPage();

    function initPage() {
        articleContainer.empty();
        $.get("/api/headlines?saved=false")
        .then(function(data) {
            console.log("test" + data)
            if (data && data.length) {
                renderArticles(data);
            }
            else {
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        const articlePanels = [];
        for (let i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        const panel = 
        $(["<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h4>",
        article.headline,
        "<a class='btn btn-secondary btn-save'>",
        "Save Article",
        "</a>",
        "</h4>",
        "</div>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>",
        ].join(""));
        panel.data("_id", article._id);

        return panel;
    }

    function renderEmpty() {

        const emptyAlert = 
        $(["<div class='alert alert-warning text-center'>",
        "<h5>Uh oh, looks like we don't have any new articles.</h5>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h4>What would you like to do?</h4>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h5><a class='scrape-new'>Try Scraping New Articles</a></h5>",
        "<h5><a href='/saved'>Go to Saved Articles</a></h5>",
        "</div>",
        "</div>"
    ].join(""));
    // appending this data to the page
    articleContainer.append(emptyAlert);
    }

    function handleArticleSave() {
        const articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;
        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        })
        .then(function(data) {
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleArticleScrape() {

        $.get("/api/fetch")
        .then(function(data) {
            initPage();
        });
    }
});