-- Найти начертания, относящиеся к категории A, у которых присутствует символ B
-- начертания C.

SELECT DISTINCT t.id_typeface, t.name
FROM Typeface t
JOIN Font_family ff ON ff.id_font_family = t.id_font_family
JOIN Category c ON c.id_category = ff.id_category
JOIN Symbol s ON s.id_typeface = t.id_typeface
JOIN Symbol source_s
  ON source_s.value = s.value
 AND source_s.id_language = s.id_language
JOIN Typeface source_t ON source_t.id_typeface = source_s.id_typeface
WHERE c.name = 'Serif'
  AND source_s.value = U&'\0100'
  AND source_t.name = 'Family 1 Thin'
ORDER BY t.id_typeface;
