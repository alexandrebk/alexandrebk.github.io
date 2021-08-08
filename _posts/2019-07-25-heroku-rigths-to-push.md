---
layout: post
title:  "Ajouter des collaborateurs sur Heroku"
description: "Dans ce tuto nous allons apprendre comment autoriser les membres de votre équipe à pusher sur Heroku."
difficulty: 1
status: tech
tags: "heroku"
---

Allez sur votre <a href="https://dashboard.heroku.com/apps" class="underlined" target="_blank">dashboard Heroku</a> puis cliquez sur votre application.

Dans l'onglet **Access**, cliquez sur **Add Collaborator** et ajoutez son email.

<img src="/images/posts/heroku-button.png"
     class="image"
     alt="Cliquer sur Add Collaborator">

<img src="/images/posts/heroku-email.png"
     class="image"
     alt="Ajoutez son email rattaché à son compte Heroku">

Ensuite vos collaborateurs devront lancer la commande suivante dans leur terminal :

```sh
heroku git:remote -a airbnb-copycat
```

Ici l'application s'appelle `airbnb-copycat`. Dans votre cas, remplacez `airbnb-copycat` par le nom de votre application.
