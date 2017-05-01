var util = require("util");
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
    function RelaymeBaseSchema() {
        Schema.apply(this, arguments);

        this.add({
            dateCreated : {
                type : Date
            },
            dateLastModified : {
                type : Date
            }
        });

        this.pre('save', function(next) {
            if (this.dateCreated === undefined) {
                this.dateCreated = new Date();
            }
            this.dateLastModified = new Date();
            next();
        });
        // findOneAndUpdate does not call save, so we need to handle this by the following hack
        // https://github.com/Automattic/mongoose/issues/964
        this.post('findOneAndUpdate', function(doc) {
            if (doc != null) {
                doc.dateLastModified = new Date();
                doc.save();
            }
        });
    }

    util.inherits(RelaymeBaseSchema, Schema);
    return {
        RelaymeBaseSchema : RelaymeBaseSchema
    };
};
