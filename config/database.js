import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose();

// Connexion à la base de données (créée si elle n'existe pas)
const db = new sqlite3.Database("./journal_humeur.db", (err) => {
    if (err) {
        console.error("Erreur lors de l’ouverture de la base de données :", err.message);
    } else {
        console.log("Connexion à la base de données SQLite réussie.");
    }
});

// Création de la table des humeurs
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS moods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date VARCHAR(10) NOT NULL UNIQUE,
            mood VARCHAR(50) NOT NULL,
            comment TEXT NULL
        )
    `, (err) => {
        if (err) {
            console.error("Erreur lors de la création de la table :", err.message);
        } else {
            console.log("Table 'moods'créée.");
        }
    });
});

export default db;