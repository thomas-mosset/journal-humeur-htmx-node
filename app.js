import express from 'express';

import db from "./config/database.js";

import createHomepage from './views/index.js';

// create app
const app = express();
app.use(express.urlencoded({extended: false}));

// static assets
app.use(express.static('public'));

// routes
app.get('/', (req, res) => {
    res.send(createHomepage());
});

app.post('/moods', (req, res) => {
    const { date, mood, comment } = req.body;

    if (!date || !mood) {
        return res.status(400).send("Veuillez remplir tous les champs obligatoires.");
    }

    const query = `INSERT INTO moods (date, mood, comment) VALUES (?, ?, ?)`;

    db.run(query, [date, mood, comment || null], function (err) {
        if (err) {
            return res.status(500).send("Erreur lors de l'ajout de l'humeur");
        }

        // res.redirect('/');

        res.send(`
            <li>
                <strong>${date}</strong> - ${mood} <br>
                ${comment ? `<em>${comment}</em>` : ""}
            </li>
        `);
    })
});

// listen to port
app.listen(3000, () => {
    console.log('App listening on port 3000');
});