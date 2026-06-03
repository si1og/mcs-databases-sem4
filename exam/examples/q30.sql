CREATE TABLE IF NOT EXISTS color_groups (
    group_id INT PRIMARY KEY,
    group_name VARCHAR(255)
)

CREATE TABLE IF NOT EXISTS my_colors(
    color_id INT PRIMARY KEY,
    -- наследует домен, можем записать только те значения, которые в color_groups
    group_id INT REFERENCES color_groups(group_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    color_name VARCHAR(255) UNIQUE NOT NULL,
    color_hex VARCHAR(7),
    CONSTRAINT unique_color_hex UNIQUE(color_hex),
    CONSTRAINT check_color_hex_not_null CHECK (color_hex IS NOT NULL),
    CONSTRAINT check_color_hex_valid CHECK (color_hex LIKE "#______")
);
