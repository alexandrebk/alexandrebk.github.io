---
layout: cheat_sheet
title: Cheat Sheet Rails
permalink: /cheat_sheets/rails
---

Commandes Rails

```bash
rails _version_ new app_name --database=postgresql
rails generate model Post title:string likes:integer
rails generate controller Post
rails tmp:clear # delete tmp files
rails log:clear # delete logs
rails notes     # search for TODO
rails dbconsole # database console
rails stats     # thousands of lines of code and test ratio
rails about     # information about your application's environment
rails runner path/script.rb # exécuter un fichier
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
validates_presence_of :first_name, :last_name
validates :category, inclusion: { in: ["sports", "clothing", "technology"] }
validates :first_name, uniqueness: { scope: :last_name }
validates :password, confirmation: true, unless: -> { password.blank? }
validates :rating, numericality: { greater_than: 0 }
```

Ajouter un message d'erreur

```ruby
errors.add(:amount_base, 'Le montant de la facture de solde doit être égale au solde restant du devis')
```

Has many

```ruby
class Author
  has_many :articles
  has_many :authorized_articles, -> { where(allowed: true) }, class_name: 'Articles'
end
```

Scope

```ruby
scope :published, -> { where(published: true) }
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
Time.current.since(60 * 60)
# Same as
1.hour.from_now
```

Active Job (<a href="https://guides.rubyonrails.org/active_job_basics.html" class="underlined" target="_blank">Rails documentation</a>)


```ruby
MyJob.perform_now
```

Active Storage (<a href="https://edgeguides.rubyonrails.org/active_storage_overview.html" class="underlined" target="_blank">Rails documentation</a>)

```ruby
url_for(post.image)
```

Params

```ruby
params[:return_to].present? ? params[:return_to] : root_url

# SAME AS

params[:return_to].presence || root_url
```

Mail To

```erb
<% mail_to "alex@bouvier.fr",
           "Nouvel email",
           subject: "Hi, Alex!",
           body: "J'adore ton blog"
%>
```

Informations sur les gems (valable aussi pour tout projet avec un Gemfile)

```bash
bundle open activerecord # ouvrir le code source
bundle info activerecord # voir le path
bundle update rails      # mettre à jour
```

CLI Scalingo

```bash
git remote add scalingo git@ssh.osc-fr1.scalingo.com:app-name.git
scalingo run bundle exec rails console
```

CLI Heroku

```bash
heroku run rails console
heroku run rails db:migrate
heroku logs --tail
heroku config:set ADMIN_PASSWORD='password'
```
