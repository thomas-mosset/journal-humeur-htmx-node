const createListTemplate = (moods) => /*html*/`
    ${moods.map((mood) => /*html*/`
        <li class="mood-list-item">
            <span>${mood.date} :</span> ${mood.mood}
            ${mood.comment ? `<span>${mood.comment}</span>` : ""}

            <div class="moods-btn">
                <button>Modifier ✏️</button>
                <button>Supprimer ❌</button>
            </div>
        </li>
    `).join("")}
`;

export default createListTemplate;