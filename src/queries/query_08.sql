-- Для каждой категории и каждого языка посчитать число символов для первых
-- десяти языков; результат используется для построения двумерной гистограммы.

WITH first_languages AS (
  SELECT id_language, name
  FROM Language
  ORDER BY id_language
  LIMIT 10
)
SELECT
  c.id_category,
  c.name AS category_name,
  l.id_language,
  l.name AS language_name,
  COUNT(s.id_symbol) AS symbol_count
FROM Category c
CROSS JOIN first_languages l
LEFT JOIN Font_family ff ON ff.id_category = c.id_category
LEFT JOIN Typeface t ON t.id_font_family = ff.id_font_family
LEFT JOIN Symbol s
  ON s.id_typeface = t.id_typeface
 AND s.id_language = l.id_language
GROUP BY c.id_category, c.name, l.id_language, l.name
ORDER BY c.id_category, l.id_language;
