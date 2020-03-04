---
layout: post
title:  "Ajouter des collaborateurs sur Heroku"
author: "Alexandre Bouvier"
difficulty: 1
status: tech
---

<a href="https://dashboard.heroku.com/apps" target="_blank">Allez sur votre dashboard</a> puis dans votre application.

### Première étape

##### Dans l'onglet *Access*, cliquez sur *Add Collaborator*

<img src="/images/posts/heroku-button.png" style="width: 100%;" alt="Cliquer sur Add Collaborator">

##### Ajoutez son email

<div style="margin: 0 auto;">
  ![Ajoutez son email rattaché à son compte Heroku](/images/posts/heroku-email.png)
</div>

### Seconde étape

Ensuite vos collaborateurs doivent ajouter dans leur repo la commande suivante en remplacant `airbnb-copycat` par le nom de l'application Heroku:

```sh
heroku git:remote -a airbnb-copycat
```
