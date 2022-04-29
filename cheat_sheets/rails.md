---
layout: cheat_sheet
title: Cheat Sheet Rails
permalink: /cheat_sheets/rails
---

Migration

```ruby
add_column :products, :title, :string
add_index :products, :title
add_reference :products, :user, foreign_key: true
add_reference :products, :supplier, polymorphic: true
remove_column :products, :part_number, :string
change_column :products, :part_number, :text
change_column_default :products, :approved, from: true, to: false
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
