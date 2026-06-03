CREATE TABLE IF NOT EXISTS color_groups (
    group_id INT PRIMARY KEY,
    group_name VARCHAR(255),
    group_colors INT
);

CREATE TABLE IF NOT EXISTS my_colors(
    color_id INT PRIMARY KEY,
    group_id INT REFERENCES color_groups(group_id) ON DELETE SET NULL ON UPDATE CASCADE,
    color_name VARCHAR(255),
    color_hex VARCHAR(7)
);

INSERT INTO color_groups (group_id, group_name, group_colors) VALUES (1, 'pink', 5);

SELECT group_id, group_name FROM color_groups
WHERE group_colors >= 1 AND group_name = 'pink';
