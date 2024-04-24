---
layout: cheat_sheet
title: Cheat Sheet Git
permalink: /cheat_sheets/git
---

```bash
git reset HEAD~ --hard
```

```bash
git remote add origin git@github.com:username/existing_project.git
```

Ajouter un fichier dans le précédent commit

```bash
git commit --amend --no-edit
```

Rebase process

```bash
git rebase master -i
git add .
git rebase --continue
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

<h2>Des articles pour aller plus loin</h2>

<a href="https://dev.to/ambroseotundo/creating-git-aliases-3nng"
   class="underlined"
   target="_blank">
  Créer des alias sur Git
</a>
<br>
<a href="https://dev.to/this-is-learning/this-new-git-push-config-will-save-you-lot-of-frustration-27a9"
   class="underlined"
   target="_blank">
  Push configuration
</a>
<br>
<a href="https://dev.to/codenameone/understand-the-root-cause-of-regressions-with-git-bisect-1dgi"
   class="underlined"
   target="_blank">
  Git bisect
</a>
<br>
<a href="https://dev.to/jordharr/how-to-enforce-conventional-commit-messages-using-git-hooks-with-husky-commitlint-537j"
   class="underlined"
   target="_blank">
  Enforce conventionnal commit with git hooks
</a>
<br>
<a href="https://thoughtbot.com/blog/git-interactive-rebase-squash-amend-rewriting-history"
   class="underlined"
   target="_blank">
  Git Interactive Rebase, Squash, Amend and Other Ways of Rewriting History
</a>
<br>
<a href="https://ouidou.fr/2021/06/23/quatres-astuces-pour-maitriser-ses-rebases/"
   class="underlined"
   target="_blank">
  Quatres astuces pour maitriser ses rebases
</a>
