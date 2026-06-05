-- Найти языки, в которых отсутствует насыщенность A.

SELECT l.id_language, l.name
FROM Language l
WHERE NOT EXISTS (
  SELECT 1
  FROM Symbol s
  JOIN Typeface t ON t.id_typeface = s.id_typeface
  JOIN Weight w ON w.id_weight = t.id_weight
  WHERE s.id_language = l.id_language
    AND w.name = 'Thin' -- насыщенность A
)
ORDER BY l.id_language;
