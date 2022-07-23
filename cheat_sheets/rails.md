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
rails db:reset  # drop database + create tables found in schema.rb
rails runner path/script.rb # exécuter un fichier
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
