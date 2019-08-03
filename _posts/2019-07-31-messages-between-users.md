---
layout: post
title:  "Configurer une messagerie privée"
author: alexandre
difficulty: 3
---

Dans ce tuto nous allons apprendre comment permettre aux utilisateurs de s'envoyer des messages privés.

Nous supposons qu'il y a une application Rails avec modèle `User` (généré par Devise).

### Première étape

On crée d'abord une migration pour la table `messages` avec un champ `content`, et deux champs faisant références au modèle `User`.

```sh
rails generate model Message content:text sender:references receiver:references
```

Par défaut Rails créé une migration où les colonnes `sender` et `receiver` font références aux modèles `Sender` et `Receiver` qui n'existent pas. Nous voulons que ces deux colonnes fassent références à notre modèle `User`. On va donc modifier le fichier créé. Il suffit de rajouter `foreign_key: { to_table: :users }` à notre fichier de migration.

```ruby
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

Ensuite nous pouvons faire tourner la migration.

```sh
rails db:migrate
```

### Seconde Étape:

Une fois que la migration a été jouée, nous allons modifier le modèle `Message` pour indiquer à Ruby que `sender` et `receiver` font bien référence à notre modèle `User`. Et que le contenu des messages ne doivent pas être vide ni supérieur à 100 caractères.

```ruby
# app/model/message.rb

class Message < ApplicationRecord
  belongs_to :sender,   class_name: "User"
  belongs_to :receiver, class_name: "User"

  validates :content, length: { maximum: 100  }
end
```

Et inversement nous allons dire à `User` comment retrouver une liste de toutes les conversations (méthode `friends`) et le contenu d'une conversation (méthode `conversation_with`).

```ruby
# app/model/user.rb

class User < ApplicationRecord
  [...]
  def friends
    friends = Message.where(sender: self).map { |message| message.receiver} + Message.where(receiver: self).map { |message| message.sender}
    friends.uniq
  end

  def conversation_with(friend_id)
    friend       = User.find(friend_id)
    conversation = Message.where(sender: self, receiver: friend) + Message.where(sender: friend, receiver: self)
    conversation.sort_by { |message| message.created_at }
  end
end
```

### Troisième Étape:

Enfin nous allons récupérer les messages dans la vue. Tout d'abord il faut créer un message dans la console que vous lancez avec `rails c`

```ruby
Message.create(sender: User.first, receiver: User.last, content: "Hello, how are you?")
Message.create(sender: User.last, receiver: User.first, content: "Hello, good and you?")
```

Ensuite nous allons créer les routes. Tout d'abord une route qui recense toutes les conversations `get 'conversations', to: 'messages#conversations'`. Ensuite une route pour afficher les conversations avec un autre utilisateur et une route pour créer un message. Comme nous avons besoin de l'`id` d'un autre utilisateur il faudra nester la ressource.

```ruby
# config/routes.rb

Rails.application.routes.draw do
  [...]
  get 'conversations', to: 'messages#conversations'
  resources :users do
    resources :messages, only: [:index, :create]
  end
end
```

Maintenant que nous avons créé les routes, il faut créer le `controller` associé.

```sh
rails generate controller messages conversations index create
```

Dans notre `controller` nous allons remplir les méthodes.

Commençons par la liste des conversations.

```ruby
# app/controllers/messages_controller.rb

class MessagesController < ApplicationController
  def conversations
    @friends = current_user.friends
  end
end
```

Pour afficher la liste des utilisateurs avec qui on discute on s'occupe de la vue.

```erb
# app/views/messages/conversations.html.erb

<% if @friends.empty? %>
  <h3>Vous n'avez pas de conversation</p>
<% else %>
  <h3>Mes conversations</h3>
  <% @friends.each do |friend| %>
    <%= link_to user_messages_path(friend) do %>
      <p>Conversation avec <%= friend.first_name %></p>
    <% end %>
  <% end %>
<% end %>
```

Ensuite nous voulons afficher les messages échangés avec une personne.

```ruby
# app/controllers/messages_controller.rb

class MessagesController < ApplicationController
  [...]
  def index
    @messages = current_user.conversation_with(params[:user_id])
    @message  = Message.new
    @friend   = User.find(params[:user_id])
  end
end
```

```erb
# app/views/messages/index.html.erb

<h3>Ma conversation avec <%= @friend.first_name %></h3>
  <% @messages.each do |message| %>
    <ul>
      <li><p><%= message.sender.first_name %> dit : <%= message.content %></p></li>
    </ul>
  <% end %>

<%= link_to 'Retour aux conversations', conversations_path %>
```

Puis nous voulons envoyer un message depuis une conversation.

```ruby
# app/controllers/messages_controller.rb

class MessagesController < ApplicationController
  [...]

  def create
    @message = Message.new(message_params)
    @message.sender = current_user
    @message.receiver = User.find(params[:user_id])
    if @message.save
      redirect_to user_messages_path(@message.receiver)
    else
      @friend   = User.find(params[:user_id])
      @messages = current_user.conversation_with(params[:user_id])
      render :index
    end
  end

  private

  def message_params
    params.require(:message).permit(:content)
  end
end
```

```erb
# app/views/messages/index.html.erb

[...]
<%= simple_form_for [@friend, @message] do |f| %>
  <%= f.input :content %>
  <%= f.submit "Envoyer un message", class: "btn btn-primary" %>
<% end %>
```

Pour finir ajoutons un lien depuis la show d'un booking pour pouvoir contacter le propriétaire.

```erb
# app/views/bookings/show.html.erb

<%= link_to user_messages_path(@flat.user) do %>
  <button class="btn btn-principal btn-margin-top">Contacter le propriétaire</button>
<% end %>
```

Vous pouvez retrouver un exemple de code [ici](https://github.com/alexandrebk/airbnb-copycat/commit/9d882d532ea3c53ca52673a0d407bc600dbb3a68)
