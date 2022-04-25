---
layout: cheat_sheet
title: Cheat Sheet
permalink: /cheat_sheet/
---

### Python

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

### Pandas

```python
import numpy as np
import pandas as pd
```

Import csv file

```python
tracks_df = pd.read_csv('data/tracks.csv')
```

Read data with column name

```python
tracks_df[['artists', 'name']].head()
```

Group By

```python
missing_reviews.groupby('order_status').count()
```

Convert to DateTime

```python
gas_df["Month"] = pd.to_datetime(gas_df["Month"], format="%Y-%m-%d")
```

Boolean indexing or Filter by condition

```python
undelivereds = orders_df[orders_df["order_status"] != 'delivered']
```

### Matplotlib

```python
import matplotlib.pyplot as plt
```
