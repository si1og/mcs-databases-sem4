-- Для начертания A и гарнитуры B поменять формат с C на D.

BEGIN;

WITH params AS (
  SELECT
    'Family 1 Thin'::text AS typeface_name,
    'Hurtful Providence 1'::text AS font_family_name,
    'TrueType'::text AS old_format_name,
    'OpenType'::text AS new_format_name
),
new_format AS (
  SELECT f.id_format
  FROM Format f
  JOIN params p ON p.new_format_name = f.name
)
UPDATE Typeface t
SET id_format = nf.id_format
FROM params p
JOIN Font_family ff ON ff.name = p.font_family_name
JOIN Format old_f ON old_f.name = p.old_format_name
CROSS JOIN new_format nf
WHERE t.name = p.typeface_name
  AND t.id_font_family = ff.id_font_family
  AND t.id_format = old_f.id_format
RETURNING t.id_typeface, t.name, t.id_format;

ROLLBACK;
