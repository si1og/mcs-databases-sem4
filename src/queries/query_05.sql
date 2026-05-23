-- Найти символы с наибольшим и наименьшим числом поддерживающих гарнитур.

WITH symbol_family_counts AS (
  SELECT
    s.value,
    s.unicode_code,
    COUNT(DISTINCT ff.id_font_family) AS font_family_count
  FROM Symbol s
  JOIN Typeface t ON t.id_typeface = s.id_typeface
  JOIN Font_family ff ON ff.id_font_family = t.id_font_family
  GROUP BY s.value, s.unicode_code
),
limits AS (
  SELECT
    MAX(font_family_count) AS max_count,
    MIN(font_family_count) AS min_count
  FROM symbol_family_counts
),
selected AS (
  SELECT
    sfc.value,
    sfc.unicode_code,
    sfc.font_family_count,
    CASE
      WHEN sfc.font_family_count = l.max_count AND sfc.font_family_count = l.min_count THEN 'max/min'
      WHEN sfc.font_family_count = l.max_count THEN 'max'
      ELSE 'min'
    END AS bound_type,
    ROW_NUMBER() OVER (
      PARTITION BY sfc.font_family_count
      ORDER BY sfc.unicode_code
    ) AS row_number
  FROM symbol_family_counts sfc
  CROSS JOIN limits l
  WHERE sfc.font_family_count IN (l.max_count, l.min_count)
)
SELECT value, unicode_code, font_family_count, bound_type
FROM selected
WHERE row_number <= 10
ORDER BY font_family_count DESC, unicode_code;
