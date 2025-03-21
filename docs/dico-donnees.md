# Dictionnaire de données

## Moods (`moods`)

|Champ|Type|Spécificités|Description|
|-|-|-|-|
|id|INTEGER|PRIMARY KEY, NOT NULL, AUTO_INCREMENT |Unique id|
|date|VARCHAR(10)| NOT NULL, UNIQUE| Date format DD-MM-YYYY|
|mood|VARCHAR(50)|NOT NULL|Chosen mood (ex: 😊, 😡, 😢)|
|comment|TEXT| NULL| Optional comment|
