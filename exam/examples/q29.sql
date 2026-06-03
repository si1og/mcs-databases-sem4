CREATE TABLE IF NOT EXISTS color_groups (
    group_id INT PRIMARY KEY,
    group_name VARCHAR(255)
)

CREATE TABLE IF NOT EXISTS my_colors(
    color_id INT PRIMARY KEY,
    -- или NO ACTION / SET NULL / SET DEFAULT
    group_id INT REFERENCES color_groups(group_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    color_name VARCHAR(255),
    color_hex VARCHAR(7),
    CONSTRAINT ft_color_hex UNIQUE(color_hex)
);
