---
layout: post
title:  "Les bonnes pratiques en css"
description: "Dans ce tuto nous allons apprendre à bien organiser organiser ses fichiers et classes css dans une application Ruby on Rails."
difficulty: 1
status: tech
---

### Première étape : Les noms des fichiers

Prenons un exemple d'organisation de dossier *css*.

```
├── application.scss
├── components
│   ├── _card_chat.scss
│   ├── _card_messages.scss
│   ├── _card_scrims.scss
│   ├── _filter_bar_search.scss
│   ├── _index.scss
│   ├── _invitation_cards.scss
│   ├── _match_history_card.scss
│   ├── _most_played_champs.scss
│   ├── _navbar_dashboard.scss
│   ├── _navbar_scrim.scss
│   ├── _player_card_dashboard.scss
│   ├── _player_card_show.scss
│   ├── _player_card_show_player.scss
│   ├── _profile_stats.scss
│   ├── _simple_form_scrim.scss
│   ├── _team_card_index.scss
│   ├── _team_card_messages.scss
│   ├── _team_card_show_team.scss
│   └── _team_history.scss
├── config
│   ├── _bootstrap_variables.scss
│   ├── _colors.scss
│   └── _fonts.scss
└── pages
    ├── _backimg.scss
    ├── _home.scss
    ├── _index.scss
    ├── _player_show.scss
    └── _show.scss
```

Dans cet exemple on peut noter que le dossier css est divisé en sous-dossiers *components*, *config* et *pages*. C'est un bon point. Cependant il est difficile de s'y retrouver dans ces sous-dossiers.
On remarque par exemple que dans le dossier *components*, les trois premiers fichiers commencent par `card`. `card` étant un composant, ces fichiers devraient être regroupés en un seul nommé `_card.scss`.

En suivant cette règle, voici l'organisation que nous devrions avoir :

```
├── application.scss
├── components
│   ├── _cards.scss
│   ├── _search_bar.scss
│   ├── _index.scss
│   ├── _most_played_champs.scss
│   ├── _navbar.scss
│   ├── _stats.scss
│   ├── _forms.scss
├── config
│   ├── _bootstrap_variables.scss
│   ├── _colors.scss
│   └── _fonts.scss
└── pages
    ├── _home.scss
    ├── _reviews.scss
    └── _flats.scss
```

### Seconde Étape: Le nom des classes

Après avoir vu l'organisation des dossiers et fichiers css. Regardons l'organisation des classes dans un fichier css.

Prenons comme exemple ce fichier :

```scss
.card-scrims {
  border-radius: 4px;
  overflow: hidden;
  height: 180px;
  background: white;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 3%;
}

.card-scrims img {
  height: 120px;
  width: 120px;
  padding: 10px;
}

.card-scrims h2 {
  font-size: 20px;
  margin: 0;
  color: black;
  &:hover {
    color: #348498;
    transition: .5s;
  }
}

.card-scrims p {
  color: black;
  line-height: 1.4;
  opacity: .9;
  margin-bottom: 0;
  margin-top: 8px;
}

.card-scrims-infos {
  padding: 16px;
}
```

Tout d'abord réunir toutes les *cards* dans un même fichier.

Nous remarquons la répétition de `.card-scrims`. Pour éviter cette répétition, nous allons nester les éléments.

Ensuite renommer certaines classes. Par exemple pour `.card-scrims-infos`, nous allons la remplacer par `.infos`. Et nous allons facilement la cibler grâce au *nesting*.

```scss
.card-scrims {
  border-radius: 4px;
  overflow:      hidden;
  height:        180px;
  background:    white;
  display:       flex;
  align-items:   center;
  cursor:        pointer;
  margin-bottom: 3%;
  img {
    height:  120px;
    width:   120px;
    padding: 10px;
  }
  h2 {
    font-size: 20px;
    margin:    0;
    color:     black;
  }
  h2:hover {
    color:      #348498;
    transition: .5s;
  }
  p {
    color:         black;
    line-height:   1.4;
    opacity:       .9;
    margin-bottom: 0;
    margin-top:    8px;
  }
  .infos {
    padding: 16px;
  }
}

.card-message {
  /* ... */
  .title {
    /* ... */
  }
  .description {
    /* ... */
  }
}

.card-review {
  /* ... */
  .title {
    /* ... */
  }
  .description {
    /* ... */
  }
}
```
