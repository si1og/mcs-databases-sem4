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
-- mySql
-- INSERT INTO color_groups SET group_id = 2, group_name = "red";

-- без where удалит всю таблицу
DELETE FROM color_groups WHERE group_id = 1;

DELETE FROM color_groups WHERE group_id = (
    SELECT group_id FROM color_groups WHERE group_name >= 1 ORDER BY group_name DESC LIMIT 1
)

-- Пары соединяются знаками >, <, <=, >=,
-- ! =
-- Конструируется по правилам логического выражения and,
-- or, !, ()
-- Также используются специальные синтаксические
-- конструкции
-- IN - WHERE названиеатрибута IN некотораятаблица
-- BETWEEN - WHERE названиеатрибута BETWEEN
-- границаслева AND граница_справа (обе границы
-- включительно)
-- LIKE - WHERE названиеатрибута LIKE
-- регулярноевыражение
-- IS [NOT] NULL - тут я думаю понятно
