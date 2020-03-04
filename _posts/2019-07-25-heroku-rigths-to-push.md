---
layout: post
title:  "Ajouter des collaborateurs sur Heroku"
author: "Alexandre Bouvier"
difficulty: 1
status: tech
---

<a href="https://dashboard.heroku.com/apps" target="_blank">Allez sur votre dashboard</a> puis dans votre application.

### Première étape

Dans l'onglet *Access*, cliquez sur *Add Collaborator*

<img src="/images/posts/heroku-button.png" class="image" alt="Cliquer sur Add Collaborator">

Ajoutez son email

<img src="/images/posts/heroku-email.png" class="image" alt="Ajoutez son email rattaché à son compte Heroku">

### Seconde étape

Ensuite vos collaborateurs doivent ajouter dans leur repo la commande suivante :

```sh
heroku git:remote -a airbnb-copycat
```

En remplacant `airbnb-copycat` par le nom Heroku de votre application.
