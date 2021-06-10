---
layout: post
title:  "Créer un environnement de staging et l'intégrer dans un pipeline Heroku"
description: "Dans ce tuto nous allons apprendre comment configurer un environnement de staging."
status: tech
tags: "heroku"
---

Lorsque vous développez de nouvelles features, vous souhaitez avoir un faux site pour les tester. On appelle ça un **staging** ou une **preprod**. Nous allons voir comment créer sur Heroku un environnement de **staging** pour héberger notre faux site et comment la relier avec notre **production**.

Tout d'abord nous allons renomer notre remote **heroku** en **production**.

```sh
$ git remote rename heroku production
```

### Ajouter un remote

Supposons que vous ayez déjà une application Ruby on Rails sur Heroku. Nous allons tout d'abord créer un pipeline et y mettre l'application en **production** et en créer une qui sera le **staging**.

<img src="/images/posts/staging-env/new-pipeline.png" class="image" alt="New Pipeline">

Pour l'environnement de **production**, nous allons rechercher l'application déjà existante. Et pour l'environnement de **staging** créer une nouvelle application par exemple `airbnb_copycat_staging`.

<img src="/images/posts/staging-env/applications.png" class="image" alt="application">

Ensuite, nous allons faire pointer une remote **staging** dans notre terminal vers l'application Heroku **airbnb_copycat_staging**.

```sh
$ heroku git:remote -a airbnb-copycat-staging
$ git remote rename heroku staging
```

Désormais pour toute vos commandes `heroku` il faudra ajouter le suffixe `--remote production` ou `--remote staging`. Par exemple:

```sh
# Accéder à la console de la prod
heroku run rails console --remote production
heroku run rails console -r production
# Accéder à la console du staging
heroku run rails console --remote staging
heroku run rails console -r staging
```

### Setup de la nouvelle database

Ensuite, vous devez créer une base de donnée avec la commande :

```
$ heroku addons:create heroku-postgresql:hobby-dev --remote staging
```

Ajoutez le code dans `config/database.yml` en remplaçant `airbnb-copycat-staging` par le nom de votre application. Pour le *username* et le *password*, vous pouvez gardez les mêmes valeurs que la **production**.

```
staging:
  <<: *default
  database: airbnb_copycat_staging
  username: airbnb_copycat
  password: <%= ENV['AIRBNB_COPYCAT_DATABASE_PASSWORD'] %>
```

### Webpacker

Si vous utilisez Webpacker il faudra ajouter ceci au fichier `config/webpacker.yml`. De préférence entre la ligne de test et la ligne de production.

```
staging:
  <<: *default
```

### Configuration de l'environnement

Pour finir on copie la configuration de l'environnement de production à celui de staging avec la commande:

```
$ cp config/environments/production.rb config/environments/staging.rb
```

Sur votre interface Heroku le bouton **Promote to production** vous permettra de basculer le staging en prod.

<img src="/images/posts/staging-env/promote-to-production.png" class="image" alt="Promote to production">

### Protéger l'accès à l'environnement de staging

```ruby
# app/controllers/application_controller.rb

class ApplicationController < ActionController::Base
  http_basic_authenticate_with name: ENV["STAGING_LOGIN"], password: ENV["STAGING_PASSWORD"] if Rails.env.staging?
end
```

Ajoutez dans votre fichier `.env` vos logins et mots de passe (n'oubliez pas de les ajouter aussi sur Heroku)

```sh
# .env

STAGING_LOGIN="login"
STAGING_PASSWORD="password"
```

### Seed

C'est une bonne pratique de protéger la base de données de production si vous lancez vos seeds par inadvertance sur la `production` au lieu du `staging`.

```ruby
# db/seeds.rb

return if Rails.env.production?
```

### Automatic deploy

Pour gagner du temps en déploiement, vous pouvez lier l'application Heroku au repo Github et déployer de manière automatique la branche master sur le staging.

<img src="/images/posts/staging-env/automatic-deploy.gif" class="image" alt="Déploiement automatique">
