---
layout: post
title:  "Méthodes utiles en Ruby pour débutant"
description: "Dans ce tuto je vais vous présenter des méthodes très utiles que j'utilise tous les jours en Ruby"
status: tech
tags: "ruby"
---

### Opérateur d'affectation conditionnel `||=`

On souhaite assigner une valeur à une variable si et seulement si elle n'est pas précédemment définie. Attention car on réassigne si la valeur est `falsy` c'est à dire `nil` ou même `false`. Il n'est donc pas conseillé d'utiliser cette méthode pour un booléan.

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

### Opérateur de navigation sans risque `&`

Cela vous permet de naviguer à travers des objets sans risque de voir lever une erreur.

Imaginons deux classes : `Room` et `Project`. `Room` appartient à `Project` et `Project` a une variable d'instance `name`.

```ruby
project = Project.new(name: "Mes supers travaux")
room    = Room.new(project: project)
puts room.project.name
# => "Mes supers travaux"
```

Maintenant, imaginons qu'aucun projet ne soit rattaché à la chambre.

```ruby
room = Room.new(project: project)
puts room.project.name
# => NoMethodError: undefined method `name' for nil:NilClass
```

Pour prévenir ce type d'erreur, nous allons ajouter l'opérateur `&` qui va renvoyer `nil` si la méthode ne fonctionne pas.

```ruby
room = Room.new(project: project)
puts room&.project&.name
# => nil
```

### Les procs

Les procs sont très utiles quand vous souhaitez itérer sur des objets et sélectionner une valeur unique.

Commençons par un exemple sur un tableau de chiffres que nous voulons transformer en chaîne de caractères.

```ruby
[1,2,3].map { |number| number.to_s }
# => ["1", "2", "3"]
[1,2,3].map(&:to_s)
# => ["1", "2", "3"]
```

Maintenant, imaginons une classe `Room` avec une variable d'instance `wall_surface`. Je veux récupérer toutes les valeurs et les additionner.

```ruby
@rooms = Room.all

@rooms.sum(&:wall_surface)
# équivalent à
@rooms.sum { |room| room.wall_surface }
```

On peut même écrire ses propres procs. Par exemple, un proc qui va additionner toutes les surfaces des `Room` et y ajouter 10.

```ruby
wall_surface_plus_ten = Proc.new {|x| x.wall_surface + 10 }

@rooms = Room.all
@rooms.sum(&wall_surface_plus_ten)
```

### La méthode *send*

La méthode `send` permet d'appeler une méthode sur un objet en lui passant une chaîne de caractères.

Imaginons que j'ai plusieurs instances de `Room` et que je veuille changer plusieurs variables d'instance.

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
    [:walls, :ceiling, :furniture].each do |field_name|
      room.send("should_paint_#{field_name}=", true)
    end
    room.save
  end
end
```

La documentation se trouve [ici](https://apidock.com/ruby/Object/send).

### L'itérateur `reduce`

```ruby
[1,2,3].reduce(0) do |sum, num|
  sum + num
end
# => 6
```

La documentation se trouve [ici](https://apidock.com/ruby/Enumerable/reduce).
