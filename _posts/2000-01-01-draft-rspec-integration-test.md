# Tester vos features avec Rspec

Il existe plusieurs famille de test. Nous allons ici présenter les tests d'intégration qui sont la pour simuler le comportement d'un utilisateur.

Pour commencer il vous faudra installer la gem `Rspec` ainsi que `Capybara`. Un test se décompose toujours en 3 étapes:

* setup
* actions
* assertions

## Première étape : le setup

### Créer les variables

Soit avec FactoryBot pour éviter les répétitions, soit à la mano.

```ruby
# créer les bonnes variables
# se connecter
```

## Deuxième étape : les actions

### Se connecter si nécessaire
```ruby
# se connecter
```

### Visiter la page

```ruby
visit edit_advanced_admin_project_path(room.project)
```

### Click on a button

```ruby
click_on(class: 'delete-button')
click_on "Update"
```

## Troisème étape : tester nos assertions

### Mail envoyé


### Object transformé

```ruby
expect(Room.all.count).to eq(counter - 1)
```
## Bonus: débuguer son test

Si votre test ne passe pas sans raison apparente, vous pouvez screenshoter la page. À l'intérieur d'un `it`, il faut utiliser la fonction `save_and_open_page`.
