var BaseSchema = require('./BaseModel')();
var RelaymeBaseSchema = BaseSchema.RelaymeBaseSchema;

module.exports = function(mongoose_db, modules) {

    var applicationProperties = new RelaymeBaseSchema({
        key : {
            type : String,
            index : {
                unique : true
            }
        },
        value : {
            type : String
        }
    });

    mongoose_db.model(modules.config.database.COLLECTION_APPLICATION_PROPERTY, applicationProperties);
};
