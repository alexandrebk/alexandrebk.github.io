---
layout: cheat_sheet
title: Cheat Sheet AdminSys
permalink: /cheat_sheets/adminsys
---

# DNS resolver for Linux

Pour changer son DNS resolver sur Linux il faut modifier le fichier `/etc/resolv.conf`

Pour editer le fichier `sudo vim /etc/resolv.conf`

Puis remplacer la ligne `nameserver 172.X.X.X` par `nameserver 8.8.8.8`  ou `nameserver 8.8.4.4` pour avoir les DNS resolver de Google.

Si vous voulez redigirer des requêtes il faut éditer le fichier `/etc/hosts`. Par exemple vous pouvez rajouter `127.0.0.1 dev.mon-site.fr`

Pour MacOS vous pouvez suivre ce [tuto](https://dev.to/timtsoitt/how-to-resolve-local-wildcard-domains-in-macos-h5e)
