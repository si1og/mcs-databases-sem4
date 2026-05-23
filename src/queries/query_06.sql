-- Найти языки, в которых отсутствует насыщенность A.

WITH params AS (
  SELECT 'Thin'::text AS weight_name
)
SELECT l.id_language, l.name
FROM Language l
WHERE NOT EXISTS (
  SELECT 1
  FROM Symbol s
  JOIN Typeface t ON t.id_typeface = s.id_typeface
  JOIN Weight w ON w.id_weight = t.id_weight
  JOIN params p ON p.weight_name = w.name
  WHERE s.id_language = l.id_language
)
ORDER BY l.id_language;
