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

Récupérer des informations sur une query (détail de la requête plus query planner)

```ruby
Order.joins(:products).explain
```

Where

```ruby
# Find all posts created in the last week
Post.where(created_at: 1.week.ago..)

# Find all posts having less than 10 likes
Post.where(likes: 1.week.ago..)
```

Active Support

```ruby
1.hour.from_now
# Same as
Time.current.since(60 * 60)
```

Changer les ids en uuid

```ruby
class CreateOrders < ActiveRecord::Migration[7.0]
  def change
    create_table :orders, id: :uuid do |t|
      t.float :amount
      t.timestamps
    end
  end
end
```

Informations sur les gems (pour tout projet avec un Gemfile)

```bash
bundle open activerecord # ouvrir le code source
bundle info activerecord # voir le path
bundle update rails      # mettre à jour
```

Ouvrir un navigateur pour débuguer Rspec

```ruby
save_and_open_page
```

Scalingo

```bash
git remote add scalingo git@ssh.osc-fr1.scalingo.com:app-name.git
scalingo run bundle exec rails console
```

Commandes Rails

```bash
rails tmp:clear # delete tmp files
rails log:clear # delete logs
rails notes     # search for TODO
rails dbconsole
rails runner path/script.rb
```
