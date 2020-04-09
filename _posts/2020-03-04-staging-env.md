---
layout: post
title:  "Créer un pipeline sur Heroku"
description: "Dans ce tuto nous allons apprendre comment configurer un environnement de staging."
status: tech
---

Lorsque vous développez de nouvelles features, vous souhaitez souvent partager un lien avec votre client pour les lui présenter. Malheureusement il n'a pas accès à votre *localhost*. Il est possible avec Heroku de créer deux applications reliées entre elles, une de **staging** et une de **production**.

### Première étape: Ajouter un remote

Supposons que vous ayez déjà une application Ruby on Rails sur Heroku. Nous allons tout d'abord créer un pipeline et y mettre l'application en **production** et en créer une qui sera le **staging**.

<img src="/images/posts/staging-env/new-pipeline.png" class="image" alt="New Pipeline">

Pour l'environnement de **production**, nous allons rechercher l'application déjà existante. Et pour l'environnement de **staging** créer une nouvelle application par exemple `airbnb_copycat_staging`.

<img src="/images/posts/staging-env/applications.png" class="image" alt="application">

Ensuite, nous allons faire pointer **heroku** dans notre terminal vers l'application de **staging**.

```
$ heroku git:remote -a airbnb-copycat-staging
```

### Seconde Étape: Setup de la nouvelle database

Ensuite, vous devez créer une base de donnée avec la commande :

```
$ heroku addons:create heroku-postgresql:hobby-dev
```

Dans le fichier `config/database.yml` ajouter le code suivant à la fin du fichier en remplaçant `airbnb-copycat-staging` par le nom de votre application. Pour le *username* et le *password*, vous pouvez gardez les mêmes valeurs que la **production**.

```
staging:
  <<: *default
  database: airbnb_copycat_staging
  username: airbnb_copycat
  password: <%= ENV['AIRBNB_COPYCAT_DATABASE_PASSWORD'] %>
```

### Trosième Étape: Webpacker

Si vous utilisez Webpacker il faudra ajouter ceci au fichier `config/webpacker.yml`. De préférence entre la ligne de test et la ligne de production.

```
staging:
  <<: *default
```

### Quatrième étape: Configuration de l'environnement

Pour finir on copie la configuration de l'environnement de production à celui de staging avec la commande:

```
$ cp config/environments/production.rb config/environments/staging.rb
```

Sur votre interface Heroku le bouton **Promote to production** vous permettra de basculer le staging en prod.

<img src="/images/posts/staging-env/promote-to-production.png" class="image" alt="Promote to production">
