---
layout: post
title:  "Les index en SQL"
description: "Qu'est-ce qu'un index dans une base de donnée ?"
seo_description: "Index SQL BDD"
difficulty: 1
status: draft
---

En tant que dévoloppeur web, il faut savoir indexer ses données pour optimiser son SGBD (système de gestion de base de données).

### Qu'est ce qu'un index ?

Un index permet à la BDD de retrouver plus facilement des données.

### Pourquoi utiliser un index ?

```sql
SELECT * FROM orders WHERE customer_id = 3
```

Sans index, cette requête va devoir passser sur tous les *orders* pour trouver ceux qui ont un *customer_id* égale à `3`.

### Comment ça fonctionne ?

```sql
CREATE INDEX index_on_customer_id ON orders (customer_id)
```

Un index c'est une **copie triée des données**. Cette copie est automatiquement mise à jour par le SGBD lors d'une mise à jour, création ou destruction de données. Donc Quand on modifie une donnée, le SGBD va faire en sorte qu'on ait les mêmes données dans notre table que dans la copie des données.

En gros c'est une liste bien rangée avec pour chaque donnée, le customer_id et l'adresse physique de la donnée. (faire un graphique pour qu'on comprenne).

Cette liste est découpés en plusieurs noeuds qui sont triés et qui fait qu'une fois qu'on a trouvé le bon customer_id, on sait qu'il y'en a pas d'autres d'ailleurs. On est pas obligés de parcourir toutes les données comme lors de notre première requête.


Quand on refait le requête ci-dessous, elle sera plus rapide.

```sql
SELECT * FROM orders WHERE customer_id = 3
```

Elle sera plus rapide car elle va d'abord aller lire `index_on_customer_id` (sans rentrer dans les détails elle ne va pas parcourir toutes les lignes) et récupérer les pointeurs qui correspondent à l'adresse mémoire des `orders`.

| customer_id | pointeur |
|-------------|----------|
|     1       | #3cf678a |
|     2       | #678a3cf |
|     3       | #96ab761 |
|     3       | #24fe612 |

### Index concaténé

On peut aussi créer un index sur plusieurs champs (ou colonnes) que l'on appelle index concaténé

```sql
CREATE INDEX index_on_customer_id_and_created_at ON orders (customer_id, created_at)
```

Il pourra être utiliser sur cet type de requête.

```sql
SELECT * FROM orders WHERE customer_id = 3 AND created_at = '2020-10-27'
```

### Les index peuvent être lents

Parfois il peut être plus rapide de ne pas utiliser les index. Par exemple quand la table est petite ou que la requête renvoie la majorité de la table.

Mais pas de panique, le *query planner* de votre SGBD va lui-même choisir s'il est plus rapide de requêter directement la table au lieu de d'abord passer par l'index.

Ce qui est aussi coûteux en temps c'est que le SGBD doit tout le temps mettre à jour l'index quand vous faites du `INSERT`, `UPDATE` ou `DELETE`.

Donc l'index va améliorer les performances des SELECT mais détériorer les performances des INSERT, UPDATE et DELETE.

Pour l'UPDATE, l'index peut aider à trouver la donnée mais on va perdre du temps sur la mise à jour. Pour le DELETE l'index peut aider à trouver la ligne mais on va perdre du temps sur la supressions car il faut aussi supprimer l'index.

Donc attention à ne pas *surindexer*

### Les index dans Rails

Lorsque vous créer une référence à une autre table, Rails va automatiquement créer un index.

Si vous souhaitez créer un index vous même il faudra générer une migration pour ajouter

```ruby
add_index :orders, :customer_id
```

### Pour aller plus loin

Si vous voulez en savoir plus sur les index, je vous recommande <a href="https://www.youtube.com/watch?v=bo5j9xgiF48&t=15s&ab_channel=DevoxxFR" class="underlined" target="_blank">cette vidéo</a> et ce <a href="https://www.amazon.de/gp/product/3950307826/" class="underlined" target="_blank">livre</a>.
