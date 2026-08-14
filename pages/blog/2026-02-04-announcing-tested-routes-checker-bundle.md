---
title: 🚀 Introducing TestedRoutesCheckerBundle!
date: 2026-02-04
published: true
lang: en
reflang: announcing-tested-routes-checker-bundle
subtitle: Improve your project code coverage
description: "Announcing the release of TestedRoutesCheckerBundle: the perfect tool to avoid non tested routes in your project!"
tags: [symfony, bundle, test]
---

On a lot of the projects I work on, I keep running into the same small problem: a route gets added in a hurry, never gets a test, and sooner or later breaks in production without anyone noticing before the error report lands. 😅

So here's a tiny bundle to avoid exactly that: **TestedRoutesCheckerBundle**!

## How it works

The idea is dead simple:

1. Run your test suite (PHPUnit or anything else, doesn't matter). The bundle
   quietly records every route actually hit along the way, in
   `var/cache/bab_tested_routes_checker_bundle_route_storage`.
2. Then run:
   ```bash
   php bin/console bab:tested-routes-checker:check
   ```
   and get a little report of what's covered... and, more importantly, what isn't! 👀

## Where does this bundle come from?

It's not a brand new project, actually. It started life at [Tiime-Software/TestedRoutesCheckerBundle](https://github.com/Tiime-Software/TestedRoutesCheckerBundle).

It went without maintenance for a while (see [this PR](https://github.com/Tiime-Software/TestedRoutesCheckerBundle/pull/29)
and [this one](https://github.com/Tiime-Software/TestedRoutesCheckerBundle/pull/30),
both still unanswered), so I forked it under my own GitHub account to give it some love and keep it alive. ♥️

## Installing it

```bash
composer require --dev bab/tested-routes-checker-bundle
```

Not using Symfony Flex? No worries, just register the bundle by hand in
`config/bundles.php`:

```php
Bab\TestedRoutesCheckerBundle\BabTestedRoutesCheckerBundle::class => ['dev' => true, 'test' => true],
```

## What about CI?

Just add a step after your tests run:

```yaml
- name: Run Bab/TestedRoutesCheckerBundle
  run: bin/console bab:tested-routes-checker:check
```

Splitting your tests across several jobs? No problem: upload each job's
tested-routes file (`var/cache/bab_tested_routes_checker_bundle_route_storage`) as
an artifact, merge them, then check the lot in one final job (see the
[README](https://github.com/odolbeau/TestedRoutesCheckerBundle#configuring-your-ci)
for the full multi-job example).

## Bonus: ignoring routes you already know about

Already have a handful of untested routes you're not fixing today (we all have
that bit of legacy lying around 🙃)? List them, one per line, in a
`.bab-trc-baseline` file at the root of your project, and the bundle will
politely skip them.

## Get it

- Source & full docs: https://github.com/odolbeau/TestedRoutesCheckerBundle
- Packagist: [`bab/tested-routes-checker-bundle`](https://packagist.org/packages/bab/tested-routes-checker-bundle)

Give it a try and let me know what you think! 😉
