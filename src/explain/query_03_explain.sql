-- План выполнения запроса 3 для импорта в Dalibo Explain.
-- После запуска скопируйте JSON из результата EXPLAIN на https://explain.dalibo.com/.

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
-- Для каждого формата посчитать число начертаний и число символов алфавита;
-- результат используется для построения двумерной гистограммы.

SELECT
  f.id_format,
  f.name AS format_name,
  COUNT(DISTINCT t.id_typeface) AS typeface_count,
  COUNT(s.id_symbol) AS symbol_count
FROM Format f
-- подбираем начертания формата (сохраняем форматы без начертаний)
LEFT JOIN Typeface t ON t.id_format = f.id_format
-- подбираем символы начертания (сохраняем начертания без символов)
LEFT JOIN Symbol s ON s.id_typeface = t.id_typeface
GROUP BY f.id_format, f.name
ORDER BY f.id_format;
