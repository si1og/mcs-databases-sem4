CREATE TABLE IF NOT EXISTS color_groups (
    group_id INT PRIMARY KEY,
    group_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS my_colors(
    color_id INT PRIMARY KEY,
    group_id INT REFERENCES color_groups(group_id) ON DELETE SET NULL ON UPDATE CASCADE,
    color_name VARCHAR(255),
    color_hex VARCHAR(7)
);

INSERT INTO color_groups (group_id, group_name) VALUES (1, 'pink');

-- без WHERE обноаится всё
UPDATE color_groups SET group_name = 'blue' WHERE group_id = 1;
    