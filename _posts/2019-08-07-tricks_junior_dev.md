---
layout: post
title:  "Méthodes Ruby Utiles"
author: alexandre
status: draft
---

# Méthodes Ruby pour niveaux intermédiaires

## `||=` Assigner une valeur si et seulement elle n'est pas déjà définie

On assigne une valeur à une variable si et seulement si elle n'est pas précédemment définie dans le code ou si sa valeur est falsey (càd `nil` ou `false`).

```
foo = "bar"

nil_variable = nil
nil_variable ||= foo
# nil_variable est égale à la string bar

false_variable = false
false_variable ||= foo
# false_variable est égale à la string bar

not_defined_variable ||= foo
# not_defined_variable est égale à la string bar

content = "I already have some content"
content ||= foo
# => "I already have some content" --> The content variable is not reassigned and keeps its initial value
```

## Safe navigation operator: &

This one allows to navigate safely through the layers of objects relations. Basically, let’s say that we have a company with only one employee and that this employee has a name and an email address:

```
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

```
puts korium.employee.name
# => Bobby
```

However, this only works in an environment where none of the elements in the chain (except possibly for the last one) can be nil. Now, let’s imagine a case where the company does not really have any employee. The korium object would be instantiated as follows and the above code would raise an error:

```
korium = Company.new(nil)

puts korium.employee.name
# => NoMethodError: undefined method `name' for nil:NilClass
```

In order to prevent this behaviour, ruby has the & operator (since version 2.3) which behaves a bit like the try method in rails. It tries to fetch the object attribute and returns nil if any element in the chain is nil. For instance:

```
korium = Company.new(nil)

puts korium&.employee&.name
# => nil

google = Company.new(bobby)
puts google&.employee&.name
# => Bobby
```

## Symbol#to_proc

Finally I’d like to share a ruby idiom which allows to nicely shorten some statements and improve readability :)

You may have already seen things such as:

```
[1,2,3].reduce(&:+)
# => 6

[1,2,3].map(&:to_s)
# => ["1", "2", "3"]
```

When ruby sees the & followed by a symbol, it calls the to_proc method on the symbol and passes the proc as a block to the method.

The above examples are equivalent to writing:

```
[1,2,3].reduce(0) do |sum, num|
  sum + num
end
# => 6

[1,2,3].map do |n|
  n.to_s
end
# => ["1", "2", "3"]
```
 ## send

# Send

Exemple avec un nom de méthode dynamique sur un objet
