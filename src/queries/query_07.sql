-- Найти форматы, в которых больше начертаний, чем в формате A.

WITH params AS (
  SELECT 'TrueType'::text AS format_name
),
format_typeface_counts AS (
  SELECT
    f.id_format,
    f.name,
    COUNT(t.id_typeface) AS typeface_count
  FROM Format f
  LEFT JOIN Typeface t ON t.id_format = f.id_format
  GROUP BY f.id_format, f.name
),
base_format AS (
  SELECT ftc.typeface_count
  FROM format_typeface_counts ftc
  JOIN params p ON p.format_name = ftc.name
)
SELECT ftc.id_format, ftc.name, ftc.typeface_count
FROM format_typeface_counts ftc
CROSS JOIN base_format bf
WHERE ftc.typeface_count > bf.typeface_count
ORDER BY ftc.typeface_count DESC, ftc.id_format;
