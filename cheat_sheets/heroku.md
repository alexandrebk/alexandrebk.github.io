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

Ou alors

```bash
rails db:drop
heroku pg:pull DATABASE_URL airbnb_copycat_development
```

Pour faire le contraire

```bash
heroku pg:push airbnb_copycat_development DATABASE_URL
```
