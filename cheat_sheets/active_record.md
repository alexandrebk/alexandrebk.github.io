---
layout: cheat_sheet
title: Cheat Sheet Active Record
permalink: /cheat_sheets/active_record
---

Générer un model post

```bash
rails generate model Post title:string likes:integer
```

Migrations (<a href="https://guides.rubyonrails.org/active_record_migrations.html" class="underlined" target="_blank">Rails documentation</a>)

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

Validations (<a href="https://guides.rubyonrails.org/active_record_validations.html" class="underlined" target="_blank">Rails documentation</a>)

```ruby
class Order
  validates_presence_of :first_name, :last_name
  validates :category, inclusion: { in: ["sports", "clothing", "technology"] }
  validates :first_name, uniqueness: { scope: :last_name }
  validates :password, confirmation: true, unless: -> { password.blank? }
  validates :rating, numericality: { greater_than: 0 }
  validates :email, format: { with: /\A.*@.*\.com\z/ }
end
```

Ajouter un message d'erreur

```ruby
errors.add(:amount_base, 'Le montant de la facture de solde doit être égale au solde restant du devis')
```

Has many

```ruby
class Author
  has_many :articles
  has_many :comments, through: :articles
  has_many :authorized_articles, -> { where(allowed: true) }, class_name: 'Articles'
end
```

Scope

```ruby
class Post
  scope :published, -> { where(published: true) }
end
```

Migration avec des uuid à la place des id

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

Generating Secure Tokens on Your ActiveRecord Models

```ruby
class User < ApplicationRecord
  has_secure_token :access_code, length: 30
end

class AddAccessCodeToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :access_code, :string
  end
end
```

Joindre 2 tables

```ruby
Order.joins(:products)
```

Inclure une autre table à une requête pour éliminer les query N+1

```ruby
Order.includes(:products)
```

Joindre une autre table mais ne renvoie que les orders

```ruby
Order.joins(:products).where(products: { name: 'Play Station'})
```

Récupérer des informations sur une query (détail de la requête plus query planner)

```ruby
Order.all.explain
```

Where avec une date

```ruby
# Find all posts created in the last week
Post.where(created_at: 1.week.ago..)

# Find all posts having less than 10 likes
Post.where(likes: 1.week.ago..)
```

Where avec un like

```ruby
Post.where("title LIKE ?", "%blog%")
```

Where avec une longue query

```ruby
sql_query = <<~SQL
  movies.title ILIKE :query
  OR movies.synopsis ILIKE :query
  OR directors.first_name ILIKE :query
SQL
Movie.joins(:director).where(sql_query, query: "%blog%")
```

Callback (<a href="https://guides.rubyonrails.org/active_record_callbacks.html" class="underlined" target="_blank">Rails documentation</a>)

```ruby
class User < ApplicationRecord
  before_validation :ensure_login_has_a_value

  private

  def ensure_login_has_a_value
    if login.nil?
      self.login = email unless email.blank?
    end
  end
end
```

Friendly Url in routes with #to_param

```ruby
class User < ApplicationRecord

  def to_params
    "#{id}-#{title.parameterize}"
  end
end
```

<h2>Des articles pour aller plus loin sur les bases de données dans Rails :</h2>

<a href="https://blog.appsignal.com/2020/01/22/rails-is-fast-optimize-your-view-performance.html" class="underlined" target="_blank">Résoudre et les problèmes de query N+1</a>
<br>
<a href="https://www.honeybadger.io/blog/avoid-race-condition-in-rails/" class="underlined" target="_blank">Les Transactions dans Rails</a>
<br>
<a href="https://shopify.engineering/changing-polymorphic-type-rails" class="underlined" target="_blank"> Le Polymorphisme dans Rails</a>
<br>
<a href="https://blog.appsignal.com/2022/01/26/test-and-optimize-your-ruby-on-rails-database-performance.html" class="underlined" target="_blank">Comment optimiser sa base de données sour Rails</a>
<br>
<a href="https://apidock.com/rails/ActiveRecord/Associations/CollectionProxy/build" class="underlined" target="_blank">CollectionProxy#build : build a collection of objects related to another </a>
