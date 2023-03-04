---
layout: post
title:  "Les meilleurs helpers dans Ruby on Rails"
description: "Quels sont mes meilleurs View Helpers dans Rails ?"
seo_description: "Rails view helpers"
difficulty: 1
status: tech
---

Avant de commencer, il me faut rappeler qu'en théorie dans le pattern *MVC* on ne doit pas mettre de logique dans les vues. Par ailleurs, our certains comportements peu complexes, il serait aussi dommage de surcharger un *controller*. Et même parfois, il est juste impossible de mettre la logique ailleurs que dans une vue. C'est à ça que servent les *helpers*. Par exemple pour afficher des boutons ou des textes différents en fonction du type d'utilisateur.

## Des exemples de code qui peuvent être importés dans n'importe quel projet

Voici un module pour les dates qui est dans tous mes projets

```ruby
module DatesHelper
  def display_date(date)
    return '' if date.nil?

    date.strftime('%d/%m/%Y')
  end

  def display_date_month_shortened(date)
    return '' if date.nil?

    date.strftime('%d %b. %Y')
  end

  def display_date_and_time(date)
    return '' if date.nil?

    date.strftime('%d/%m/%Y à %H:%M')
  end
end
```

Et un autre qui concerne les nombres

```ruby
module NumberHelper
  def two_digit_number(number)
    ('%.2f' % number).gsub(".",",")
  end

  def monetary_amount_rounded_with_suffixe(amount, vat_rate = nil)
    "#{monetary_amount_rounded(amount,vat_rate)} (#{vat_rate == nil ? "HT" : "TTC"})"
  end

  def amount_with_vat(amount, vat_rate = nil)
    number_to_currency(amount * ( 1 + vat_rate.to_f), precision: 2)
  end

  def humanized_vat(rate)
    "#{'%.2f' % (rate * 100)} %"
  end

  def humanized_rate_without_decimals(rate)
    "#{(rate * 100).round(0)}%"
  end
end
```

Les helpers sont aussi très pratique pour choisir une classe css pour un label, <a href="https://getbootstrap.com/docs/4.0/components/badge/" class="underlined" target="_blank">ici un lable Bootstrap</a>

```ruby
module InvoiceHelper
  def badge_color(invoice)
    case invoice.payment_status
    when 'paid'
      'badge-success'
    when 'waiting'
      'badge-secondary'
    end
  end
end
```

Enfin vous pouvez utiliser un helper pour vos meta tag comme expliqué <a href="https://www.lewagon.com/blog/setup-meta-tags-rails" class="underlined" target="_blank">ici</a>.

## Des gems qui retourne des partials, bonne ou mauvaise idée ?

Parfois, on a envie de faire un helper qui rend plus qu'une ligne de HTML. Dans ce cas la on peut render une partial. Attention toutefois à ne pas mettre de logique dans la partial.

```ruby
module NavbarHelper
  def clipboard_button(button_title, text_to_copy, feedback_text = '✔︎ Copied!')
    render partial: 'clipboard_button',
           locals: { button_title:  button_title,
                     text_to_copy:  text_to_copy,
                     feedback_text: feedback_text }
  end

  def share_button(button_title, text_to_copy, classes: '', feedback_text: '✔︎ Copied!')
    render partial: 'share_button',
           locals: { button_title:  button_title,
                     text_to_copy:  text_to_copy,
                     feedback_text: feedback_text,
                     classes:       classes}
  end

  def toto

  end
end
```

## Un helper pour ses SVG, pourquoi faire ?

```ruby
module SvgHelper
  def embedded_svg(filename, options = {})
    file = File.read(Rails.root.join('app', 'assets', 'images', filename))
    doc = Nokogiri::HTML::DocumentFragment.parse file
    svg = doc.at_css 'svg'
    svg['class'] = options[:class] if options[:class].present?
    doc.to_html.html_safe
  end
end
```

Ce `embed_svg` permet ensuite de le manipuler en css, ce que ne te permet pas `image_tag`. Par exemple bien pratique quand il faut changer la couleur au hover. Sans cette méthode, pour manipuler le svg, tu serais obligé de le mettre en inline dans le code source sur svg.

## Comment gémifier ses helpers ?

Quand on a trop, il y'a un bon exemple de repo c'est la gem <a href="https://github.com/guillaumebriday/external_link_to" class="underlined" target="_blank">external_link_to</a> de l'excellent Guillaume Briday.

## Mes helpers préférés dans Rails

Attention à ne pas reécrire des *helpers* déjà existant déjà. Voici une liste non-exhaustive de mes *helpers* préférés dans Rails.

```ruby
number_to_currency(50) # "$ 50"
number_to_human(10_000) # "10 Thousand"
time_ago_in_words(Time.now) # "less than a minute"
```

## Pour aller plus loin

Si vous voulez en savoir plus, je vous recommande <a href="https://blog.appsignal.com/2023/02/01/a-guide-to-rails-view-helpers.html" class="underlined" target="_blank">cet article</a> en anglais du blog AppSignal.
