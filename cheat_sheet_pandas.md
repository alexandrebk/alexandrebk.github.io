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

Import Matplotlib

```python
import matplotlib.pyplot as plt
```
