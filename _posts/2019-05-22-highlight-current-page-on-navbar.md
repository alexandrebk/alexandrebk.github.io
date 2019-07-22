---
layout: post
title:  "Appliquer un mode ‘active’ à sa barre de navigation"
author: alexandre
difficulty: 1
---

Dans ce tuto nous allons apprendre comment mettre en surbrillance la page sur laquel se trouve l'utilisateur dans un barre de navigation. Pour cela nous allons utiliser la classe `active` de Boostrap.

Nous supposons qu'il y a une application Rails avec Bootstrap installé et une `navbar` classique avec des classes bootstrap à l'intérieur.

```
# un élément de la navbar
<li class="nav-item">
  <%= link_to "Rechercher", flats_path, class: "nav-link" %>
</li>
```

### La méthode `current_page?`

La méthode `current_page?` prend comme argument une route et vérifie que nous bien sur celle ci. Donc dans notre exemple nous allons verifier que nous sommes bien dans `flats_path` avec `current_page?(flats_path)`. Si oui alors je veux mettre la classe `active` si non je ne mets rien. En code cela se traduit par `'active' if current_page?(flats_path)`. Nous avons donc:

```
<li class="nav-item <%= 'active' if current_page?(flats_path) %>">
  <%= link_to "Rechercher", flats_path, class: "nav-link" %>
</li>
```

Vous pouvez retrouver un exemple de code [ici](https://github.com/alexandrebk/airbnb-copycat/commit/9eb0f044feee4acdee35640fd7dff27171fe205a)
