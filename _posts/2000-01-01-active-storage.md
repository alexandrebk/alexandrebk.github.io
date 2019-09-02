---
layout: post
title:  "Ajouter des photos avec Active Storage"
author: alexandre
status: draft
---

Dans ce tuto nous allons apprendre comment ajouter plusieurs photos à un modèle avec Active Storage.

### Première étape

Ajouter la gem Active Storage si vous n'etes pas dans Rails 6.

Ensuite il faut installer avec la commande

```
rails active_storage:install
```

Après il faut créer les tables:

```
rails db:migrate
```

Ensuite nous allons ajouter les photos à notre modèle `Flat`

```ruby
class Flat < ApplicationRecord
  has_many_attached :images
end
```

```ruby
# app/controllers/flats_controller.html.erb
  def flat_params
    params.require(:flat).permit(:title, :content, ..., images: [])
  end
```

### Seconde Étape: Configurer son compte AWS

Ajouter Actove Storage aux modèle `Flat`

### Trosième Étape: Configurer AWS

Pour la création du compartiment il faut changer juste le nom et la région (Irlande si vous êtes chez Heroku).

Après on va dans le service IAM pour créer des utilisateurs.

Il faut d'abord créer uns stratégie (une policy) et ensuite des utilisateurs. On va attribuer une stratégie aux utilisateurs.

Pour les utilisateurs il faut choisir un nom d'utilisateur et ensuite un service. Ici ca sera S3.

On lui attache un stratégie. Celle qu'on a crée juste avant. Pour les étapes 3 et 4 on peut mettre OK.

Enfin on récupère ses clés pour les mettre dans sur Heroku. sous le nom de `S3_ACCESS_KEY_ID` et `S3_SECRET_ACCESS_KEY`.

### Trosième Étape: 

Ajouter votre bucket AWS 

```yaml
# config/storage.yml
local:
  service: Disk
  root: <%= Rails.root.join("storage") %>
 
test:
  service: Disk
  root: <%= Rails.root.join("tmp/storage") %>
 
amazon:
  service: S3
  access_key_id: ""
  secret_access_key: ""
  bucket: ""
  region: "" # e.g. 'us-east-1'
```

Pour les environnements de dev et de test on ne va rien toucher. Par contre pour l'environnement de prod on va 

```ruby
# config/environments/production.rb
config.active_storage.service = :amazon
```
### Quatrième étape: Intégrer au seeds

