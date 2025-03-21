const createHomepage = () => /*html*/`
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Journal d'humeur</title>
            <script src="https://unpkg.com/htmx.org@2.0.4" integrity="sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+" crossorigin="anonymous"></script>
            <link rel="stylesheet" href="/styles.css" />
        </head>

        <body>
            <header>
                <h1>Journal d'humeur</h1>
            </header>

            <main>
                <div class="form">
                <h2>Quelle est ton humeur aujourd'hui ?</h2>
                    <form hx-post="/moods" hx-target="#moods-list" hx-swap="beforeend">
                        <div>
                            <label for="date">Entrez une date (format JJ-MM-AAAA)</label>
                            <input type="text" id="date" name="date" placeholder="Ex: 21-03-2025" required />
                        </div>

                        <div>
                            <label for="mood">Entrez votre humeur du jour (format émoji)</label>
                            <input type="text" id="mood" name="mood" placeholder="Ex: 😊, 😡, 😢..." required />
                        </div>

                        <div>
                            <label for="comment">Entrez un commentaire (optionnel)</label>
                            <textarea name="comment" id="comment" placeholder="..."></textarea>
                        </div>
                        <div>
                            <button type="submit">Ajouter mon humeur</button>
                        </div>
                    </form>
                </div>

                <div class="moods">
                    <h2>Historique des humeurs</h2>
                    <ul id="moods-list">
                        <!-- Les humeurs ajoutées apparaîtront ici via HTMX -->
                    </ul>
                </div>
            </main>
        </body>
    </html>
`;


export default createHomepage;

