---
layout: post
title:  "Jouez avec les dates"
description: "Dans ce tuto nous allons apprendre à vérifier que 2 dates ne se chevauchent pas."
difficulty: 1
status: draft
---

Dans ce tuto nous allons apprendre à zzzzz

Nous supposons qu'il y a un model `Flat` et qu'il y'a déjà une application Rails avec plusieurs modèles.

### Première étape

```ruby
today       = Date.today
yesterday   = Date.today - 1
a_week_ago  = Date.today - 7
a_month_ago = Date.today - 31
```

### Seconde Étape:

```ruby
(a_month_ago..yesterday).overlaps?(a_week_ago..today)
# => true
(a_month_ago..a_week_ago).overlaps?(yesterday..today)
# => false
```
### Troisième Étape:

Nous allons l'implémenter comme validation dans notre modèle de booking


