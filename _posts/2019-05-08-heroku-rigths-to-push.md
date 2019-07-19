---
layout: post
title:  "Ajouter des collaborateurs sur Heroku"
author: alexandre
---

Dans ce tuto nous allons apprendre à comment ajouter des utilisateurs sur Heroku

### Première étape

Tout d'abord il faut ajouter vos utilisateurs sur Heroku.

#### Allez dans l'onglet Access

![Allez dans l'onglet Access](/assets/images/heroku-tabs.png)

#### Cliquer sur Add Collaborator

![Cliquer sur Add Collaborator](/assets/images/heroku-button.png)

#### Ajoutez son email rattaché à son compte Heroku

![Ajoutez son email rattaché à son compte Heroku](/assets/images/heroku-email.png)

### Seconde Étape:

Ensuite vos collaborateurs doivent ajouter dans leur terminal la commande suivante en remplacant `app-name` par le nom de votre application Heroku:

```
heroku git:remote -a app-name
```

Dans notre cas `airbnb-copycat` est le nom de notre application Heroku pour `https://airbnb-copycat.herokuapp.com/`
