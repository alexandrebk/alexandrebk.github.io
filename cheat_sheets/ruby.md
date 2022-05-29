---
layout: cheat_sheet
title: Cheat Sheet Ruby
permalink: /cheat_sheets/ruby
---

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

```ruby
array = %w(toto titi)
```
