---
layout: cheat_sheet
title: Cheat Sheet Pandas
permalink: /cheat_sheet_pandas
---

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

Sample

```python
sample_orders = orders.sample(n=10_000, random_state=1)
```

Drop columns

```python
orders = orders.drop(['customer_id', 'order_estimated_delivery_date'], axis=1)
```

Merge dataframe

```python
df = df1.merge(df2, on='id')
```

Map

```python
orders.revies_score.map({5:1, 4:0, 3:-1, 2:-1, 1:-1})
```

Map pour une Series Pandas

```python
series.map(function)
Series.map({mapping dict})
```

Apply pour un DataFrame

```python
df.apply(lambda col: col.max(), axis = 0)     # default axis
df.apply(lambda row: row[‘A’] + row[‘B’], axis = 1)
df.applymap(my_funct_for_indiv_elements)
    df.applymap(lambda x: '%.2f' % x)
```

Groupby avec apply et agg

```python
group = df.groupby('col_A')
group.mean()
group.apply(np.mean)
group.agg({
    col_A: ['mean', np.sum],
    col_B: my_custom_sum,
    col_B: lambda s: my_custom_sum(s)
    })

group.apply(custom_mean_function)
```

Matplotlib

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(1,2, figsize=(20,10))
# Regression
g = sns.regplot(data=orders, x='review_score', y='wait_time', ax=ax[0])
f = sns.regplot(data=orders, x='review_score', y='delay_vs_expected', ax=ax[1])
# Limite du graphique
g.set(ylim=(0, 50))
f.set(ylim=(-30, 30))
```

