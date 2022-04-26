---
layout: cheat_sheet
title: Cheat Sheet Python
permalink: /cheat_sheet_python
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
