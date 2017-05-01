var BaseSchema = require('./BaseModel')();
var RelaymeBaseSchema = BaseSchema.RelaymeBaseSchema;
var mongoose = require('mongoose');
var Mixed = mongoose.Schema.Types.Mixed;

module.exports = function(mongoose_db, modules) {

    var userSchema = new RelaymeBaseSchema({
        username : {
            type : String,
            'default' : '',
            trim : true,
            index : {
                unique : true
            }
        },
        passwordHash : {
            type : String,
            'default' : '',
            trim : true
        },
        salt : {
            type : String,
            'default' : '',
            trim : true
        },
        email : {
            type : String,
            trim : true
        },
        deviceType : {
            type : String,
            trim : true
        },
        deviceSubType : {
            type : String,
            trim : true
        },
        deviceVersion : {
            type : String,
            trim : true
        },
        devMode : {
            type : String,
            trim : true
        },
        appVersion : {
            type : String,
            trim : true
        }
    });

    userSchema.path('username').required(true, 'username cannot be blank');
    userSchema.path('passwordHash').required(true, 'passwordHash cannot be blank');
    userSchema.path('salt').required(true, 'salt cannot be blank');

    userSchema.pre('remove', function(next) {
        console.log('remove user Schema');
        var usageStats = mongoose_db.model('UsageStats');
        usageStats.remove({
            username : this.username
        }).exec();
    });

    userSchema.methods = {};

    mongoose_db.model(modules.config.database.COLLECTION_USER, userSchema);
};
