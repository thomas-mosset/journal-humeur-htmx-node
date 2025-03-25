const createHomepage = (emojiHTML) => /*html*/`
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Journal d'humeur</title>
            <script src="https://unpkg.com/htmx.org@2.0.4" crossorigin="anonymous"></script>
            <link rel="stylesheet" href="/styles.css" />
        </head>

        <body>
            <header class="header">
                <h1 class="header-title">Journal d'humeur</h1>
            </header>

            <main class="main">
                <div class="div-form">
                    <h2 class="div-form-title">Quelle est ton humeur aujourd'hui ?</h2>
                    <form 
                        hx-post="/moods" 
                        hx-target="#moods-list" 
                        hx-swap="beforeend"
                        class="form"
                    >
                        <div class="div-inside-form">
                            <label for="date" class="form-label">Entrez une date :</label>
                            <input class="form-input" type="text" id="date" name="date" placeholder="JJ-MM-AAAA" required />
                        </div>

                        <div class="div-inside-form">
                            <label for="mood" class="form-label">Entrez votre humeur du jour :</label>
                            <input class="form-input" type="text" id="mood" name="mood" placeholder="Cliquez sur un emoji" readonly />
                            <button 
                                type="button" 
                                id="clear-mood"
                                hx-on:click="document.getElementById('mood').value = ''"
                            >Supprimer ❌</button> <!-- Bouton pour vider l'input des emojis -->

                            <div id="emoji-picker-board">
                                ${emojiHTML} <!-- Émojis chargés directement -->
                            </div>
                        </div>

                        <div class="div-inside-form">
                            <label for="comment" class="form-label">Commentaire (optionnel) :</label>
                            <textarea class="form-textarea" name="comment" id="comment" rows="5" cols="50"></textarea>
                        </div>

                        <div class="div-btn">
                            <button type="submit" class="form-btn">Ajouter mon humeur</button>
                        </div>
                    </form>
                </div>

                <div class="moods">
                    <h2 class="moods-title">Historique des humeurs</h2>
                    <ul id="moods-list" hx-get="/moods" hx-trigger="load" hx-swap="innerHTML"></ul>
                </div>
            </main>

            <script>
                document.addEventListener("click", function (event) {
                    if (event.target.classList.contains("emoji")) {
                        document.getElementById("mood").value += event.target.dataset.value;
                    }
                });
            </script>
        </body>
    </html>
`;

export default createHomepage;