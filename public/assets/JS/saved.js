$(document).ready(function() {
    const articleContainer = $(".article-container");

    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    InitPage();

    function InitPage() {
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function(data) {
            if (data && data.length) {
                renderArticles(data);
            } else {
                renderEmpty();
            }
        });
    }
    // render article card
    function renderArticles(articles) {
        const articlesCard = [];
        
        for (let i = 0; i < articles.length; i++) {
            articlesCard.push(createCard(articles[i]));
        }
        articleContainer.append(articlePanels);
    }

    function createCard(article) {
        const card = 
        $(["<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>",
        article.headline,
        "<a class='btn btn-danger delete'>",
        "Delete From Saved",
        "</a>",
        "<a class='btn btn-info notes'>Article notes</a>",
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
    
    // Delete article card
    function handleArticleDelete() {
        const articleToDelete = $(this.parents(".card").data());
        
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function(data) {

            if (data.ok) {
                InitPage();
            }
        });
    
    }

    function handleArticleNotes() {
        const currentArticle = $(this).parents(".card").data();

        $.get("/api/notes/" + currentArticle._id).then(function(data) {
            const modalText = [
              "<div class='contianer-fluid text-center'>",
              "<h4>Notes for Article: ",
              currentArticle._id,
              "</h4>",
              "<hr />",
              "ul class='list-group note-container'>",
              "</ul>",
              "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
              "<button class='btn btn-success save'>Save Note</button>",
              "</div>"
            ].join("");
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };

            $(".btn.save").data("article", noteData);

            renderNotesList(noteData);
        });
    }
    function renderNotesList(data) {
        const notesToRender = []
        const currentNote;
        if (!data.notes.length) {
        
            currentNote = [
            "<li class='list-group-item'>",
            "No notes for this article yet.",
            "</li>"
        ].join("");
        notesToRender.push(currentNote);  
    }
    else {
        for (let i = 0; i < data.notes.length; i++) {
            currentNotes = $([
                "<li class='list-group-item note'>",
                data.notes[i].noteText,
                "<button class='btn btn-danger note-delete'>x</button>",
                "</li>"
            ].join(""));
            
            currentNote.children("button").data("_id", data.notes[i]._id);
            notesToRender.push(currentNote);
        }
    }
    $(".note-container").append(notesToRender);
}

function handleNoteSave() {
    const noteData;
    const newNote = $(".bootbox-body testarea").val().trim();

    if (newNote) {
        noteData = {
            _id: $(this).data("article")._id,
            noteText: newNote
        };
        $.post("/api/notes", noteData).then(function() {
            bootbox.hideAll();
        });
    }
}

function handleNoteDelete() {
    const noteToDelete = $(this).data("_id");
    
    $.ajax({
        url: "/api/notes/" + noteToDelete,
        method: "DELETE"
    }).then(function() {
        bootbox.hideAll();
    });
}
    
});