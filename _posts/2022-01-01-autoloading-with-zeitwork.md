---
layout: post
title:  "aaaaaaa"
description: "bbbb"
seo_description: "Installer back office avec gem administrate"
difficulty: 1
status: draft
---

Dans ce tuto nous allons essayer de comprende comment fonctionne Zietwork la gem d'autoloading par défaut dans Rails 7.

Convention de nommage . Une classe doit être appellé dans un fichier eponyme.

On pas pas mettre une autre classe dans ce fichier sauf si elle est inclue dans la précédente


nom du fichier toto.rb
class Toto
  class Titi
  end
end

Alors on peut appeler Toto:Titi

Mais on ne peut pas appeler les méthodes définis dans Toto dans Titi. Il y'a aucune inhéritance

Si vous sortez Titi de Toto, vous ne pourrez pas appeler la classe.

### Eager Loading

### Seconde Étape:


### Trosième Étape:


