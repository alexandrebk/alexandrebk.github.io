---
layout: post
title:  "Les bonnes pratiques en css"
author: alexandre
difficulty: 1
status: draft
---

Dans ce tuto nous allons apprendre à bien organiser son code css dans une application Ruby on Rails

### Première étape : Les noms des fichiers

Voici ce qui ne faut pas faire

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

Voici ce qu'il faut faire.

```
├── application.scss
├── components
│   ├── _card.scss
│   ├── _filter_bar_search.scss
│   ├── _index.scss
│   ├── _most_played_champs.scss
│   ├── _navbar.scss
│   ├── _stats.scss
│   ├── _form.scss
├── config
│   ├── _bootstrap_variables.scss
│   ├── _colors.scss
│   └── _fonts.scss
└── pages
    ├── _home.scss
    ├── _reviews.scss
    └── _flats.scss
```

### Seconde Étape: Les cards

Voici ce qu'il ne faut pas faire.

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
  width: 121px;
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

Une fois que vous avez réunis toutes les cards dans un même fichier. Il faudra organiser vos classes comme cela

```scss
.card-message {
  /* vos classes css */
  .title {
    /* vos classes css */
  }
  .description {
    /* vos classes css */
  }
}

.card-review {
  /* vos classes css */
  .title {
    /* vos classes css */
  }
  .description {
    /* vos classes css */
  }
}
```

Ce qui donne pour les cards scrims ceci: Pour le `.card-scrims-infos`, nous allons la remplacer par `.infos` dans le html et le scss.

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
  img {
    height: 120px;
    width: 121px;
    padding: 10px;
  }
  h2 {
    font-size: 20px;
    margin: 0;
    color: black;
    &:hover {
      color: #348498;
      transition: .5s;
    }
  }
  p {
    color: black;
    line-height: 1.4;
    opacity: .9;
    margin-bottom: 0;
    margin-top: 8px;
  }
  .infos {
    padding: 16px;
  }
}
```

Pour plus de lisibilité n'hésitez pas à aligner vos propriétés css.
