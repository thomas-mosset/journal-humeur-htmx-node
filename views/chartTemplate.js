const createChartTemplate = (moodArray) => /*html*/`
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Journal d'humeur</title>
            <script src="https://unpkg.com/htmx.org@2.0.4" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <link rel="stylesheet" href="/styles.css" />
        </head>

        <body>
            <header class="header">
                <h1 class="header-title">Journal d'humeur (Graphique)</h1>
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
                <canvas id="moodChart"></canvas>
            </main>

            <script>
                document.addEventListener("DOMContentLoaded", function () {
                    // Data received from the backend
                    const moodData = ${JSON.stringify(moodArray)};

                    // If no data from backend
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
                        const borderColors = labels.map(() => generateRandomColor());

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
            </script>
        </body>
`;

export default createChartTemplate;