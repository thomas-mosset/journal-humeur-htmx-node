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

/*****************************************************************/

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

/*****************************************************************/

/* EDIT MODAL */
function openEditModal() {
    document.getElementById("edit-modal").style.display = "block";
}

function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
}

// Close modal if we click outside of it
window.addEventListener("click", function (event) {
    if (event.target === document.getElementById("edit-modal")) {
        closeEditModal();
    }
});

/*****************************************************************/

/* EXPORTS */
function exportToJSON() {
    window.location.href = "/moods/export-json";  // Download the JSON file
}

function exportToCSV() {
    window.location.href = "/moods/export-csv";  // Download the CSV file
}

/*****************************************************************/

/* CHART PIE */
document.addEventListener("DOMContentLoaded", function () {
    // Data received from the HTML
    const moodDataElement = document.getElementById("moodData");
    const moodData = JSON.parse(moodDataElement.getAttribute("data-mood-array"));

    // If no data
    if (!moodData || moodData.length === 0) {
        document.getElementById("moodChart").style.display = "none"; 
        document.body.insertAdjacentHTML("beforeend", "<p class='text-no-data'>Aucune donnée disponible.</p>");
    
    // if there is data, show the pie chart
    } else {
        // Extract emojis et count
        const labels = moodData.map(item => item.mood);
        const counts = moodData.map(item => item.count);

        // Generate random color for each mood
        function generateRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        const backgroundColors = labels.map(() => generateRandomColor());

        // Create graph / chart
        const context = document.getElementById('moodChart').getContext('2d');
        new Chart(context, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: "Nombre de fois",
                    data: counts,
                    backgroundColor: backgroundColors,
                    borderColor: "black",
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                scale: {
                    y: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: "Répartition des humeurs",
                    }
                }
            }
        });
    }
});