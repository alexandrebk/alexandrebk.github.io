---
layout: post
title:  "Ajouter des collaborateurs sur Heroku"
author: "Alexandre Bouvier"
difficulty: 1
status: tech
---

Aller sur votre [dashboard](https://dashboard.heroku.com/apps) et cliquer sur votre application.

![Application List on Heroku](/images/posts/app-list-heroku.png)

### Première étape

##### Dans l'onglet Access, cliquer sur Add Collaborator

<img src="/images/posts/heroku-button.png" style="width: 100%; border: solid;" alt="Cliquer sur Add Collaborator">

##### Ajoutez son email

![Ajoutez son email rattaché à son compte Heroku](/images/posts/heroku-email.png)

### Seconde étape

Ensuite vos collaborateurs doivent ajouter dans leur repo la commande suivante en remplacant `airbnb-copycat` par le nom de l'application Heroku:

```sh
heroku git:remote -a airbnb-copycat
```
