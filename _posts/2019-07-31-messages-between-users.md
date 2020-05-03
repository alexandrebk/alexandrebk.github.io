---
layout: post
title:  "Ajouter une messagerie privée"
description: "Dans ce tuto nous allons apprendre comment permettre aux utilisateurs de s'envoyer des messages privés."
difficulty: 3
status: draft
---

Après avoir réservé un appartement,  nous avons souvent des questions logistiques (comment récupérer les clefs, à quelle heure...) C'est pourquoi l'utilisateur doit pouvoir envoyer un message au propriétaire depuis l'application. Pour répondre à cette problématique nous allons mettre en place une messagerie privée.

Nous supposons qu'il y a une application Ruby on Rails avec un modèle `User` généré par *Devise*.

### Première étape : La migration

On crée d'abord une migration pour la table *messages* avec un champ *content* et deux champs *sender* et *receiver* pour les utilisateurs.

```sh
rails generate model Message content:text sender:references receiver:references
```

Par défaut Rails créé une migration où les colonnes *sender* et *receiver* font références aux modèles `Sender` et `Receiver` qui n'existent pas. Modifions-les pour qu'ils fassent référence à notre modèle `User`.

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

Ensuite nous pouvons faire tourner la migration dans le terminal.

```sh
rails db:migrate
```

### Seconde étape : Les méthodes d'instance

Une fois que la migration a été jouée, nous allons modifier le modèle `Message` pour indiquer à l'application que *sender* et *receiver* font référence au modèle `User`. Nous ajoutons aussi une validation pour que le contenu des messages ne soit ni vide ni supérieur à 100 caractères.

```ruby
# app/model/message.rb

class Message < ApplicationRecord
  belongs_to :sender,   class_name: "User"
  belongs_to :receiver, class_name: "User"

  validates :content, length: { maximum: 100 }
end
```

A l'inverse, nous allons créer deux méthodes dans `User`. Une pour retrouver une liste de toutes les conversations (*friends*). Et une autre pour le contenu d'une conversation (*conversation_with*).

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

### Troisième étape : Les routes

Ensuite nous allons créer 3 routes :

1. une route qui recense toutes les conversations
2. une route pour afficher la conversation avec un utilisateur
3. une route pour créer un message

Comme nous avons besoin de l'*id* d'un autre utilisateur il faudra nester la ressource pour les deux dernières.

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

<!--
TODO : Ajouter un channel number pour chaque utiliser
resources :conversations, only: [:index, :show] do
  resources :messages, only: [:create]
end
 -->

### Quatrième étape : Le contrôleur et les vues

Maintenant que nous avons créé les routes, il faut créer le *controller* associé.

```sh
rails generate controller messages conversations index create
```

Commençons par la liste des conversations dans le *controller*. On les récupère grâce à la méthode d'instance `.friends`.

```ruby
# app/controllers/messages_controller.rb

class MessagesController < ApplicationController
  def conversations
    @users_with_conversation = current_user.friends
  end
end
```

Et la vue éponyme.

```erb
<!-- app/views/messages/conversations.html.erb -->

<% if @users_with_conversation.empty? %>
  <h3>Vous n'avez pas encore de conversation</h3>
<% else %>
  <h3>Mes conversations</h3>
  <% @users_with_conversation.each do |user| %>
    <%= link_to user_messages_path(user) do %>
      <p>Conversation avec <%= user.first_name %></p>
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
<!-- app/views/messages/index.html.erb -->

<h3>Ma conversation avec <%= @friend.first_name %></h3>
  <% @messages.each do |message| %>
    <ul>
      <li><p><%= message.sender.first_name %> dit : <%= message.content %></p></li>
    </ul>
  <% end %>

<%= link_to 'Retour aux conversations', conversations_path %>
```

Vérifions que cela fonctionne en créant des messages dans la console.

```ruby
Message.create(sender: User.first, receiver: User.last, content: "Hello, how are you?")
Message.create(sender: User.last, receiver: User.first, content: "Hello, good and you?")
```

<img src="/images/posts/messages/affichage_messages.gif" class="image" alt="affichage messages">


### Cinquième étape : Créer un message

Puis nous voulons envoyer un message depuis une conversation.

```ruby
# app/controllers/messages_controller.rb
class MessagesController < ApplicationController
  [...]

  def create
    @message          = Message.new(message_params)
    @message.sender   = current_user
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
<!-- app/views/messages/index.html.erb -->

[...]
<%= simple_form_for [@friend, @message] do |f| %>
  <%= f.input :content %>
  <%= f.submit "Envoyer un message", class: "btn btn-primary" %>
<% end %>
```

<img src="/images/posts/messages/new_message.gif" class="image" alt="creation message">


### Bonus pour les *marketplaces*

Pour finir ajoutons un lien depuis la *show* d'un *booking* pour pouvoir contacter le propriétaire.

```erb
<!-- app/views/bookings/show.html.erb -->

<%= link_to user_messages_path(@flat.user) do %>
  <button class="btn btn-principal btn-margin-top">Contacter le propriétaire</button>
<% end %>
```
