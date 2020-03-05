---
layout: post
title:  "Quelques méthodes utiles en Ruby"
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

Imaginons deux classes `` `` This one allows to navigate safely through the layers of objects relations. Basically, let’s say that we have a company with only one employee and that this employee has a name and an email address:

```ruby
class Company
  attr_reader :employee

  def initialize(employee)
    @employee = employee
  end
end

class Person
  attr_reader :name, :email

  def initialize(name, email)
    @name = name
    @email = email
  end
end

bobby = Person.new('Bobby', 'bobby@korium.com')
korium = Company.new(bobby)
```

In this context if I wanted to access Drivy’s employee name I woud probably do the following:

```ruby
puts korium.employee.name
# => Bobby
```

However, this only works in an environment where none of the elements in the chain (except possibly for the last one) can be nil. Now, let’s imagine a case where the company does not really have any employee. The korium object would be instantiated as follows and the above code would raise an error:

```ruby
korium = Company.new(nil)

puts korium.employee.name
# => NoMethodError: undefined method `name' for nil:NilClass
```

In order to prevent this behaviour, ruby has the & operator (since version 2.3) which behaves a bit like the try method in rails. It tries to fetch the object attribute and returns nil if any element in the chain is nil. For instance:

```ruby
korium = Company.new(nil)

puts korium&.employee&.name
# => nil

google = Company.new(bobby)
puts google&.employee&.name
# => Bobby
```

### Les procs

Finally I’d like to share a ruby idiom which allows to nicely shorten some statements and improve readability :)

You may have already seen things such as:

```ruby
[1,2,3].reduce(&:+)
# => 6

[1,2,3].map(&:to_s)
# => ["1", "2", "3"]
```

When ruby sees the & followed by a symbol, it calls the to_proc method on the symbol and passes the proc as a block to the method.

The above examples are equivalent to writing:

```ruby
[1,2,3].reduce(0) do |sum, num|
  sum + num
end
# => 6

[1,2,3].map do |n|
  n.to_s
end
# => ["1", "2", "3"]
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
