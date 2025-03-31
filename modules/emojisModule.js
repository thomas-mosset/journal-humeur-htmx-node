const fetchEmojis = async (EMOJI_API_URL) => {
    try {
        const response = await fetch(EMOJI_API_URL);
        const emojis = await response.json();
        const relevantCategories = ["smileys-emotion", "people-body", "activities", "travel-places"];
        const filteredEmojis = emojis.filter(emoji => relevantCategories.includes(emoji.group));

        return filteredEmojis.map(emoji => `
            <button 
                class="emoji"
                type="button"
                data-value="${emoji.character}"
            >${emoji.character}</button>
        `).join("");
    } catch (error) {
        console.error("Erreur lors de la récupération des émojis :", error);
        return "<p>Impossible de charger les émojis.</p>";
    }
};

export default fetchEmojis;