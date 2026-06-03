CREATE TABLE IF NOT EXISTS color_groups (
    group_id INT PRIMARY KEY,
    group_name VARCHAR(255)
)

CREATE TABLE IF NOT EXISTS my_colors(
    color_id INT PRIMARY KEY,
    group_id INT,
    color_name VARCHAR(255),
    color_hex VARCHAR(7),
    CONSTRAINT fk_another_color FOREIGN KEY (group_id) REFERENCES color_groups(group_id),
    CONSTRAINT fk_unique_name UNIQUE (color_name)
);
