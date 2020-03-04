---
layout: post
title:  "Créer un pipeline sur Heroku"
description: "Dans ce tuto nous allons apprendre comment configurer un environnement de staging."
status: tech
---

Lorsque vous développez de nouvelles features, vous souhaitez souvent partager un lien avec votre client pour les lui présenter. Malheureusement il n'a pas accès au *localhost*. Il est possible avec Heroku de simuler l'application sur un autre serveur. On appelle cela un environnement de *staging*.

### Première étape: Remote

Supposons que vous ayez déjà une application Rails sur Heroku. Il faudra créer un pipeline et y mettre vos applications de staging et production.

Tout d'abord on va faire pointer notre remote **heroku** vers la nouvelle application de staging

```
heroku git:remote -a APP_NAME
```

### Seconde Étape: Setup de la nouvelle database

Ensuite, vous devez créer une base de donnée avec la commande :

```
heroku addons:create heroku-postgresql:hobby-dev
```

Dans le fichier `config/database.yml` ajouter le code suivant à la fin du fichier en remplacant `APP_NAME` par le nom de votre app (le même que celui au début du fichier).

```
staging:
  <<: *default
  database: APP_NAME_staging
  username: APP_NAME
  password: <%= ENV['APP_NAME_DATABASE_PASSWORD'] %>
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
