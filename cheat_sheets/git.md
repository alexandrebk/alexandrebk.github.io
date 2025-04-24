---
layout: cheat_sheet
title: Cheat Sheet Git
permalink: /cheat_sheets/git
---

Rebase process

```bash
git rebase master -i
git add .
git rebase --continue
```

Rebase sans changer de branches

```bash
git fetch origin features/toto:features/toto
git rebase features/toto
```

Ajouter une remote

```bash
git remote add origin git@github.com:username/existing_project.git
```

Ajouter un fichier dans le précédent commit

```bash
git commit --amend --no-edit
```


Auto Setup Remote for push

```bash
git config --global push.autoSetupRemote true
```

Open git in your browser

```bash
git instaweb
```

Clean up (Git Garbage Collector)

```bash
git gc
```
