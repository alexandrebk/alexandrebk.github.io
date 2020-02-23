---
layout: post
title:  "Ajouter des collaborateurs sur Heroku"
author: alexandre
difficulty: 1
status: tech
---

Dans ce tuto nous allons apprendre comment ajouter des utilisateurs sur Heroku.

### Première étape

Tout d'abord il faut ajouter vos utilisateurs sur Heroku.

##### Allez dans l'onglet Access

![Allez dans l'onglet Access](/images/posts/heroku-tabs.png)

##### Cliquer sur Add Collaborator

![Cliquer sur Add Collaborator](/images/posts/heroku-button.png)

##### Ajoutez son email rattaché à son compte Heroku

![Ajoutez son email rattaché à son compte Heroku](/images/posts/heroku-email.png)

### Seconde étape

Ensuite vos collaborateurs doivent ajouter dans leur terminal la commande suivante en remplacant `app-name` par le nom de votre application Heroku:

```sh
heroku git:remote -a app-name
```

Dans notre cas `airbnb-copycat` est le nom de notre application Heroku pour `https://airbnb-copycat.herokuapp.com/`
