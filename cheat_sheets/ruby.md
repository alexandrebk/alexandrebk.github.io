---
layout: cheat_sheet
title: Cheat Sheet Ruby
permalink: /cheat_sheets/ruby
---

### Rspec and Capybara

Expect a field to equal a value

```ruby
expect(page.find_field('invoice_amount_base').value).to eq '1000'
```

Select field in select input

```ruby
select 'Solde', from: 'invoice_invoice_type'
```

Fill in input text with a value

```ruby
fill_in 'invoice_amount_total', with: 1
```

Cliquez sur un bouton avec alerte JS

```ruby
page.accept_confirm { click_on 'Créer la facture' }
```

Submit un formulaire qui n'a pas de bouton

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

Nouveau fichier de test

```ruby
require 'rails_helper'

RSpec.describe '...' do

end
```

### Active record

Ajouter une colonne dans une migration

```ruby
add_column :products, :title, :string
```

Ajouter un index dans une migration

```ruby
add_index :products, :title
```

Ajouter une référence d'une autre table

```ruby
add_reference :products, :user, foreign_key: true
```

Ajouter une référence polymorphique

```ruby
add_reference :products, :supplier, polymorphic: true
```

Obliger la présence d'un first name et d'un last name

```ruby
validates_presence_of :first_name, :last_name
```

Ajouter un message d'erreur

```ruby
errors.add(:amount_base, 'Le montant de la facture de solde doit être égale au solde restant du devis')
```

Joindre 2 tables

```ruby
Order.joins(:products)
```

Inclure une autre table à une requête pour éliminer les query N+1

```ruby
Order.includes(:products)
```

Récupérer des informations sur une query

```ruby
Order.joins(:products).explain
```


### CSS / Bootstrap

Aligner horizontalement et verticalement un contenu

```html
d-flex justify-content-center align-items-center
```

Grille avec 3 colonnes

```css
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-gap: 16px;
```
