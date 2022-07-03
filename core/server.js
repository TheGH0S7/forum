/*      express startup      */

const express = require('express')
const app = express();
const PORT = 3000;

app.listen(PORT,() => {
    console.log('The application is listening '
          + 'on port http://localhost:'+PORT);
});

/*      mongodb startup      */

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/forum",{
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("DB CONNECTED");
});

/*      routes load      */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const UserRoute = require('./controllers/usercontroler');
const AuthRoute = require('./controllers/authcontroller');

app.get('/', (req, res) => {
    res.json({data: 'welcome to galactical.club REST API'});
});

app.use('/user', UserRoute);
app.use('/auth', AuthRoute);




