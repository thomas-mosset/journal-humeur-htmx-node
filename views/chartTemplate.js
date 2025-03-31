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
                <!-- passing data, from backend (moodArray), to frontend (script.js) to create the chart pie -->
                <div id="moodData" data-mood-array='${JSON.stringify(moodArray)}'></div>
            </main>

            <script src="/script.js"></script>
        </body>
`;

export default createChartTemplate;