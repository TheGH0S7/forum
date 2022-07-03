const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    rank: {
        type: Number,
        default: 1
    },
    aboutme: String,    
    Createdata: {type: Date, default: Date.now }
    
})
UserSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

autoIncrement.initialize(mongoose.connection);
UserSchema.plugin(autoIncrement.plugin, 'Counter');
module.exports = mongoose.model('User', UserSchema)