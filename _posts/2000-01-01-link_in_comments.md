---
layout: post
title:  "Ajouter des liens cliquables dans les commentaires"
author: alexandre
status: draft
---

Dans ce tuto nous allons apprendre à comment rendre des liens cliquables dans un texte rentré par des utilisateurs.

Nous supposons qu'il y a un model `Comment` et qu'il y'a déjà une application Rails avec plusieurs modèles.

### Première étape

Il faut ajouter la gem `rails_autolink` dans le `Gemfile`

### Seconde Étape: 

Installer la gem avec `bundle install`

### Trosième Étape: Intégrer les commentaires à la vue

Dans la vue de votre choix vous pouvez ajouter:

`simple_format(auto-link(strop_tags(comment.content)))`

Avec `comment`la variable d'instance qui contient le commentaire, `strip_tags` pour supprimez les script js que l'utilisateur a potentiellement entré, `auto_link` pour ajouter le tag `<a>` quand l'application détecte un lien et `simple_format` pour entouré le tout dans une balise `<p>`.
