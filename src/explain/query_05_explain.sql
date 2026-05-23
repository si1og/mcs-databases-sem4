-- План выполнения запроса 5 для импорта в Dalibo Explain.
-- После запуска скопируйте JSON из результата EXPLAIN на https://explain.dalibo.com/.

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
-- Найти символы с наибольшим и наименьшим числом поддерживающих гарнитур.

SELECT value, unicode_code, font_family_count
FROM (
  SELECT
    s.value,
    s.unicode_code,
    COUNT(DISTINCT ff.id_font_family) AS font_family_count,
    MIN(COUNT(DISTINCT ff.id_font_family)) OVER () AS min_count,
    MAX(COUNT(DISTINCT ff.id_font_family)) OVER () AS max_count
  FROM Symbol s
  -- подбираем начертание, которому принадлежит символ
  JOIN Typeface t ON t.id_typeface = s.id_typeface
  -- подбираем гарнитуру, к которой относится начертание
  JOIN Font_family ff ON ff.id_font_family = t.id_font_family
  GROUP BY s.value, s.unicode_code
) symbol_family_counts
-- оставляем только символы с максимальным или минимальным числом гарнитур
WHERE font_family_count IN (min_count, max_count)
ORDER BY font_family_count DESC, unicode_code;
