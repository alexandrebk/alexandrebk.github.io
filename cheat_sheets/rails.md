---
layout: cheat_sheet
title: Cheat Sheet Rails
permalink: /cheat_sheets/rails
---

Commandes Rails

```bash
rails _rails.version_ new app_name --database=postgresql
rails generate model Post title:string likes:integer
rails generate controller Post
rails tmp:clear # delete tmp files
rails log:clear # delete logs
rails notes     # search for TODO
rails dbconsole # database console
rails stats     # thousands of lines of code and test ratio
rails about     # information about your application's environment
rails db:reset  # drop database + create tables found in schema.rb
rails routes --unused # unused routes
rails runner path/script.rb # exécuter un fichier
bundle audit    # print gem with criticality security file
bundle outdated # print table with current and latest gem version
```

Active Support

```ruby
Time.current.since(60 * 60)
# Same as
1.hour.from_now
Time.current.all_day # Range
Time.current.all_week # Range
Time.current.all_month # Range
```

Active Job (<a href="https://guides.rubyonrails.org/active_job_basics.html" class="underlined" target="_blank">Rails documentation</a>)

```ruby
MyJob.perform_now
```

Active Storage (<a href="https://edgeguides.rubyonrails.org/active_storage_overview.html" class="underlined" target="_blank">Rails documentation</a>)

```ruby
url_for(post.image)
```


Seed with active storage

```ruby
require "open-uri"

file = URI.open("https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/NES-Console-Set.jpg/1200px-NES-Console-Set.jpg")
product = Product.new(title: "NES", body: "A great console")
product.picture.attach(io: file, filename: "nes.png", content_type: "image/png")
product.save
```

Hash#presence

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
           body: "J'adore ton blog" %>
```

Informations sur les gems (valable aussi pour tout projet avec un Gemfile)

```bash
bundle open activerecord # ouvrir le code source
bundle add activerecord  # ajoute au Gemfile et ca fait le bundle install
bundle info activerecord # voir le path
bundle show activerecord # voir le path (deprecated)
bundle update rails      # mettre à jour
```

String Inquirer ([source](https://apidock.com/rails/ActiveSupport/StringInquirer))

```ruby
class Order < ApplicationRecord
  AUTHORIZED_CATEGORIES = ['api', 'default']

  def category
    super&.inquiry
  end
end

order.category.api?
order.category.default?
```

Routing in multiples files

```ruby
Rails.application.routes.draw do
  draw :api
end

# config/routes/api.rb
namespace :api do
  resources :orders
end
```

Afficher les query SQL dans les logs en production ([source](https://stackoverflow.com/questions/2936000/how-to-show-sql-queries-run-in-the-rails-console/73826402#73826402))

```ruby
ActiveRecord::Base.logger.extend(
  ActiveSupport::Logger.broadcast(ActiveSupport::Logger.new(STDOUT))
)
ActiveRecord::LogSubscriber.attach_to :active_record
```

Source location:

```ruby
User.method(:find_by).source_location
# ["/Users/alexandrebouvier/.rbenv/versions/3.3.5/lib/ruby/gems/3.3.0/gems/activerecord-7.1.4/lib/active_record/core.rb", 256]
```

<h2>Liste de gems utiles pour les projets</h2>

- [An email validator for Rails](https://github.com/K-and-R/email_validator)
- [Annotate Rails classes with schema and routes info](https://github.com/ctran/annotate_models)
- [strip_attributes for Active Record: If the attribute is blank, it strips the value to nil by default](https://github.com/rmm5t/strip_attributes)
- [Nilify blanks](https://github.com/rubiety/nilify_blanks)

<h2>Des articles pour aller plus loin</h2>

<a href="https://www.lewagon.com/blog/setup-meta-tags-rails" class="underlined" target="_blank">
  Setup des meta data dans Rails
</a>
<br>
<a href="https://dev.to/ahmadraza/mastering-eager-loading-and-beyond-rails-7-5eie"
   class="underlined"
   target="_blank">
  Mastering Eager Loading and Beyond! Rails 7 (includes, join, preload)
</a>
<br>
<a href="https://medium.com/@ungrandjour/how-to-build-skeleton-loaders-in-rails-with-ajax-and-very-little-js-b9177956f88b"
   class="underlined"
   target="_blank">
  How to build skeleton screens for Ajax responses in Ruby On Rails with minimum JS
</a>
<br>
<a href="https://discuss.rubyonrails.org/t/active-storage-in-production-lessons-learned-and-in-depth-look-at-how-it-works/83289"
   class="underlined"
   target="_blank">
  Active Storage: How it works
</a>
<br>
<a href="https://dev.to/haseebeqx/notes-on-performance-optimization-in-rails-applications-36cg"
   class="underlined"
   target="_blank">
  Notes on Performance Optimization in Rails Applications
</a>
<br>
<a href="https://railsinspire.com/"
   class="underlined"
   target="_blank">
  Rails inspire: A curated collection of code samples from Ruby on Rails projects
</a>
<br>
<a href="https://allaboutcoding.ghinda.com/first-commits-in-a-ruby-on-rails-app"
   class="underlined"
   target="_blank">
  First commits in a Ruby on Rails app
</a>
<br>
<a href="https://ouidou.fr/2020/11/12/rails-nest-pas-simple/"
   class="underlined"
   target="_blank">
  Rails n’est pas simple !
</a>
<br>
<a href="https://gist.github.com/DRBragg/fee79a67b5c8862b1fe0852f4e7ba428"
   class="underlined"
   target="_blank">
  Rails Active Storage Cheatsheet
</a>
