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
  has_many :articles, strict_loading: true # avoid N+1 query
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
Post.where(created_at: 1.week.ago..) # Find all posts created in the last week
```

Where avec un ilike (i pour case Insentitive)

```ruby
Post.where("title ILIKE ?", "%blog%")
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

Has Nested Attributes (<a href="https://api.rubyonrails.org/classes/ActiveRecord/NestedAttributes/ClassMethods.html" class="underlined" target="_blank">Rails documentation</a>)

```ruby
class Book < ActiveRecord::Base
  has_one :author
  has_many :pages

  accepts_nested_attributes_for :author, :pages
end
```

Money rails <a href="https://github.com/RubyMoney/money-rails" class="underlined" target="_blank">lien de la gem</a>

```ruby
class Product
  monetize :price_cents
end

Product.last.price #=> #<Money cents:100 currency:EUR>
```

Counter cache pour les relations

```ruby
class Items
  belongs_to :orders, counter_cache: true
end

class AddItemsCountToOrders < ActiveRecord::Migration[7.0]
  def change
    add_column :orders, :items_count, :integer, default: 0, null: false
  end
end
```

Différence entre present? et any?

```ruby
User.where(sign_in_count: 5).present?
# SELECT * FROM "users" WHERE "users"."sign_in_count" = 5
User.where(sign_in_count: 5).exists?
# SELECT * FROM "users" WHERE "users"."sign_in_count" = 5 LIMIT 1
```

<h2>Des articles pour aller plus loin sur les bases de données dans Rails :</h2>

<a href="https://www.honeybadger.io/blog/avoid-race-condition-in-rails/" class="underlined" target="_blank">Les Transactions et Race Conditions dans Rails</a>
<br>
<a href="https://shopify.engineering/changing-polymorphic-type-rails" class="underlined" target="_blank">
  Un autre moyen de faire du polymorphisme dans Rails par Shopify
</a>
