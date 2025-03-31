const convertToCSV = (data) => {
    if (!data || data.length === 0) {
        return "Aucune donnée à exporter.";
    }

    // Extract headers (key of the 1rst object)
    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add the headers line
    csvRows.push(headers.join(','));

    // Add the rows of data
    data.forEach(row => {
        // Add formatted CSV line
        csvRows.push(headers.map(header => `"${row[header]}"`).join(','));
    });

    // return all the CSV as a string
    return csvRows.join('\n');
};

export default convertToCSV;