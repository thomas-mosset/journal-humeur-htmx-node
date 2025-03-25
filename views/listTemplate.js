const createListTemplate = (moods) => /*html*/`
    ${moods.map((mood) => `
        <li class="mood-list-item">
            <strong>${mood.date}</strong> : ${mood.mood} <br>
            ${mood.comment ? `<em>${mood.comment}</em>` : ""}
        </li>
    `).join("")}
`;

export default createListTemplate;