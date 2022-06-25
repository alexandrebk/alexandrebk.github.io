---
layout: cheat_sheet
title: Cheat Sheet Ruby
permalink: /cheat_sheets/ruby
---

Word Array

```ruby
array = %w(toto titi) # => ["toto", "titi"]
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

### Vocabulaire

| Nom               | Définition |
|-------------------|---------------------------------------------------------------------------------|
| Monkey Patching   | Redéfinir une classe au runtime. C'est potentiellement dangereux |
| self              | C'est le receveur par défaut de la méthode que vous appellez |
| Singleton methods | Méthode pour un seul objet |
| Eigenclass        | Classe entre l'objet et sa classe. C'est la qu'on définit les singleton methods |
| Unary Operator    | Opérateur qui fonctionne avec 1 valeur (`!`, `*`, `&`, etc.) |
| Binary Operator   | Opérateur qui fonctionne avec 2 valeurs (`+`, `-`, `||=`, etc.) |
| Ternary Operator  | Opérateur qui fonctionne avec 3 valeurs `condition ? true : false` |
| Eager Loading     | Charger tous les fichiers au démarrage de l'application |
| Autoloading       | Seulement charger les fichier quand on fait appel à eux |
| DSL               | Domain Specific Language |
| SRP               | Single Responsability Principle |

### Rspec and Capybara

Nouveau fichier de test

```ruby
require 'rails_helper'

RSpec.describe '...' do

end
```

Expect a field to equal a value

```ruby
expect(page.find_field('invoice_amount_base').value).to eq '1000'
```

Select field in select input

```ruby
select 'Solde', from: 'invoice_invoice_type'
```

Fill in input text

```ruby
fill_in 'invoice_amount_total', with: 1
```

Cliquez sur un bouton avec alerte JS

```ruby
page.accept_confirm { click_on 'Créer la facture' }
```

Submit un formulaire qui n'a pas de bouton submit

```ruby
form = find '.search'
Capybara::RackTest::Form.new(page.driver, form.native).submit({})
```

Within pour trouver du texte avec un selecteur css

```ruby
within '.flash' do
  expect(page).to have_content('Merci pour votre retour')
end
```
