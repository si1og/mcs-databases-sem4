-- Найти форматы, в которых больше начертаний, чем в формате A.

SELECT
  f.id_format,
  f.name,
  COUNT(t.id_typeface) AS typeface_count
FROM Format f
LEFT JOIN Typeface t ON t.id_format = f.id_format
GROUP BY f.id_format, f.name
-- оставляем форматы, где начертаний больше, чем в формате A
HAVING COUNT(t.id_typeface) > (
  SELECT COUNT(*)
  FROM Typeface base_t
  JOIN Format base_f ON base_f.id_format = base_t.id_format
  WHERE base_f.name = 'WOFF2' -- формат A
)
ORDER BY typeface_count DESC, f.id_format;
