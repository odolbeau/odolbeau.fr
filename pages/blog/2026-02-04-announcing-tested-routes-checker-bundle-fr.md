---
title: 🚀 Découvrez TestedRoutesCheckerBundle !
date: 2026-02-04
published: true
lang: fr
reflang: announcing-tested-routes-checker-bundle
subtitle: Améliorez la couverture de code de vos projets
description: Annonce de la sortie de TestedRoutesCheckerBundle, l'outil idéal pour éviter les routes non testées !
tags: [symfony, bundle, test]
---

Sur beaucoup des projets sur lesquels j'interviens, je tombe régulièrement sur le même petit problème : une route ajoutée à la va-vite, jamais couverte par le moindre test, et qui finit tôt ou tard par casser en prod sans que personne ne s'en rende compte avant le rapport d'erreur. 😅

Voici donc un petit bundle tout simple pour éviter ça : **TestedRoutesCheckerBundle** !

## Comment ça marche ?

Le principe est tout bête :

1. Vous lancez votre suite de tests (PHPUnit ou autre chose, peu importe). Le bundle
   enregistre discrètement, au passage, chaque route réellement appelée dans
   `var/cache/bab_tested_routes_checker_bundle_route_storage`.
2. Vous lancez ensuite :
   ```bash
   php bin/console bab:tested-routes-checker:check
   ```
   et vous obtenez un petit rapport de ce qui est couvert... et surtout de ce qui ne
   l'est pas ! 👀

## D'où vient ce bundle ?

Ce n'est pas un projet totalement neuf, en fait. Il est né chez [Tiime-Software/TestedRoutesCheckerBundle](https://github.com/Tiime-Software/TestedRoutesCheckerBundle).

Faute de maintenance (voir [cette PR](https://github.com/Tiime-Software/TestedRoutesCheckerBundle/pull/29)
et [celle-là](https://github.com/Tiime-Software/TestedRoutesCheckerBundle/pull/30)
qui traînent sans réponse), je l'ai forké sous mon propre compte GitHub pour lui donner un peu d'amour et le maintenir en vie. ♥️

## Comment l'installer ?

```bash
composer require --dev bab/tested-routes-checker-bundle
```

Vous n'utilisez pas Symfony Flex ? Pas de panique, enregistrez simplement le bundle
à la main dans `config/bundles.php` :

```php
Bab\TestedRoutesCheckerBundle\BabTestedRoutesCheckerBundle::class => ['dev' => true, 'test' => true],
```

## Et pour la CI, dans tout ça ?

Ajoutez simplement une étape après l'exécution de vos tests :

```yaml
- name: Run Bab/TestedRoutesCheckerBundle
  run: bin/console bab:tested-routes-checker:check
```

Vous répartissez vos tests sur plusieurs jobs ? Ce n'est pas un problème : uploadez
le fichier de routes testées de chaque job (`var/cache/bab_tested_routes_checker_bundle_route_storage`)
en artifact, fusionnez-les, puis vérifiez le tout dans un job final (voir le
[README](https://github.com/odolbeau/TestedRoutesCheckerBundle#configuring-your-ci)
pour l'exemple complet).

## Bonus : ignorer les routes déjà connues

Vous avez déjà quelques routes non testées que vous ne comptez pas corriger
aujourd'hui (on a tous ce petit legacy qui traîne 🙃) ? Listez-les, une par ligne,
dans un fichier `.bab-trc-baseline` à la racine du projet, et le bundle les
ignorera gentiment.

## Pour aller plus loin

- Code source & doc complète : https://github.com/odolbeau/TestedRoutesCheckerBundle
- Packagist : [`bab/tested-routes-checker-bundle`](https://packagist.org/packages/bab/tested-routes-checker-bundle)

N'hésitez pas à l'essayer et à me faire vos retours ! 😉
