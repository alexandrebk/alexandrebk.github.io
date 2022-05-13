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
remove_reference :table_name, :reference_model, index: true
remove_column :products, :part_number, :string
rename_column :table_name, :old_column, :new_column
change_column :products, :part_number, :text
change_column_default :products, :approved, from: true, to: false
drop_table :table_name
```

Obliger la présence d'un first name et d'un last name

```ruby
validates_presence_of :first_name, :last_name
validates :category, inclusion: { in: ["sports", "clothing", "technology"] }
```

Ajouter un message d'erreur

```ruby
errors.add(:amount_base, 'Le montant de la facture de solde doit être égale au solde restant du devis')
```

Scope

```ruby
scope :published, -> { where(published: true) }
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

Les gems

```bash
bundle open activerecord # ouvrir le code source
bundle info activerecord # voir le path
```
