-- Для каждого формата посчитать число начертаний и число символов алфавита;
-- результат используется для построения двумерной гистограммы.

SELECT
  f.id_format,
  f.name AS format_name,
  COUNT(DISTINCT t.id_typeface) AS typeface_count,
  COUNT(s.id_symbol) AS symbol_count
FROM Format f
LEFT JOIN Typeface t ON t.id_format = f.id_format
LEFT JOIN Symbol s ON s.id_typeface = t.id_typeface
GROUP BY f.id_format, f.name
ORDER BY f.id_format;
