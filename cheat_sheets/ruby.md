---
layout: cheat_sheet
title: Cheat Sheet Ruby
permalink: /cheat_sheets/ruby
---

Array

```ruby
array = %w(hello world) # => ["hello", "world"]
```

Number

```ruby
"%.2f" % 10    # => "10.00"
 "%.2f €" % 10 # => "10.00 €"
```

Eval

```ruby
a, b = [1, 2] , 3
eval("a << b") # => [1, 2, 3]
```

Multiline string

```ruby
string = <<STRING
Hello John
How are you today ?
Goodbye
STRING
# => "Hello John\nHow are you today ?\nGoodbye\n"
```

Case

```ruby
case year
  when 1970..1979: "disco"
  when 1980..1989: "eighties"
  when 1990..1999: "dance"
  else "RnB"
end
```

Dynamic dispatch

```ruby
object.send(:my_method)
```

Dynamic method

```ruby
define_method(:my_method) do |foo, bar| # or even |*args|
  # do something
end
# est équivalent
def my_method(foo, bar)
  # do something
end
['draft','waiting','paid'].each do |status|
  define_method("#{status}?") { self.status == status }
end
```

Chercher des méthodes dans une classe

```ruby
String.instance_methods # => [:encode, :encode!, :include?, :%, :*, :+, :count, ...]
String.instance_methods(false) # sans les méthodes héritées
String.instance_methods(false).grep(/what/) # => [:count]
```

Les procs pour transformer un bloc en code

```ruby
stringify = proc { |object| object.to_s }
(1..10).map(&stringify) # => ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
```

Source code

```ruby
User.new.method(:confirmed?).source.display
User.instance_method(:confirmed?).source.display

# will print

def confirmed?
  !!confirmed_at
end
```


Erreurs

```ruby
begin
  # someting that may fail
rescue
  # someting to execute in case of failure
else
  # someting to execute in case of success
ensure
  # something that will always execute
end
```

Structure d'une gem

```
gem_name/
├── bin/
│   └── gem_name
├── lib/
│   └── gem_name.rb
├── test/
│   └── test_gem_name.rb
├── README
├── Rakefile
└── gem_name.gemspec
```

### Vocabulaire

- Monkey Patching   : Redéfinir une classe au runtime. C'est potentiellement dangereux
- self              : C'est le receveur par défaut de la méthode que vous appellez
- Singleton methods : Méthode pour un seul objet
- Eigenclass        : Classe entre l'objet et sa classe. C'est la qu'on définit les singleton methods
- Unary Operator    : Opérateur qui fonctionne avec 1 valeur (`!`, `*`, `&`, etc.)
- Binary Operator   : Opérateur qui fonctionne avec 2 valeurs (`+`, `-`, `||=`, etc.)
- Ternary Operator  : Opérateur qui fonctionne avec 3 valeurs `condition ? true : false`
- Eager Loading     : Charger tous les fichiers au démarrage de l'application
- Autoloading       : Seulement charger les fichier quand on fait appel à eux
- DSL               : Domain Specific Language
- SRP               : Single Responsability Principle
