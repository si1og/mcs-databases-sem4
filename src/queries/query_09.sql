-- Для начертания A и гарнитуры B поменять формат с C на D.

BEGIN;

WITH params AS (
  SELECT
    'Family 1 Thin'::text AS typeface_name,
    'Striking Horde 1'::text AS font_family_name,
    'TrueType'::text AS old_format_name,
    'OpenType'::text AS new_format_name
),
new_format AS (
  SELECT f.id_format
  FROM Format f
  JOIN params p ON p.new_format_name = f.name
),
target_typefaces AS (
  SELECT
    t.id_typeface,
    t.name AS typeface_name,
    ff.name AS font_family_name,
    old_f.name AS old_format_name
  FROM Typeface t
  JOIN Font_family ff ON ff.id_font_family = t.id_font_family
  JOIN Format old_f ON old_f.id_format = t.id_format
  JOIN params p
    ON p.typeface_name = t.name
   AND p.font_family_name = ff.name
   AND p.old_format_name = old_f.name
),
updated_typefaces AS (
  UPDATE Typeface t
  SET id_format = nf.id_format
  FROM target_typefaces tt
  CROSS JOIN new_format nf
  WHERE t.id_typeface = tt.id_typeface
  RETURNING t.id_typeface, t.name, t.id_format
)
SELECT
  COALESCE(ut.id_typeface, tt.id_typeface) AS id_typeface,
  COALESCE(ut.name, p.typeface_name) AS typeface_name,
  p.font_family_name,
  tt.old_format_name,
  p.new_format_name,
  CASE
    WHEN ut.id_typeface IS NULL THEN 'not updated'
    ELSE 'updated'
  END AS status
FROM params p
LEFT JOIN target_typefaces tt ON true
LEFT JOIN updated_typefaces ut ON ut.id_typeface = tt.id_typeface
ORDER BY id_typeface;

ROLLBACK;
