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
            <header>
                <h1>Journal d'humeur</h1>
            </header>

            <main>
                <div class="form">
                    <h2>Quelle est ton humeur aujourd'hui ?</h2>
                    <form 
                        hx-post="/moods" 
                        hx-target="#moods-list" 
                        hx-swap="beforeend"
                    >
                        <div>
                            <label for="date">Entrez une date :</label>
                            <input type="text" id="date" name="date" required />
                        </div>

                        <div>
                            <label for="mood">Entrez votre humeur du jour :</label>
                            <input type="text" id="mood" name="mood" placeholder="Cliquez sur un emoji" readonly />

                            <div id="emoji-picker-board">
                                ${emojiHTML} <!-- Émojis chargés directement -->
                            </div>
                        </div>

                        <div>
                            <label for="comment">Commentaire :</label>
                            <textarea name="comment" id="comment"></textarea>
                        </div>

                        <div>
                            <button type="submit">Ajouter mon humeur</button>
                        </div>
                    </form>
                </div>

                <div class="moods">
                    <h2>Historique des humeurs</h2>
                    <ul id="moods-list"></ul>
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