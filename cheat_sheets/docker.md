---
layout: cheat_sheet
title: Cheat Sheet Docker
permalink: /cheat_sheets/docker
---

Process en cours

```bash
docker ps
```

Liste des images

```bash
docker image ls
```

Faire le ménage

```bash
docker volume prune
docker rmi
docker rm
```

# DockerFile

Le `Dockerfile` définit une image docker. Elle peut aussi étendre une autre image Docker. A la fin du dockerfile il y'a toujours une ligne CMD qui va être éxécuter.


# Docker Compose

On définit dans le `docker-compose.yml` les profiles que l'on va utiliser.

Démarrer un process

```bash
docker-compose --profile api -d logs -f
```

Voir les process

```bash
docker-compose ps
```

Arrêter un process

```bash
docker-compose --profile api stop
```

Mettre en pause le process

```bash
docker-compose --profile api down
```


