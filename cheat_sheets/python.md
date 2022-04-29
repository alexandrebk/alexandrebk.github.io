---
layout: cheat_sheet
title: Cheat Sheet Python
permalink: /cheat_sheets/python
---

List comprehension

```python
new_movies = [movie.method() for movie in movies]
```

For on dict

```python
beatles = {'john': 'guitar', 'paul': 'bass', 'george': 'guitar', 'ringo': 'drum'}
for beatle, instrument in beatles.items():
    print(f'{beatle.capitalize()} plays the {instrument}')
```

Zip method

```python
for (x, y) in zip(['a','b','c'], [1,2,3]):
    print(x,y)

# returns ('a', 1), ('b', 2), ('c', 3)
```

Ternary operator

```python
value_if_true if condition else value_if_false
```

Arguments et keyword arguments pour les fonctions

```python
def foo(required, *args, **kwargs):
    """This is the function docstring"""
    print(required)
    if args:
        print(args)
    if kwargs:
        print(kwargs)

foo(1, 2, 3, bar = 5)
# 1
# (2, 3)
# {'bar': 5}

```

Type Checking

```python
def say_hi(name: str) -> str:
    return name + ' says Hi!'
```

Python Decorators

```python
def my_decorator(func):
    def wrapper():
        print("I'm before the method call")
        func()
        print("I'm after the method call")
    return wrapper

@my_decorator
def say():
    print("hi!")

say()
# I'm before the method call
# hi!
# I'm after the method call
```
