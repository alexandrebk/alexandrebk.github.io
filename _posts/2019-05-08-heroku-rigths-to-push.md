---
layout: post
title:  "Ajouter des collaborateurs sur Heroku"
author: alexandre
---

Dans ce tuto nous allons apprendre à comment ajouter des utilisateurs sur Heroku

### Première étape

Tout d'abord il faut ajouter vos utilisateurs sur Heroku.

![Allez dans l'onglet Access](/assets/images/heroku-tabs.png)
![Cliquer sur Add Collaborator](/assets/images/heroku-button.png)
![Ajoutez son email rattaché à son compte Heroku](/assets/images/heroku-email.png)

### Seconde Étape:

Ensuite vos collaborateurs doivent ajouter dans leur terminal la commande suivante:

```
heroku git:remote -a app-name
```

### Trosième Étape:


