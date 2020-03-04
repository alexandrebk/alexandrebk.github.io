border: 1rem solid;---
layout: post
title:  "Ajouter des collaborateurs sur Heroku"
author: "Alexandre Bouvier"
difficulty: 1
status: tech
---

<a href="https://dashboard.heroku.com/apps" target="_blank">Allez sur votre dashboard</a> puis dans votre application.

### Première étape

##### Dans l'onglet *Access*, cliquez sur *Add Collaborator*

<img src="/images/posts/heroku-button.png" style="width: 100%;border: 4px solid;border-radius: 16px;" alt="Cliquer sur Add Collaborator">

##### Ajoutez son email

<img src="/images/posts/heroku-email.png" style="width: 100%;border: 4px solid;border-radius: 16px;" alt="Ajoutez son email rattaché à son compte Heroku">

### Seconde étape

Ensuite vos collaborateurs doivent ajouter dans leur repo la commande suivante en remplacant `airbnb-copycat` par le nom de l'application Heroku:

```sh
heroku git:remote -a airbnb-copycat
```
