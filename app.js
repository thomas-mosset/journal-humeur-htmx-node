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
import createEditTemplate from './views/editTemplate.js';
import createChartTemplate from './views/chartTemplate.js';

// Modules
import fetchEmojis from './modules/emojisModule.js';
import convertToCSV from './modules/convertCSVModule.js';

// create app
const app = express();
app.use(express.urlencoded({extended: false}));

// static assets
app.use(express.static('public'));

// GET ROUTES
app.get('/', async (req, res) => {
    try {
        // Récupérer les émojis avant de créer la page
        const emojiHTML = await fetchEmojis(EMOJI_API_URL);
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

app.get('/moods/edit/:id', async (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM moods WHERE id = ?`;

    try {
        const emojiHTML = await fetchEmojis(EMOJI_API_URL); // Récupération des émojis

        // get the requested mood in db
        db.get(query, [id], (err, row) => {
            if (err) {
                console.error("Erreur lors de la modification de l'humeur :", err);
                return res.status(500).send("Erreur interne du serveur");
            }

            if (!row) {
                return res.status(404).send("Humeur non trouvée");
            }

            // console.log("id", id, "row", row);

            // return the edit form with mood's infos from db + emojis
            res.send(createEditTemplate(row, emojiHTML));
        });
    } catch (err) {
        console.error("Erreur lors de la récupération des emojis :", error);
        res.status(500).send("Erreur lors du chargement des émojis.");
    }
});

app.get('/moods/chart', (req, res) => {
    const query = `SELECT mood FROM moods`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Erreur lors de la récupération des statistiques :", err);
            return res.status(500).send("Erreur interne du serveur");
        }
        
        let moodCount = {};

        rows.forEach(row => {
            // Break every emoji
            const emojis = Array.from(row.mood);
            
            // Loop through the emojis
            emojis.forEach(emoji => {
                // if multiple emojis are the same...
                if (moodCount[emoji]) {
                    // ... we add 1 to count
                    moodCount[emoji]++;
                } else {
                    // ... there's only one
                    moodCount[emoji] = 1;
                }
            });
        });

        // Convert into an arrau [{ mood: "☺️", count: 3 }, ...]
        const moodArray = Object.entries(moodCount).map(([mood, count]) =>( {
            mood,
            count
        }));

        res.send(createChartTemplate(moodArray))
    });
});

app.get('/moods/export-json', (req, res) => {
    const query = `SELECT * FROM moods`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Erreur lors de la récupération des humeurs :", err);
            return res.status(500).send("Erreur interne du serveur");
        }

        // test to see data : res.json(rows);

        // Data send as JSON
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="moods.json"');
        res.send(JSON.stringify(rows, null, 2)) // Indentation for better visibility

    })
});

app.get('/moods/export-csv', (req, res) => {
    const query = `SELECT * FROM moods`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Erreur lors de la récupération des humeurs :", err);
            return res.status(500).send("Erreur inetrne du serveur.");
        }

        if (rows.length === 0) {
            return res.status(404).send('Aucune donnée à exporter.');
        }

        // Convert data as CSV through the convertToCSV() function from the modules folder
        const csv = convertToCSV(rows);

        // Config HTTP header to be able to download the CSV file
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="moods.csv');

        // Send to client the csv file
        res.send(csv);
    });
});

// POST ROUTES
app.post('/moods', (req, res) => {
    const { date, mood, comment } = req.body;

    // Check if date is in JJ-MM-AAAA format with a regex
    const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = date.trim().match(dateRegex); // trim() remove space

    // If no match is found, return an error
    if (!match) {
        return res.status(400)
            .set("HX-Trigger", "error")  // Trigger HTMX error event
            .send("Format de date invalide. Utilisez JJ-MM-AAAA.");
        
    }

    // Extract day, month, and year from the match groups
    const [_, dateDay, dateMonth, dateYear] = match; // "_" -> don't need this value / it's a js convention

    // Check if date or mood is set 
    if (!date || !mood) {
        return res.status(400)
            .set("HX-Trigger", "error")  // Trigger HTMX error event
            .send("Veuillez remplir tous les champs obligatoires.");
    }

    // Check if day is between 01 and 31
    if (parseInt(dateDay) < 1 || parseInt(dateDay) > 31) {
        return res.status(400)
            .set("HX-Trigger", "error")  // Trigger HTMX error event
            .send("Le jour (JJ) renseigné doit être compris entre 01 et 31.");
    }

    // Check if month is between 01 and 12
    if (parseInt(dateMonth) < 1 || parseInt(dateMonth) > 12) {
        return res.status(400)
            .set("HX-Trigger", "error")  // Trigger HTMX error event
            .send("Le mois (MM) renseigné doit être compris entre 01 et 12.");
    }

    // Check if year is between 1900 and this year
    const currentYear = new Date().getFullYear();

    if (parseInt(dateYear) < 1900 || parseInt(dateYear) > currentYear) {
        return res.status(400)
            .set("HX-Trigger", "error")  // Trigger HTMX error event
            .send(`L'année (AAAA) renseignée doit être compris entre 1900 et l'année en cours (${currentYear}).`);
    }

    // Check if date is after today's date
    const currentDate = new Date();
    const providedDate = new Date(`${dateYear}-${dateMonth}-${dateDay}`);

    if (providedDate > currentDate) {
        return res.status(400)
            .set("HX-Trigger", "error")  // Trigger HTMX error event
            .send(`La date renseignée ne peut pas être postérieure à la date du jour.`);
    }

    // [
    //   '21-03-2025',  // match[0] : full string
    //   '21',          // match[1] : first group (day)
    //   '03',          // match[2] : second group (month)
    //   '2025'         // match[3] : third group (year)
    // ]

    const query = `INSERT INTO moods (date, mood, comment) VALUES (?, ?, ?)`;

    db.run(query, [date, mood, comment || null], function (err) {
        if (err) {
            return res.status(500).send("Erreur lors de l'ajout de l'humeur");
        }

        // get the id of the current submitted mood 
        const insertedId = this.lastID;

        res.send(`
                <li class="mood-list-item" id="mood-${insertedId}">
                    <span>${date} :</span> ${mood}
                    ${comment ? `<span>${comment}</span>` : ""}

                    <div class="moods-btn">
                        <button
                            hx-get="/moods/edit/${insertedId}"
                            hx-target="#edit-modal-content"
                            hx-swap="innerHTML"
                            hx-on::after-request="openEditModal();"
                        >Modifier ✏️</button>
                        <button 
                            hx-delete="/moods/${insertedId}"
                            hx-target="#mood-${insertedId}"back end e
                            hx-swap="delete"
                        >Supprimer ❌</button>
                    </div>
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


// EDIT ROUTES
app.put('/moods/:id', (req, res) => {
    const id = req.params.id;
    const { date, mood, comment } = req.body;

    // console.log("PUT request received for mood ID:", id);

    // Vérifier si l'humeur existe
    const selectQuery = `SELECT * FROM moods WHERE id = ?`;

    db.get(selectQuery, [id], (err, row) => {
        if (err) {
            console.error("Erreur lors de la récupération de l'humeur :", err);
            return res.status(500).send("Erreur interne du serveur");
        }

        if (!row) {
            return res.status(404).send("Humeur non trouvée");
        }

        // Check if updated data are identical to the db data
        if (row.date === date && row.mood === mood && row.comment === (comment || null)) {
            return res.status(200); // if yes, we just send 200
        }


        // Check if date is in JJ-MM-AAAA format with a regex
        const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
        const match = date.trim().match(dateRegex); // trim() remove space

        // If no match is found, return an error
        if (!match) {
            return res.status(400)
                .set("HX-Trigger", "error")  // Trigger HTMX error event
                .send("Format de date invalide. Utilisez JJ-MM-AAAA.");
            
        }

        // Extract day, month, and year from the match groups
        const [_, dateDay, dateMonth, dateYear] = match; // "_" -> don't need this value / it's a js convention

        // Check if date or mood is set 
        if (!date || !mood) {
            return res.status(400)
                .set("HX-Trigger", "error")  // Trigger HTMX error event
                .send("Veuillez remplir tous les champs obligatoires.");
        }

        // Check if day is between 01 and 31
        if (parseInt(dateDay) < 1 || parseInt(dateDay) > 31) {
            return res.status(400)
                .set("HX-Trigger", "error")  // Trigger HTMX error event
                .send("Le jour (JJ) renseigné doit être compris entre 01 et 31.");
        }

        // Check if month is between 01 and 12
        if (parseInt(dateMonth) < 1 || parseInt(dateMonth) > 12) {
            return res.status(400)
                .set("HX-Trigger", "error")  // Trigger HTMX error event
                .send("Le mois (MM) renseigné doit être compris entre 01 et 12.");
        }

        // Check if year is between 1900 and this year
        const currentYear = new Date().getFullYear();

        if (parseInt(dateYear) < 1900 || parseInt(dateYear) > currentYear) {
            return res.status(400)
                .set("HX-Trigger", "error")  // Trigger HTMX error event
                .send(`L'année (AAAA) renseignée doit être compris entre 1900 et l'année en cours (${currentYear}).`);
        }

        // Check if date is after today's date
        const currentDate = new Date();
        const providedDate = new Date(`${dateYear}-${dateMonth}-${dateDay}`);

        if (providedDate > currentDate) {
            return res.status(400)
                .set("HX-Trigger", "error")  // Trigger HTMX error event
                .send(`La date renseignée ne peut pas être postérieure à la date du jour.`);
        }


        // Update the mood
        const updateQuery = `UPDATE moods SET date = ?, mood = ?, comment = ? WHERE id = ?`;

        db.run(updateQuery, [date, mood, comment || null, id], function (err) {
            if (err) {
                console.error("Erreur lors de la mise à jour de l'humeur :", err);
                return res.status(500).send("Erreur interne du serveur");
            }

            // console.log("Humeur mise à jour avec succès :", { id, date, mood, comment });

            // Send the update directly into the list through HTMX
            res.send(`
                <li class="mood-list-item" id="mood-${id}">
                    <span>${date} :</span> ${mood}
                    ${comment ? `<span>${comment}</span>` : ""}

                    <div class="moods-btn">
                        <button
                            hx-get="/moods/edit/${mood.id}"
                            hx-target="#edit-modal-content"
                            hx-swap="innerHTML"
                            hx-on::after-request="openEditModal();"
                        >Modifier ✏️</button>
                        <button 
                            hx-delete="/moods/${id}"
                            hx-target="#mood-${id}"
                            hx-swap="delete"
                        >Supprimer ❌</button>
                    </div>
                </li>
            `);
        });
    });
});

// DELETE ROUTES
app.delete('/moods/:id', (req, res) => {
    const id = req.params.id;

    const query = `DELETE FROM moods WHERE id = ?`;

    db.run(query, [id], function (err) {
        if (err) {
            console.error("Erreur lors de la suppression de l'humeur :", err);
            return res.status(500).send("Erreur interne du serveur");
        }

        if (this.changes === 0) {
            return res.status(404).send("Humeur non trouvée");
        }

        res.send(); // send an empty respond
    });
});

// listen to port
app.listen(3000, () => {
    console.log('App listening on port 3000');
});