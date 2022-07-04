const mongoose = require("../database");
const autoIncrement = require('mongoose-auto-increment');
const Bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true,
        select: false,
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    PasswordToken: {
        type: String,
        select: false
    },
    rank: {
        type: Number,
        default: 1
    },
    aboutme: String,    
    Createdata: {type: Date, default: Date.now }
    
})

UserSchema.pre('save', async function(next) {
    const hash = await Bcrypt.hashSync(this.password, 10);
    this.password = hash

    next();
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