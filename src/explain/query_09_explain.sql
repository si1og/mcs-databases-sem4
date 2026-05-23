-- План выполнения запроса 9 для импорта в Dalibo Explain.
-- После запуска скопируйте JSON из результата EXPLAIN на https://explain.dalibo.com/.

BEGIN;
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
-- Для начертания A и гарнитуры B поменять формат с C на D.


UPDATE Typeface t
SET id_format = new_f.id_format
FROM Font_family ff, Format old_f, Format new_f
-- подбираем гарнитуру, старый формат и новый формат
WHERE ff.id_font_family = t.id_font_family
  AND old_f.id_format = t.id_format
  -- оставляем начертание A, гарнитуру B и старый формат C
  AND t.name = 'Family 1 Thin'
  AND ff.name = 'Striking Horde 1'
  AND old_f.name = 'TrueType'
  -- меняем формат на D
  AND new_f.name = 'OpenType'
RETURNING
  t.id_typeface,
  t.name AS typeface_name,
  ff.name AS font_family_name,
  old_f.name AS old_format_name,
  new_f.name AS new_format_name,
  'updated' AS status;
ROLLBACK;
