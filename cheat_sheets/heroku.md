---
layout: cheat_sheet
title: Cheat Sheet Heroku
permalink: /cheat_sheets/heroku
---

CLI Heroku

```bash
heroku run rails console
```

Migration

```bash
heroku run rails db:migrate
```

Log

```bash
heroku logs --tail
```

Set env variable

```bash
heroku config:set ADMIN_PASSWORD='password'
```

Ajouter une remote heroku

```bash
heroku git:remote -a project-name
```

Avoir des infos sur sa base de données:

```bash
heroku pg:info
```

```
=== DATABASE_URL
Plan         Standard 0
Status       available
Data Size    82.8 GB
Tables       13
PG Version   12.5
Created      2012-02-15 09:58 PDT
```


Copier la base de donnée en locale, il faut tout d'abord récupére le nom d'utilisateur de sa BDD puis le nom de sa base de donnée.

```sh
whoami
# alexandrebouvier
```

Dans la console rails

```ruby
irb(main):001:0> Rails.configuration.database_configuration["development"]["database"]
# => "airbnb_copycat_development"
```

```bash
heroku pg:backups:capture
heroku pg:backups:download
pg_restore --verbose --clean --no-acl --no-owner -h localhost -U alexandrebouvier -d airbnb_copycat_development latest.dump
```

Si le BDD est petite on peut utiliser le `pg:pull` mais ça risque de prendre plus de temps

```bash
rails db:drop
heroku pg:pull DATABASE_URL airbnb_copycat_development
```

Pour copier la base de donnée local sur une app Heroku

```bash
heroku pg:push airbnb_copycat_development DATABASE_URL
```

Pour copier la BDD d'une app Heroku à une autre. Ici on copie de `example-app` vers `example-staging-app`, pour plus d'information voir la <a href="https://devcenter.heroku.com/articles/heroku-postgres-backups" class="underlined" target="_blank">documentation</a>

```bash
heroku pg:copy example-app::HEROKU_POSTGRESQL_ORANGE_URL GREEN --app example-staging-app
```

Se connecter à la base de données

```bash
heroku pg:psql
```

<h2>Des articles pour aller plus loin </h2>

<a href="https://help.heroku.com/7NIXUF1V/how-do-i-change-the-billing-app-for-my-heroku-postgres-database"
   class="underlined"
   target="_blank">
  Copy app accross applications
</a>
<br>
<a href="https://devcenter.heroku.com/articles/heroku-postgres-backups"
   class="underlined"
   target="_blank">
  Heroku PGBackups
</a>
<br>
<a href="https://devcenter.heroku.com/articles/heroku-postgres-import-export"
   class="underlined"
   target="_blank">
  Importing and Exporting Heroku Postgres Databases
</a>
