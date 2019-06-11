---
layout: post
title:  "Comment envoyer des messages privés?"
author: alexandre
---

Dans ce tuto nous allons apprendre comment envoyer des messages privés entre utilisateurs dans une application Ruby on Rails.

Nous supposons qu'il y a une table Users (géré par Devise) et qu'il y'a déjà une application Rails avec plusieurs modèles.

### Première étape

On va créer une migration pour la tables `messages` avec un champ `content`, et deux champs faisant références au modèle `User`.

```sh  
rails generate Message content:text sender:references receiver:references
```

On va ensuite modifier le fichier créé pour que `sender` et `receiver` ne fasse pas références aux modèles `Sender` et `Receiver` qui n'existe pas mais bien au modèle `User`. Il suffit de rajouter `foreign_key: { to_table: :users }`.

````ruby
class CreateMessages < ActiveRecord::Migration[5.2]
  def change
    create_table :messages do |t|
      t.references :sender, foreign_key: { to_table: :users }
      t.references :receiver, foreign_key: { to_table: :users }
      t.text :content

      t.timestamps
    end
  end
end
```

### Seconde Étape: 

Ensuite nous allons modifier le model

```ruby
# app/model/message.rb
class Message < ApplicationRecord
  belongs_to :sender, class_name: "User"
  belongs_to :receiver, class_name: "User"

  validates :content, presence: true
end
```

```ruby
# app/model/user.rb
class User < ApplicationRecord
  #
  #
  has_many :messages_as_receiver, foreign_key: 'receiver_id', class_name: 'Message'
  has_many :messages_as_sender, foreign_key: 'sender_id', class_name: 'Message'
end
```

### Trosième Étape: 

Enfin nous allons récupérer les messages dans la vue. Tout d'abord il faut en créer un dans la console (ou encore mieux dans vos seed)

```ruby
Message.create(sender: User.first, receiver: User.last, content: "Hello World!")
```

Pour afficher les messages envoyés:

```ruby
# app/views/messages/index.html.erb
<%= current_user.messages_as_sender.each do |message| %>
  <%= message.content %>
<%= end %>
```
