-- Посчитать число начертаний с одинаковым числом символов; результат
-- используется для построения двумерной гистограммы.

WITH typeface_symbol_counts AS (
  SELECT
    t.id_typeface,
    COUNT(s.id_symbol) AS symbol_count
  FROM Typeface t
  LEFT JOIN Symbol s ON s.id_typeface = t.id_typeface
  GROUP BY t.id_typeface
)
SELECT
  symbol_count,
  COUNT(*) AS typeface_count
FROM typeface_symbol_counts
GROUP BY symbol_count
ORDER BY symbol_count;
