const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/forum",{
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("DB CONNECTED");
});

mongoose.Promise = global.Promise;

module.exports = mongoose
          