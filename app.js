import express from 'express';
import fetch from "node-fetch";
import db from "./config/database.js";

// .env file
import dotenv from 'dotenv';
dotenv.config();

// API + URL
const EMOJI_API_KEY = process.env.EMOJI_API_KEY;
const EMOJI_API_URL = `https://emoji-api.com/emojis?access_key=${EMOJI_API_KEY}`;

// Views
import createHomepage from './views/index.js';
import createListTemplate from './views/listTemplate.js';

// create app
const app = express();
app.use(express.urlencoded({extended: false}));

// static assets
app.use(express.static('public'));


// FUNCTIONS
const fetchEmojis = async () => {
    try {
        const response = await fetch(EMOJI_API_URL);
        const emojis = await response.json();
        const relevantCategories = ["smileys-emotion", "people-body", "activities", "travel-places"];
        const filteredEmojis = emojis.filter(emoji => relevantCategories.includes(emoji.group));

        return filteredEmojis.map(emoji => `
            <button 
                class="emoji"
                type="button"
                data-value="${emoji.character}"
            >${emoji.character}</button>
        `).join("");
    } catch (error) {
        console.error("Erreur lors de la récupération des émojis :", error);
        return "<p>Impossible de charger les émojis.</p>";
    }
};


// GET ROUTES
app.get('/', async (req, res) => {
    try {
        // Récupérer les émojis avant de créer la page
        const emojiHTML = await fetchEmojis();
        res.send(createHomepage(emojiHTML));
    } catch (error) {
        console.error("Erreur lors du chargement des émojis :", error);
        res.status(500).send("Erreur lors du chargement de la page.");
    }
});

app.get('/moods', (req, res) => {
    const query = `SELECT * FROM moods`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Erreur lors de la récupération des humeurs :", err);
            return res.status(500).send("Erreur interne du serveur");
        }

        // test to see data : res.json(rows);

        res.send(createListTemplate(rows));
    });
});


// POST ROUTES
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

        res.send(`
            <li class="mood-list-item">
                <strong>${date}</strong> : ${mood} <br>
                ${comment ? `<em>${comment}</em>` : ""}
            </li>
        `);
    })
});

app.post('/select-emoji', (req, res) => {
    const { emoji } = req.body;
    res.send(`
        <input type="text" id="mood" name="mood" value="${emoji}" readonly />
    `);
});


// listen to port
app.listen(3000, () => {
    console.log('App listening on port 3000');
});