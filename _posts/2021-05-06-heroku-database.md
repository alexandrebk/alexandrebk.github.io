---
layout: post
title:  "Changer de plan de BDD sur Heroku"
title:  "Heroku database"
description: "Dans ce tuto nous allons apprende à changer de plan de BDD sur Heroku"
seo_description: "Heroku BDD booby basic"
difficulty: 1
status: tech

---

Plus votre traffic grossit, plus vos données grossissent et Heroku va rapidement vous imposer de changer la taille de votre base de données si vous dépassez les 10 000 lignes. Malheuresement ce n'est pas si simple. C'est même assez complexe pour un service réputé pour sa simplicité. Je vais vous aider à résumer ce que nous dit la [documentation](https://devcenter.heroku.com/articles/upgrading-heroku-postgres-databases).

### S'assurer d'avoir les droits

Tout d'abord, il faut s'assurer d'être le *owner* de l'application.

<img src="/images/posts/heroku/ownership.png"
     class="image"
     alt="ownership">

### Créer la nouvelle base de données

Ensuite on va créer une nouvelle base de données sur Heroku. Ici, je vais choisir le plan `hobby-basic`. C'est un plan à 9$/mois. Pour connaître les autres plans, il suffit de se référer à la liste [ici](https://elements.heroku.com/addons/heroku-postgresql)

```sh
heroku addons:create heroku-postgresql:hobby-basic
```

Vérifions maintenant que la base de données a bien été créé.

```sh
heroku pg:info
```

<img src="/images/posts/heroku/pg-info.png"
     class="image"
     alt="pg info">

Il faut récupérer le nom de la base de données nouvellement créé. Dans notre cas c'est `HEROKU_POSTGRESQL_WHITE_URL`.

### Copie de la base de données

Nous allons maintenant copier le contenu de l'ancienne base de données sur la nouvelle. Afin d'éviter toute écriture pendant la copie, nous allons mettre l'application en maintenance.

```
heroku maintenance:on
```

Puis on lance la copie de la base de données.

```
heroku pg:copy DATABASE_URL HEROKU_POSTGRESQL_WHITE_URL
```

<img src="/images/posts/heroku/pg-copy.png"
     class="image"
     alt="pg copy">

Ensuite vous pouvez vérifier que les 2 bases de données ont bien le même nombre de lignes avec `heroku pg:info` en comparant les lignes `rows`.

On voit que désormais j'ai le droit à 10 000 000 de lignes sur `HEROKU_POSTGRESQL_WHITE_URL`

<img src="/images/posts/heroku/pg-info-lines.png"
     class="image"
     alt="pg copy">

### Activer la nouvelle base de données

Activons la nouvelle base de données sur la production.

```sh
heroku pg:promote HEROKU_POSTGRESQL_WHITE_URL
```

<img src="/images/posts/heroku/pg-promote.png"
     class="image"
     alt="pg promote">

Enfin on peut réactiver l'application

```sh
heroku maintenance:off
```
