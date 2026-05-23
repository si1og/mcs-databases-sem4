-- Посчитать число языков, в которых присутствует формат A и которые относятся
-- к категории C.

WITH params AS (
  SELECT
    'TrueType'::text AS format_name,
    'Serif'::text AS category_name
)
SELECT COUNT(DISTINCT l.id_language) AS language_count
FROM Language l
JOIN Symbol s ON s.id_language = l.id_language
JOIN Typeface t ON t.id_typeface = s.id_typeface
JOIN Format f ON f.id_format = t.id_format
JOIN Font_family ff ON ff.id_font_family = t.id_font_family
JOIN Category c ON c.id_category = ff.id_category
JOIN params p
  ON p.format_name = f.name
 AND p.category_name = c.name;
