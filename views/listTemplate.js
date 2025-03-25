const createListTemplate = (moods) => /*html*/`
    ${moods.map((mood) => /*html*/`
        <li class="mood-list-item" id="mood-${mood.id}">
            <span>${mood.date} :</span> ${mood.mood}
            ${mood.comment ? `<span>${mood.comment}</span>` : ""}

            <div class="moods-btn">
                <button>Modifier ✏️</button>
                <button 
                    hx-delete="/moods/${mood.id}"
                    hx-target="#mood-${mood.id}"
                    hx-swap="delete"
                >Supprimer ❌</button>
            </div>
        </li>
    `).join("")}
`;

export default createListTemplate;