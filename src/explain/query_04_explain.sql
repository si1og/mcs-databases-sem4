-- План выполнения запроса 4 для импорта в Dalibo Explain.
-- После запуска скопируйте JSON из результата EXPLAIN на https://explain.dalibo.com/.

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
-- Посчитать число начертаний с одинаковым числом символов; результат
-- используется для построения двумерной гистограммы.

SELECT
  symbol_count,
  COUNT(*) AS typeface_count
FROM (
  SELECT
    t.id_typeface,
    COUNT(s.id_symbol) AS symbol_count
  FROM Typeface t
  -- подбираем символы начертания (сохраняем начертания без символов)
  LEFT JOIN Symbol s ON s.id_typeface = t.id_typeface
  GROUP BY t.id_typeface
) typeface_symbol_counts
GROUP BY symbol_count
ORDER BY symbol_count;
