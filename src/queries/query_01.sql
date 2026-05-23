-- Найти начертания, относящиеся к категории A, у которых присутствует символ B
-- начертания C.

WITH params AS (
  SELECT
    'Serif'::text AS category_name,
    U&'\0100'::text AS symbol_value,
    'Family 1 Thin'::text AS source_typeface_name
),
source_symbols AS (
  SELECT DISTINCT s.value, s.id_language
  FROM Symbol s
  JOIN Typeface t ON t.id_typeface = s.id_typeface
  JOIN params p ON p.source_typeface_name = t.name
  WHERE s.value = p.symbol_value
)
SELECT DISTINCT t.id_typeface, t.name
FROM Typeface t
JOIN Font_family ff ON ff.id_font_family = t.id_font_family
JOIN Category c ON c.id_category = ff.id_category
JOIN Symbol s ON s.id_typeface = t.id_typeface
JOIN source_symbols ss
  ON ss.value = s.value
 AND ss.id_language = s.id_language
JOIN params p ON p.category_name = c.name
ORDER BY t.id_typeface;
