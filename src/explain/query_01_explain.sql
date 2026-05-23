-- План выполнения запроса 1 для импорта в Dalibo Explain.
-- После запуска скопируйте JSON из результата EXPLAIN на https://explain.dalibo.com/.

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
-- Найти начертания, относящиеся к категории A, у которых присутствует символ B
-- начертания C.

SELECT DISTINCT t.id_typeface, t.name
FROM Typeface t
-- подбираем гарнитуру, к которой относится начертание
JOIN Font_family ff ON ff.id_font_family = t.id_font_family
-- подбираем категорию гарнитуры
JOIN Category c ON c.id_category = ff.id_category
-- подбираем символы, присутствующие в текущем начертании
JOIN Symbol s ON s.id_typeface = t.id_typeface
-- подбираем тот же символ у начертания C
JOIN Symbol source_s
  ON source_s.value = s.value
 AND source_s.id_language = s.id_language
JOIN Typeface source_t ON source_t.id_typeface = source_s.id_typeface
-- оставляем категорию A, символ B и начертание C
WHERE c.name = 'Serif'
  AND source_s.value = U&'\0100'
  AND source_t.name = 'Family 1 Thin'
ORDER BY t.id_typeface;
