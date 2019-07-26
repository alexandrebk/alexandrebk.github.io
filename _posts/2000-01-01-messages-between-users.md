---
layout: post
title:  "Configurer une messagerie privée"
author: alexandre
status: draft
difficulty: 3
---

Dans ce tuto nous allons apprendre comment permettre aux utilisateurs de s'envoyer des messages privés.

Nous supposons qu'il y a une application Rails avec modèle `User` (généré par Devise).

### Première étape

On crée d'abord une migration pour la tables `messages` avec un champ `content`, et deux champs faisant références au modèle `User`.

```sh
rails generate Message content:text sender:references receiver:references
```

Par défaut Rails crée un migration ou les colonnes `sender` et `receiver` font références aux modèles `Sender` et `Receiver`. Or nous voulons que ces deux colonnes fassent références à notre modèle `User`. On va donc modifier le fichier créé. Il suffit de rajouter `foreign_key: { to_table: :users }` à notre migration.

````ruby
class CreateMessages < ActiveRecord::Migration[5.2]
  def change
    create_table :messages do |t|
      t.references :sender,   foreign_key: { to_table: :users }
      t.references :receiver, foreign_key: { to_table: :users }
      t.text       :content

      t.timestamps
    end
  end
end
```

### Seconde Étape:

Une fois que la migration a été jouée, nous allons modifier le modèle `Message` pour indiquer à Ruby que `sender` et `receiver` font bien référence à notre modèle `User`. Et que le contenu des messages ne doivent pas être vides.

```ruby
# app/model/message.rb
class Message < ApplicationRecord
  belongs_to :sender,   class_name: "User"
  belongs_to :receiver, class_name: "User"

  validates :content, presence: true
end
```

Et inversement nous disons à `User` que les messages lui appartiennent.

```ruby
# app/model/user.rb
class User < ApplicationRecord
  [...]
  has_many :messages_as_receiver, foreign_key: 'receiver_id', class_name: 'Message'
  has_many :messages_as_sender,   foreign_key: 'sender_id',   class_name: 'Message'
end
```

```ruby
# app/model/user.rb
class User < ApplicationRecord
  [...]
  def friends
    friends = Message.where(sender: self)(:&receiver) + Message.where(receiver: self)(:&sender) 
    friends.uniq
  end
  
  def conversation_with(friend_id)
    # return array of messages with one personne
    friend       = User.find(friend_id)
    conversation = Message.where(sender: self, receiver: friend) + Message.where(sender: friend, receiver: self)
    conversation.order_by(:created_at)
  end
end
```
### Trosième Étape:

Enfin nous allons récupérer les messages dans la vue. Tout d'abord il faut créer un message dans la console.

```ruby
Message.create(sender: User.first, receiver: User.last, content: "Hello, how are you?")
Message.create(sender: User.last, receiver: User.first, content: "Hello, good and you?")
```

On va ensuite créer les routes et les vues.
Pour afficher la liste des utilisateurs avec qui on discute.

```ruby
# app/views/messages/index.html.erb
<%= current_user.friends do |friend| %>
  <%= link_to messages_path(friend) do %>
    Conversation with : <%= friend.name %>
  <% end %>
<%= end %>
```

```ruby
# app/views/messages/show.html.erb
<%= current_user.conversation_with(params[:id]) do |message| %>
  <%= message.content %>
<%= end %>
```

