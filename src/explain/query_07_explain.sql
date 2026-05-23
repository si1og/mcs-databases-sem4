-- План выполнения запроса 7 для импорта в Dalibo Explain.
-- После запуска скопируйте JSON из результата EXPLAIN на https://explain.dalibo.com/.

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
-- Найти форматы, в которых больше начертаний, чем в формате A.

SELECT
  f.id_format,
  f.name,
  COUNT(t.id_typeface) AS typeface_count
FROM Format f
-- подбираем начертания формата; LEFT JOIN сохраняет форматы без начертаний
LEFT JOIN Typeface t ON t.id_format = f.id_format
GROUP BY f.id_format, f.name
-- оставляем форматы, где начертаний больше, чем в формате A
HAVING COUNT(t.id_typeface) > (
  SELECT COUNT(*)
  FROM Typeface base_t
  JOIN Format base_f ON base_f.id_format = base_t.id_format
  WHERE base_f.name = 'WOFF2'
)
ORDER BY typeface_count DESC, f.id_format;
