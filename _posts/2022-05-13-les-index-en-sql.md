---
layout: post
title:  "Les index en SQL"
description: "Qu'est-ce qu'un index dans une base de donnée ?"
seo_description: "Index SQL BDD"
difficulty: 1
status: draft
---

En tant que dévoloppeur il faut savoir comment indexer ses données pour optimiser son SGBD (système de gestion de base de données).

### Qu'est ce qu'un index et comment ça fonctionne ?

Un index permet à la BDD de retrouver plus facilement des données.

Un index c'est une copie triée des données. Cette copie est automatiquement mise à jour par le SGBD. Quand on modifie une donnée, le SGBD va faire en sorte qu'on ait les mêmes données dans notre table que dans notre index.

Par défaut on crée un Index B-Tree


```sql
SELECT * FROM orders WHERE customer_id = 3
```

Sans index, cette requête va passser sur toutes les lignes.

En créant un index on crée un nœud-feuille et des nœud-branche et un nœud-racine. En gros c'est une liste bien rangée avec pour chaque donnée, le customer_id et l'adresse physique de la donnée. (faire un graphique pour qu'on comprenne)

Ce qui est important c'est que les noeuds sont triés. Une fois qu'on a trouvé le bon customer_id, on sait qu'il y'en a pas d'autres d'ailleurs. On est pas obligés de parcourir toutes les données comme lors de notre première requête.

Quand on refait le requête on voit qu'elle est plus rapide.


### Pourquoi utiliser un index ?


### Index concaténé

Index concaténé: C'est un index qui va pas être sur une colonne mais sur plusieurs colonnes. On va avoir 3 colonnes, 2 des index et un qui correspond à l'adresse mémoire.

```sql
SELECT * FROM orders WHERE customer_id = 3 AND created_at = '2020-10-27'
```

### Les index peuvent être lents

Parfois il peut être plus rapide de ne pas utiliser l'index.

Quand la table est petite ou que la requête renvoie la majorité de la table.

### Modification des données

Le SGBD doit tout le temps mettre à jour l'index.
L'index va améliorer les performances des SELECT mais détériorer les performances des INSERT, UPDATE et DELETE.

Dans l'INSERT, ça ne sert à rien et il faudra créer l'index. Pour l'UPDATE, l'index peut aider à trouver la donnée mais on va perdre du temps sur la mise à jour. Pour le DELETE l'index peut aider à trouver la ligne mais on va perdre du temps sur la supressions car il faut aussi supprimer l'index.

Donc il ne faut pas *surindexer*



Si vous voulez en savoir plus sur les index je vous conseille [cette vidéo](https://www.youtube.com/watch?v=bo5j9xgiF48&t=15s&ab_channel=DevoxxFR)


Un [livre](https://www.amazon.de/gp/product/3950307826/) pour aller plus loin.
