-- План выполнения запроса 6 для импорта в Dalibo Explain.
-- После запуска скопируйте JSON из результата EXPLAIN на https://explain.dalibo.com/.

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
-- Найти языки, в которых отсутствует насыщенность A.

SELECT l.id_language, l.name
FROM Language l
-- оставляем языки, для которых не найдено указанной насыщенности
WHERE NOT EXISTS (
  SELECT 1
  FROM Symbol s
  -- подбираем начертание, которому принадлежит символ
  JOIN Typeface t ON t.id_typeface = s.id_typeface
  -- подбираем насыщенность начертания
  JOIN Weight w ON w.id_weight = t.id_weight
  -- (проверяем символы текущего языка из запроса)
  WHERE s.id_language = l.id_language
    -- оставляем только насыщенность A
    AND w.name = 'Thin'
)
ORDER BY l.id_language;
