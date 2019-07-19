---
layout: post
title:  "Installer un back-office avec Administrate"
author: alexandre
status: draft
---

Dans ce tuto nous allons installer un back office avec la gem `administrate`

Nous supposons qu'il y a un model `Flat` et `Booking` qu'il y'a déjà une application Rails avec plusieurs modèles. Nous allons laisser la possibilité aux administrateurs du site de créer ou de modifier des réservations.

### Première étape

Il faut ajouter `administrate` dans le gemfile.
Ensuite on lance 

```
$ bundle install
``` 

### Seconde Étape: 

```
$ rails generate administrate:install
```

### Trosième Étape: 

```
$ rails generate administrate:dashboard Booking
```

Le dashboard est maintenant disponible sur `localhost:3000/admin`

Pour setup les données modifiables il faut aller dans `app/dashboards` et modifier `booking_dashboard.rb`
