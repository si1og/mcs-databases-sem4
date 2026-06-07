-- План выполнения запроса 5 для импорта в Dalibo Explain.
-- После запуска скопируйте JSON из результата EXPLAIN на https://explain.dalibo.com/.

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
-- Найти категории с наибольшим числом гарнитур и наименьшим числом гарнитур.

SELECT name, category_count
FROM (
  SELECT
    c.name,
    COUNT(DISTINCT ff.id_font_family) AS category_count,
    MIN(COUNT(DISTINCT ff.id_font_family)) OVER () AS min_count,
    MAX(COUNT(DISTINCT ff.id_font_family)) OVER () AS max_count
  FROM Category c
  JOIN Font_family ff ON ff.id_category = c.id_category
  GROUP BY c.name
) symbol_family_counts
WHERE category_count IN (min_count, max_count)
ORDER BY category_count DESC;
