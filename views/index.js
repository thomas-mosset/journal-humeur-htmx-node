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
                <nav class="nav">
                    <ul class="nav-list">
                        <li class="nav-list-element">
                            <a href="/" class="nav-list-element-link">
                                Ajouter une humeur ➕
                            </a>
                        </li>
                        <li class="nav-list-element">
                            <a href="/moods/chart" class="nav-list-element-link">
                                Accéder au graphique d'humeurs 📊
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>

            <main class="main">
                <!-- DIV FOR ERROR MODAL -->
                <div id="error-modal" class="modal" style="display: none;">
                    <div class="modal-content">
                        <span class="close-btn" onclick="closeModal()">&times;</span>
                        <p id="error-message"></p>
                    </div>
                </div>

                <!-- DIV FOR EDIT MODAL -->
                <div id="edit-modal" class="modal" style="display: none;">
                    <div id="edit-modal-content" class="modal-content"></div>
                </div>

                <!-- DIV FOR ADD FORM -->
                <div class="div-form">
                    <h2 class="div-form-title">Quelle est ton humeur aujourd'hui ?</h2>
                    <form 
                        hx-post="/moods" 
                        hx-target="#moods-list" 
                        hx-swap="beforeend"
                        hx-on="before-request: document.querySelector('.form-err').innerHTML = ''"
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
                            >Supprimer ❌</button> <!-- BTN TO EMPTY EMOJIS INPUT  -->

                            <div id="emoji-picker-board">
                                ${emojiHTML} <!-- EMOJIS CHARGED HERE DIRECTLY -->
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
                /* EMOJI */
                document.addEventListener("click", function (event) {
                    if (event.target.classList.contains("emoji")) {
                        // Check if modal is opened
                        const editModal = document.getElementById("edit-modal");
                        const isModalOpen = editModal.style.display === "block"; 

                        if (isModalOpen) {
                            // Add emoji to edit modal emoji input
                            const moodModalInput = document.getElementById("mood-modal");
                            if (moodModalInput) {
                                moodModalInput.value += event.target.dataset.value;
                            }
                        } else {
                            // Add emoji to the regular add form emoji input
                            const moodInput = document.getElementById("mood");
                            if (moodInput) {
                                moodInput.value += event.target.dataset.value;
                            }
                        }
                    }
                });

        
                /* ERROR MODAL */
                // Open modal with error message
                function openModal(errorMessage) {
                    document.getElementById("error-message").innerText = errorMessage; // Put message in the modal
                    document.getElementById("error-modal").style.display = "block"; // Show modal
                }

                // Close modal
                function closeModal() {
                    document.getElementById("error-modal").style.display = "none"; // Hide le modal
                }

                // Listen to HTMX event to catch errors
                document.body.addEventListener('htmx:responseError', function (event) {
                    // If error event happens, open modal
                    openModal(event.detail.xhr.responseText); // Show error message in modal
                });


                // EDIT MODAL
                function openEditModal() {
                    document.getElementById("edit-modal").style.display = "block";
                }

                function closeEditModal() {
                    document.getElementById("edit-modal").style.display = "none";
                }

                // Fermer la modale si on clique à l'extérieur
                window.addEventListener("click", function (event) {
                    if (event.target === document.getElementById("edit-modal")) {
                        closeEditModal();
                    }
                });
            </script>
        </body>
    </html>
`;

export default createHomepage;