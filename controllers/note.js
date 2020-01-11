const Notes = require("../models/notes");
const CreateDate = require("../scripts/dates");

module.exports = {
    get: function(data, cb) {
        Notes.find({
            _headlineId: data._id
        }, cb);
    },
    save: function(data, cb) {
        const newNotes = {
            _headlineId: data._id,
            date: CreateDate(),
            noteText: data.noteText
        };
        Notes.create(newNotes, function (err, doc) {
            if (err) {
                console.log(err);
            }
            else{
                console.log(doc);
                cb(doc);
            }
        });
    },
    delete: function(data, cb) {
        Notes.remove({
            _id: data._id
        }, cb);
        
    }

};