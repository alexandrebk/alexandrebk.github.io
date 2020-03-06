---
layout: post
title:  "Méthodes utiles en Ruby pour débutant"
description: "Dans ce tuto je vais vous présenter des méthodes très utiles que j'utilise tous les jours en Ruby"
status: tech
---

### `||=` Assigner une valeur si et seulement elle n'est pas déjà définie

On souhaite assigner une valeur à une variable si et seulement si elle n'est pas précédemment définie. Attention car on réassigne si la valeur est *falsy* c'est à dire `nil` ou même `false`. Il n'est donc pas conseillé d'utiliser cette méthode pour un booléan.

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

### `&` Opérateur de navigation sans risque

Cela vous permet de naviguer à travers des objets sans risque de voir lever une erreur.

Imaginons deux classes `Room` et `Project` avec `Room` qui appartient à un projet. Le projet à une variable d'instance *name*.

```ruby
project = Project.new(name: "Mes supers travaux")
room    = Room.new(project: project)
puts room.project.name
# => "Mes supers travaux"
```

Mainteant imaginons qu'aucun projet ne soit rattaché à la *room*

```ruby
room    = Room.new(project: project)
puts room.project.name
# => NoMethodError: undefined method `name' for nil:NilClass
```

Pour prévenir ce type d'erreur nous allons ajouter l'opérateur `&`. Il va essayer la méthode et si elle ne fonctionne pas cela renvoie `nil`.

```ruby
room    = Room.new(project: project)
puts room&.project&.name
# => nil
```

### Les procs

Les procs sont très utiles quand vous souhaitez itérer sur des objets et retirer une valeur unique.

Commencons par un exemple sur un tableau de chiffres que nous voulons transformer en string.

```ruby
[1,2,3].map { |number| number.to_s }
# => ["1", "2", "3"]
[1,2,3].map(&:to_s)
# => ["1", "2", "3"]
```

Mainteant imaginons une classe `Room` avec une variable d'instance `.wall_surface`. Je veux récuperer toutes les valeurs et les sommer.

```ruby
@rooms = Room.all

@rooms.sum { |room| room.wall_surface }
# équivalent à
@rooms.sum(&:wall_surface)
```

On peut écrire ses propres *proc*. Dans notre cas on va sommer toutes les surfaces plus 10.

```ruby
wall_surface_plus_ten = Proc.new {|x| x.wall_surface + 10 }

@rooms = Room.all
@rooms.sum(&wall_surface_plus_ten)
```

### La méthode *send*

La méthode *send* permet d'appeler une méthode sur un objet en lui passant une *string* et possiblement une *string* avec une interpollation.

Imaginons que j'ai `Room` et que je récupères plusieurs instance de ce modèle. Je veux changer plusieurs variables d'instance en même temps.

```ruby
def should_paint_all
  rooms = Room.all
  rooms.each do |room|
    room.should_paint_walls     = true
    room.should_paint_ceiling   = true
    room.should_paint_furniture = true
    room.save
  end
end
```

Nous allons itérer sur un tableau qui contient les noms des méthodes d'instance.

```ruby
def should_paint_all
  rooms = Room.all
  rooms.each do |room|
    [:should_paint_walls, :should_paint_ceiling, :should_paint_furniture].each do |field_name|
      room.send("#{field_name}=", true)
    end
    room.save
  end
end
```

La documentation se trouve [ici](https://apidock.com/ruby/Object/send)

### L'itérateur *reduce*

```ruby
[1,2,3].reduce(0) do |sum, num|
  sum + num
end
# => 6
```

La documentation se trouve [ici](https://apidock.com/ruby/Enumerable/reduce)
