const createEditTemplate = (mood, emojiHTML) => /*html*/`
    <div class="edit-modal-container">
        <form hx-put="/moods/${mood.id}" hx-target="#mood-${mood.id}" hx-swap="outerHTML" class="edit-modal-form">
            
            <div class="div-inside-form div-inside-edit-form">
                <label for="date" class="form-label">Entrez une date :</label>
                <input class="form-input" type="text" id="date" name="date" placeholder="JJ-MM-AAAA" value="${mood.date}" required />
            </div>

            <div class="div-inside-form">
                <label for="mood" class="form-label">Entrez votre humeur du jour :</label>
                <input class="form-input" type="text" id="mood-modal" name="mood" placeholder="Cliquez sur un emoji" value="${mood.mood}" readonly />
                <button 
                    type="button" 
                    id="clear-mood"
                    hx-on:click="document.getElementById('mood-modal').value = ''"
                >Supprimer ❌</button> <!-- Bouton pour vider l'input des emojis -->

                <div id="emoji-picker-board">
                    ${emojiHTML} <!-- Émojis chargés directement -->
                </div>
            </div>

            <div class="div-inside-form">
                <label for="comment" class="form-label">Commentaire (optionnel) :</label>
                <textarea class="form-textarea" name="comment" id="comment" rows="5" cols="50">${mood.comment ? mood.comment : ""}</textarea>
                <!-- ${mood.comment ? mood.comment : ""} affiche le commentaire s'il existe, s'il n'y en a pas (et donc renseigné comme null en bdd), on n'affiche rien -->
            </div>

            <div class="div-btn">
                <button type="submit" class="form-btn" onclick="closeEditModal()">Confirmer la modification de mon humeur</button>
            </div>
        </form>

        <button id="close-modal" onclick="closeEditModal()">Fermer</button>
    </div>
`;

export default createEditTemplate;