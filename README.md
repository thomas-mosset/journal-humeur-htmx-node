# Journal d'humeurs

## Technologies utilisées

- Front-end : HTMX + CSS
- Back-end : Node + Express
- Base de données : SQLite
- API : [emoji-api](https://emoji-api.com/)
- Autres : Node fetch + Dotenv + [Chart.js](https://www.chartjs.org/)

## Fonctionnalités

- Ajouter une humeur (Ex : 😊, 😡, 😢) avec ou sans commentaire
- Modifier une humeur
- Supprimer une humeur
- Afficher l'historique des humeurs
- Graphique camembert (montre le pourcentage d'émojis utilisés)
- Export des données (CSV/JSON)

## Démo

[![Démo de l'application](https://markdown-videos-api.jorgenkh.no/youtube/RquX-3QcgUk)](https://youtu.be/RquX-3QcgUk)

## Lancer l'app

```sh
npm i
```

Puis :

```sh
nodemon app.js
```

[Se rendre sur l'application via le port 3000](http://localhost:3000/)

## Créer la base de données

```sh
node config/database.js
```
