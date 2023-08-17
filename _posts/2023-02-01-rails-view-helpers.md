---
layout: post
title:  "Les meilleurs helpers dans Ruby on Rails"
description: "Quels sont mes meilleurs View Helpers dans Rails ?"
seo_description: "Rails view helpers"
difficulty: 1
status: tech
---

Avant de commencer, il me faut rappeler qu'en théorie dans le pattern *MVC* on ne doit pas mettre de logique dans les vues. Mais parfois, il est juste impossible de mettre la logique ailleurs que dans une vue. Et c'est à ça que servent les **helpers**.

## Des exemples de code qui peuvent être importés dans n'importe quel projet

Voici un module simple pour afficher des dates qui est presque dans tous mes projets

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

Et un autre qui concerne l'affichage nombres

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

Les helpers sont aussi très pratique pour choisir une classe css pour un label, <a href="https://getbootstrap.com/docs/4.0/components/badge/" class="underlined" target="_blank">ici un label Bootstrap</a>

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

## Des helpers qui retourne des partials, bonne ou mauvaise idée ?

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
                     classes:       classes }
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

Ce `embed_svg` permet ensuite de le manipuler en css, ce que ne te permet pas `image_tag`. Par exemple bien pratique quand il faut changer la couleur au hover. Sans cette méthode, pour manipuler le svg, tu serais obligé de le mettre en inline dans le code source sur svg. Il existe la gem <a href="https://github.com/jamesmartin/inline_svg" class="underlined" target="_blank">inline_svg</a> qui fait à peu près la même chose. Enfin sur son blog <a href="https://www.akshaykhot.com/how-to-render-svg-icons-in-rails/?ref=akshays-blog-newsletter" class="underlined" target="_blank">Akshay</a> a une approche similaire.



## Comment gémifier ses helpers ?

Pour des helpers très génériques, on peut regrouper ces helpers dans une gem. Il y'a un bon exemple de repo de ce type avec la gem <a href="https://github.com/guillaumebriday/external_link_to" class="underlined" target="_blank">external_link_to</a>.

## Mes helpers préférés dans Rails

Attention à ne pas reécrire des *helpers* qui existe déjà. Voici une liste non-exhaustive de mes *helpers* préférés dans Rails.

```ruby
number_to_currency(50) # "$ 50"
number_to_human(10_000) # "10 Thousand"
time_ago_in_words(Time.now) # "less than a minute"
time_ago_in_words(2.years.ago) # "about 2 years"
distance_of_time_in_words(Time.now, 15.minutes.ago) # 15 minutes
```

## Pour aller plus loin

Si vous voulez en savoir plus, je vous recommande <a href="https://blog.appsignal.com/2023/02/01/a-guide-to-rails-view-helpers.html?utm_source=alexandrebouvier.fr" class="underlined" target="_blank">cet article</a> en anglais du blog AppSignal.
