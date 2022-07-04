---
layout: post
title:  "Les index en SQL"
description: "Qu'est-ce qu'un index dans une base de donnée ?"
seo_description: "Index SQL BDD"
difficulty: 1
status: tech
---

En tant que développeur web, il faut savoir quand indexer ses données pour optimiser son SGBD (système de gestion de base de données). Dans ce tuto, nous allons voir pourquoi et comment.

## Qu'est ce qu'un index ?

Un index permet au SGBD de retrouver des données dans une table sans la parcourir entièrement.

## Pourquoi utiliser un index ?


Nous avons ici une table *candidates*. Regardons combien elle a de données.

```sql
SELECT COUNT(*) FROM "candidates";
-- count
-------
-- 64074
-- (1 row)

-- Time: 12.340 ms
```

Elle a 64074 données. Ce qui est conséquent (du moins assez pour ce que nous voulons tester) et le résultat a été trouvé en 12 millisecondes(ms).

Maintenant si on veut retrouver un candidat avec l'email me@yahoo.com, notre requête va devoir passser sur tous les *candidates* pour trouver le bon email.

```sql
SELECT * FROM "candidates" WHERE "email" = 'me@yahoo.com';

--  id   |  email           | first_name | last_name
---------+------------------+------------+-----------+
-- 47252 | me@yahoo.com     | Alexandre  | Bouvier

-- (1 row)

-- Time: 17.677 ms
```

On voit que la requête met 17 ms pour retrouver l'information. On peut aller encore plus vite en ajoutant un index.

## Comment ça fonctionne ?

```sql
CREATE INDEX index_candidates_on_email ON candidates (email);
```

Cette commande va créer une copie triée des données. Cette copie est automatiquement mise à jour par le SGBD lorsque votre table *candidates* est modifiée. Par exemple si on modifie l'email d'un candidat, le SGBD va mettre à jour l'index pour qu'on ait les mêmes données dans la table *candidates* que dans la copie indexée des données.

En résumé, l'index est une liste bien rangée avec pour chaque donnée, l'*email* et l'adresse physique de la donnée dans la table *candidates*. .

Quand on refait la requête, elle sera beaucoup plus rapide. On passe de 17 ms à 1 ms soit 17 fois plus rapide!

```sql
SELECT * FROM "candidates" WHERE "email" = 'me@yahoo.com';

--  id   |  email           | first_name | last_name
---------+------------------+------------+-----------+
-- 47252 | me@yahoo.com     | Alexandre  | Bouvier

-- (1 row)

-- Time: 1.324 ms
```

Elle sera plus rapide car elle va d'abord aller lire la colonne  `index_candidates _on_email` et récupérer les pointeurs qui correspondent à l'adresse mémoire du candidat. Elle ne va pas parcourir toutes les lignes de la table *candidates* comme la première requête mais parcourir l'index.

L'index est découpée en plusieurs noeuds qui sont triés et qui fait qu'une fois qu'on a trouvé le bon *email*, on sait qu'il y'en a pas d'autres ailleurs. Surtout, on ne va pas parcourir toutes les données comme lors de notre première requête.

Il suffit de lire la première valeur des noeuds (l'index 0) pour trouver le bon noeud. Ici quand elle voit "damien@yahoo.fr" le SGBD va comprendre que la donnée se trouve dans le second noeud donc lire 2 fois moins de données.

```
| index | email          | pointeur |     | index | email             | pointeur |
|-------|----------------|----------|     |-------|-------------------|----------|
| 0     | alex@yahoo.fr  | #3cf678a |     | 0     | damien@yahoo.fr   | #a3678a3 |
| 1     | bruno@yahoo.fr | #678a3cf |     | 1     | éléonore@yahoo.fr | #96ab761 |
| 2     | cyril@yahoo.fr | #87ea764 |     | 2     | me@yahoo.fr       | #24fe612 |
```

## Index concaténé

On peut aussi créer un index sur plusieurs champs (ou colonnes) que l'on appelle index concaténé

```sql
CREATE INDEX index_on_email_and_created_at ON candidates (email, created_at);
```

Il pourra être utilisé sur ce type de requête.

```sql
SELECT * FROM "candidates" WHERE "email" = 'me@yahoo.com' AND "created_at" = '2020-10-27';
```

## Les index peuvent être lents

Parfois il peut être plus rapide de ne pas utiliser les index. Par exemple quand la table est petite ou que la requête renvoie la majorité de la table.

Mais pas de panique, le *query planner* de votre SGBD va lui-même choisir s'il est plus rapide de requêter directement la table (seq scan) ou d'abord passer par l'index.

Ce qui est aussi coûteux, c'est que le SGBD doit tout le temps mettre à jour l'index pour du *INSERT*, *UPDATE* ou *DELETE*.

Donc l'index va améliorer les performances des **SELECT** mais détériorer les performances des *INSERT*,*UPDATE* et *DELETE*.

Pour l'*UPDATE*, l'index peut aider à trouver la donnée mais on va perdre du temps sur la mise à jour. Pour le *DELETE* l'index peut aider à trouver la ligne mais on va perdre du temps sur la supressions car il faut aussi supprimer l'index.

Donc attention à ne pas surindexer.

## Les index dans Ruby on Rails

Lorsque vous créez une référence à une autre table, Rails va automatiquement créer un index.

Mais si vous souhaitez créer un index pour une colonne qui n'est pas une *foreign key*, il faudra générer une migration.

```ruby
class AddIndexForEmailToCandidates < ActiveRecord::Migration[5.2]
  def change
    add_index :candidates, :email
  end
end
```

## Pour aller plus loin

Si vous voulez en savoir plus sur les index, je vous recommande <a href="https://www.youtube.com/watch?v=bo5j9xgiF48&t=15s&ab_channel=DevoxxFR" class="underlined" target="_blank">cette vidéo</a> et ce <a href="https://www.amazon.de/gp/product/3950307826/" class="underlined" target="_blank">livre</a>.
