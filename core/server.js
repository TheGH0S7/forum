/*      express startup      */

const express = require('express')
const app = express();
const PORT = 3000;

app.listen(PORT,() => {
    console.log('The application is listening '
          + 'on port http://localhost:'+PORT);
});


/*      routes load      */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

require('./controllers/index')(app);

app.get('/', (req, res) => {
    res.json({data: 'welcome to galactical.club REST API'});
});






