const path = require('path');
const express = require('express');
const hbs = require('hbs');



const app = express();
const port = process.env.PORT || 3000;

const helpers = require('./utils/helpers.js');


const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');
app.use(express.static(publicDirectoryPath));

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);



app.get('/', (req, res) => {
    res.render('index', {
        title: "Provoke",
        name: "Shakaib Arsalan",
        app: "Analyzer"
    });
});

app.get('/getAllMappings', (req, res) => {
    const obj = { id: req.query.id, mT: req.query.mT, sC: req.query.sC, dC: req.query.dC, sFN: req.query.sFN, dFN: req.query.dFN, vM: req.query.vM };

    helpers.getMergedData(obj, (error, mappingres) => {
        if (error) {
            // console.log(error);
            return res.send({ error: error });
        }

        res.send({ mappingres: mappingres });

    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: "404",
        errorMessage: "Page not found",
        name: "Shakaib Arsalan"
    });
});



app.listen(port, () => {
    console.log("Server is listening at the port " + port);
})
