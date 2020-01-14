$(document).ready(function() {
    const articleContainer = $(".article-container");

    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    // start everything on page load
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
        "<a class='btn btn-danger btn-delete'>",
        "Delete from Saved",
        "</a>",
        "<a class='btn btn-info btn-notes'>Article Notes</a>",
        "</h4>",
        "</div>",
        "</div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>"
        ].join(""));
 
        panel.data("_id", article._id);
    
        return panel;
    }

    function renderEmpty() {

        const emptyAlert = 
        $(["<div class='alert alert-warning text-center'>",
        "<h5>Uh Oh. looks like we don't have any saved articles.</h5>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h4>Would you like to browse available articles?</h4>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h5><a href='/'>Browse Articles</a></h5>",
        "</div>",
        "</div>"
        ].join(""));
        // appending data to page
        articleContainer.append(emptyAlert);
    }

    function renderNotesList(data) {

        const notesToRender = [];
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
      
            for (var i = 0; i < data.notes.length; i++) {
        
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger btn-note-delete'>x</button>",
                    "</li>"
                ].join(""));
                currentNote.children("button").data("_id", data.notes[i]._id);
                notesToRender.push(currentNote);
        

            }
        }

        $(".note-container").append(notesToRender);
    }

    function handleArticleDelete() {
        const articleToDelete = $(this).parents(".panel").data();
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function(data) {
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleArticleNotes() {
        const currentArticle = $(this).parents(".panel").data();
        $.get("/api/notes/" + currentArticle._id).then(function(data) {
            const modalText = [
                "<div class='container-fluid text-center'>",
                "<h5>Notes For Article: ",
                currentArticle._id,
                "</h5>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-dark btn-save'>Save Note</button>",
                "</div>"
            ].join("");
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            const noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            $(".btn-save").data("article", noteData);
            renderNotesList(noteData);
        });
    }

    function handleNoteSave() {
        const noteData;
        const newNote = $(".bootbox-body textarea").val().trim();
        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function() {
                // when complete, close the modal
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
// hide the modal
            bootbox.hideAll();
        });
    }

})