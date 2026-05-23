-- Для начертания A и гарнитуры B поменять формат с C на D.

BEGIN;

UPDATE Typeface t
SET id_format = new_f.id_format
FROM Font_family ff
JOIN Format new_f ON new_f.name = 'OpenType'
JOIN Format old_f ON old_f.name = 'TrueType'
WHERE ff.id_font_family = t.id_font_family
  AND old_f.id_format = t.id_format
  AND t.name = 'Family 1 Thin'
  AND ff.name = 'Striking Horde 1'
RETURNING
  t.id_typeface,
  t.name AS typeface_name,
  ff.name AS font_family_name,
  old_f.name AS old_format_name,
  new_f.name AS new_format_name,
  'updated' AS status;

COMMIT;
