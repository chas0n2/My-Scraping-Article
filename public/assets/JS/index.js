$(document).ready(function() {

    const articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);

    initPage();
    function initPage() {
        articleContainer.empty();
        $.get("/api/headlines?saved=false")
        .then(function(data) {
            if (data && data.length) {
                renderArticles(data);
            }
            else {
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {

    const articleCards = [];
    for (let i = 0; i < articles.length; i++) {
        articleCards.push(createCards(articles[i]));
        
    }
    articleContainer.append(articleCards);
    }
    function createCards(article) {

        const card =
        $(["<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>",
        article.headline,
        "<a class='btn btn-success save'>",
        "Save Article",
        "</a>",
        "</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4>",
        article.summary,
        "</h4>",
        "</div>",
        "</div>"
    ].join(""));
    card.data("_id", article._id);
    return card;
  }

  function renderEmpty() {
      const emptyAlert = 
      $(["<div class='card'>",
      "<div class='card-header text-center'>",
      "<h3>No saved articles.</h3>",
      "</div>",
      "<div class='card-body text-center'>",
      "<h4>Use the 'Scrape New Articles' button to get started!</h4>",
      "</div>",
      "</div>"
        ].join(""));
        articleContainer.append(emptyAlert);
  }

  function handleArticleSave() {
      const articleToSave = $(this).parents(".card").data();
      articleToSave.saved = true;

      $ajax({
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
          bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
      });
  }
})