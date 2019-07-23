---
layout: post
title:  "Créer un pipeline sur Heroku"
author: alexandre
status: draft
---

Lorsque vous développez de nouvelles features vous souhaitez souvent partager un url avec votre équipe de non-dév pour leurs montrer. Il est possible avec Heroku d'installer une app sur un autre serveur. On appelle cela un serveur de staging. 

### Première étape

Supposons que vous ayez déjà une application Rails sur Heroku. Il faudra créer un pipeline et mettre votre app de prod et de staging dessus.

Il faudra aussi installer l'adds-on Heroku PostGre sur votre nouvelle app et rediriger vos prochains `git push heroku master` sur l'app de staging au lieu de la prod. Un simple bouton `promote to production` vous permettra de basculer le staging en prod.

Tout d'abord on va faire pointer notre remote vers la nouvelle branche avec

```
heroku git:remote -a my-new-app
```

Une fois que votre branche heroku pointe bien sur le staging vous devez créer une base de donnée avec la commande:

```
heroku addons:create heroku-postgresql:hobby-dev
```

### Seconde Étape: Set-up de la nouvelle database

Dans le fichier `config/database.yml` ajouter le code suivant à la fin du fichier en remplacant `app_name` par le nom de votre app (le même que celui au début du fichier).

```
staging:
  <<: *default
  database: app_name_staging
  username: app_name
  password: <%= ENV['APP_NAME_DATABASE_PASSWORD'] %>
``` 

## Trosième Étape: Webpacker

Si vous utilisez Webpacker il faudra ajouter ceci au fichier `config/webpacker.yml`

```
staging:
  <<: *default
```

## Quatrième étape: staging.rb

Pour finir on copie la configuration de l'environnement de production à celui de staging avec la commande:

```
$ cp config/environments/production.rb config/environments/staging.rb
```

