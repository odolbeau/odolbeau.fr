---
layout: post
title: Définir ses propres tâches GNU Make dans son coin
lang: fr
subtitle: Facilement, rapidement et sans embêter ses collègues ! 😍
description: Comment définir ses propres tâches GNU Make sans toucher au fichier Makefile du projet ?
tags: [makefile, GNU Make]
---

## Pourquoi voudrais-je faire ça ?

Lorsque j'arrive dans un projet qui utilise **[GNU Make](https://www.gnu.org/software/make/)**, je suis content ! 🥰

Cependant, il est courant que j'ai besoin (ou plutôt envie) de définir **mes propres targets** : parfois spécifiques à mon environnement, parfois très proches d'une target existante mais avec LA variation que j'apprécie, parfois spécifiques à une problématique, ...

Ces targets n'ont souvent **pas grand intérêt pour les collègues** (qui ont sans doute leurs propres envies avec LA variation qu'iels apprécient), les ajouter directement dans le Makefile n'est donc pas pertinent, voire serait contreproductif: si tout le monde faisait pareil, on se retrouverait bien vite avec un fichier de plusieurs centaines de lignes et donc difficilement lisible.

Heureusement, il existe plusieurs solutions !

## Définir des tâches dans son coin

### Proprement, avec un Makefile.local

La première solution consiste à modifier le fichier Makefile existant pour y glisser une petite ligne toute bête mais diablement efficace :

```language-makefile
-include Makefile.local
```

la ligne parle d'elle même : cela permet d'inclure un fichier `Makefile.local` (situé dans le même répertoire) et le `-` devant l'instruction permet de ne pas lever d'erreur si ce fichier n'existe pas.

Il suffit ensuite d'ajouter `Makefile.local` dans le `.gitignore` du projet, de commiter le tout et **mission accomplie** : toute l'équipe pourra déclarer ses propres targets dans un fichier `Makefile.local` sans impacter les collègues ! 🥳

### Rapidement, avec un GNUmakefile

Par fois il ne sera peut-être pas possible (ou trop long) de modifier le fichier Makefile existant. Pas de panique, il existe une autre solution !

Lorsqu'elle est lancée, la commande `make` va vérifier l'existence des fichiers `GNUmakefile`, `makefile` et `Makefile` (dans cet ordre) pour trouver sa configuration.

C'est l'utilisation d'un fichier `Makefile` qui est officiellement recommandé dans la documentation et si on en croit github, c'est effectivement la solution la plus plébiscitée : [30k occurrences de GNUmakefile](https://github.com/search?q=path%3A%2F%28%3F-i%29%5C%2FGNUmakefile%24%2F&type=code), [224k occurrences de makefile](https://github.com/search?q=path%3A%2F%28%3F-i%29%5C%2Fmakefile%24%2F&type=code) et... pas moins de **[3,1 millions d'occurrences de Makefile](https://github.com/search?q=path%3A%2F%28%3F-i%29%5C%2FMakefile%24%2F&type=code)**.

Sachant ça, il est donc possible de jouer avec cette notion de priorité pour créer un fichier `GNUmakefile` et y ajouter la ligne suivante :

```language-makefile
include Makefile
```

Même stratégie que précédemment mais cette fois inversée : on inclut le fichier Makefile existant avant de déclarer ses propres targets.

Pour ma part, j'ai ajouté `GNUmakefile` dans mon `.gitignore` global pour être sur que ce fichier ne soit pas versionné.

## Bonus : un GNUmakefile prêt à l'emploi

Voici un exemple de `GNUmakefile` que j'utilise lorsque j'en ai besoin. Je vous laisse copier ce fichier dans un projet existant pour admirer le résultat. :)

<script src="https://gist.github.com/odolbeau/d61a35e4767c723de59221234b766828.js"></script>
