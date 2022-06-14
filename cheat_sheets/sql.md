---
layout: cheat_sheet
title: Cheat Sheet SQL
permalink: /cheat_sheets/sql
---

Structure d'une requête (mais pas l'ordre d'exécution). Plus de détail <a href="https://wizardzines.com/zines/sql/" class="underlined" target="_blank">ici</a>.

```sql
SELECT *
FROM ...
JOIN ... ON ...
WHERE ... OR ... AND
GROUP BY ...
HAVING ...
ORDER BY ... DESC
LIMIT ...
```

`HAVING` c'est comme un `WHERE` mais pour les aggrégats.

Window Functions

```sql
SELECT
    orders.id,
    orders.ordered_at,
    orders.customer_id,
    SUM(orders.amount) OVER (
        PARTITION BY orders.customer_id
        ORDER BY orders.ordered_at
    ) AS cumulative_amount
FROM orders
```

`PARTITION BY` c'est le `GROUP BY` des Window Functions

WITH Clause. Cela crée une table virtuelle.

```sql
WITH matches_per_month AS (
    SELECT
        STRFTIME('%Y-%m', DATE(matches.date)) AS period,
        COUNT(*) AS cnt
    FROM "Match" AS matches
    GROUP BY period
    ORDER BY period
)
SELECT
    matches_per_month.period,
    SUM(matches_per_month.cnt) OVER (
        ORDER BY matches_per_month.period
    ) AS cumulative_count
FROM matches_per_month
```

`GROUP BY` c'est que pour les aggrégateurs de type `SUM`, `COUNT`, `AVG` etc.
