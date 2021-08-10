---
layout: post
title:  "Quelques méthodes utiles en Ruby pour les juniors"
description: "Dans ce tuto je vais vous présenter des méthodes très utiles que j'utilise tous les jours en Ruby"
status: tech
tags: "ruby"
---

### Opérateur d'affectation conditionnel (`||=`)

On souhaite assigner une valeur à une variable si et seulement si elle n'est pas précédemment définie. Attention la valeur est réassigné si la variable est *falsy* (c'est à dire *nil* ou *false*). Donc il n'est pas conseillé d'utiliser cette méthode pour un booléan.

```ruby
toto = nil
toto ||= "Je ne suis pas nil"
puts toto
# "Je ne suis pas nil"

toto = "J'ai déjà du contenu"
toto ||= "Je ne suis pas nil"
puts toto
# "J'ai déjà du contenu"
```

### Opérateur de navigation sans risque (`&`)

Cela vous permet de naviguer à travers des objets sans risque d'avoir une erreur.

Imaginons deux classes : *Room* et *Flat*. Une *room* appartient à un *Flat* qui a une variable d'instance *name*.

```ruby
class Flat
  attr_accessor :name

  def initialize(args = {})
    @name = args[:name]
  end
end

class Room
  attr_accessor :flat

  def initialize(args = {})
    @flat = args[:flat]
  end
end

flat = Flat.new(name: "Mon super appart")
room = Room.new(flat: flat)
puts room.flat.name
# => "Mon super appart"
```

Maintenant, imaginons qu'aucun projet ne soit rattaché à l'instance de *Room*.

```ruby
# [...]
room = Room.new
puts room.flat.name
# => NoMethodError: undefined method `name' for nil:NilClass
```

Pour empêcher cette erreur, nous allons ajouter l'opérateur `&` qui va nous renvoyer *nil* si la méthode ne fonctionne pas.

```ruby
# [...]
puts room&.flat&.name
# => nil
```

### Les *procs*

Les *procs* sont très utiles quand vous souhaitez itérer sur des objets et appliquer une méthode sur chaque élément.

Commençons par un exemple un exemple simple d'un tableau de chiffres que nous voulons transformer en chaîne de caractères.

```ruby
p [1,2,3].map { |number| number.to_s }
# => ["1", "2", "3"]
p [1,2,3].map(&:to_s)
# => ["1", "2", "3"]
```

Maintenant, imaginons une classe *Room* avec une variable d'instance *area*. Je veux récupérer toutes les valeurs et les additionner.

```ruby
class Room
  attr_accessor :area

  def initialize(args = {})
    @area = args[:area]
  end
end

room1 = Room.new(area: 10)
room2 = Room.new(area: 15)

rooms = [room1, room2]

p rooms.sum { |room| room.area }
# => 25
p rooms.sum(&:area)
# => 25
```

On peut même écrire ses propres procs. Par exemple, un *proc* qui va calculer le volume des chambres (sachant qu'elles font 4 mètres de hauteur).

```ruby
# [...]
volume = Proc.new {|x| x.area * 4 }
p rooms.sum(&volume)
# => 100
```

La documentation se trouve <a href="https://ruby-doc.org/core-2.7.1/Proc.html" class="underlined" target="_blank">ici</a>.

### La méthode *send*

La méthode *send* permet d'appeler une méthode sur un objet en lui passant une chaîne de caractères.

Imaginons que nous avons plusieurs instances de *Room* et que nous souhaitons changer plusieurs variables d'instance en même temps.

```ruby
class Room
  attr_accessor :should_paint_walls,
                :should_paint_ceiling,
                :should_paint_furniture,
                :should_paint_door

  def initialize(args = {})
    @should_paint_walls     = false
    @should_paint_ceiling   = false
    @should_paint_furniture = false
    @should_paint_door      = false
  end
end

room = Room.new

p room.should_paint_walls     # false
p room.should_paint_ceiling   # false
p room.should_paint_furniture # false
p room.should_paint_door      # false

room.should_paint_walls     = true
room.should_paint_ceiling   = true
room.should_paint_furniture = true
room.should_paint_door      = true

p room.should_paint_walls     # true
p room.should_paint_ceiling   # true
p room.should_paint_furniture # true
p room.should_paint_door      # true
```

Maintenant, nous allons reconstruire les méthodes d'instances à en itérant sur un tableau. La premier argument de la méthode *send* est le nom de la méthode et le second argument la valeur.

```ruby
# [...]
room = Room.new

p room.should_paint_walls     # false
p room.should_paint_ceiling   # false
p room.should_paint_furniture # false
p room.should_paint_door      # false

[:walls, :ceiling, :furniture, :door].each do |field_name|
  room.send("should_paint_#{field_name}=", true)
end

p room.should_paint_walls     # true
p room.should_paint_ceiling   # true
p room.should_paint_furniture # true
p room.should_paint_door      # true
```

La documentation se trouve <a href="https://apidock.com/ruby/Object/send" class="underlined" target="_blank">ici</a>.
