-- План выполнения запроса 2 для импорта в Dalibo Explain.
-- После запуска скопируйте JSON из результата EXPLAIN на https://explain.dalibo.com/.

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
-- Посчитать число языков, в которых присутствует формат A и которые относятся
-- к категории C.

SELECT COUNT(DISTINCT l.id_language) AS language_count
FROM Language l
-- подбираем символы, относящиеся к языку
JOIN Symbol s ON s.id_language = l.id_language
-- подбираем начертание, которому принадлежит символ
JOIN Typeface t ON t.id_typeface = s.id_typeface
-- подбираем формат начертания - A
JOIN Format f ON f.id_format = t.id_format
-- подбираем гарнитуру, к которой относится начертание
JOIN Font_family ff ON ff.id_font_family = t.id_font_family
-- подбираем категорию C гарнитуры
JOIN Category c ON c.id_category = ff.id_category
-- оставляем только формат A и категорию C
WHERE f.name = 'TrueType'
  AND c.name = 'Serif';
