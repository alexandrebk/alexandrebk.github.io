---
layout: post
title:  "Ajouter des collaborateurs sur Heroku"
description: "Dans ce tuto nous allons apprendre comment authoriser les membres de votre équipe à pusher sur Heroku."
difficulty: 1
status: tech
---

<a href="https://dashboard.heroku.com/apps" target="_blank">Allez sur votre dashboard Heroku</a> puis cliquez sur le nom de votre application.

### Première étape

Dans l'onglet *Access*, cliquez sur *Add Collaborator*

<img src="/images/posts/heroku-button.png" class="image" alt="Cliquer sur Add Collaborator">

Ajoutez son email

<img src="/images/posts/heroku-email.png" class="image" alt="Ajoutez son email rattaché à son compte Heroku">

### Seconde étape

Ici l'application s'appelle `airbnb-copycat`

Vos collaborateurs devraient lancer la commande suivante dans leur terminal :

```sh
heroku git:remote -a airbnb-copycat
```

Dans votre cas, remplacez `airbnb-copycat` par le nom de votre application.
