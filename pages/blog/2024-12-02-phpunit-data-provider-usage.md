---
layout: post
title: À quel moment est-il pertinent d'utiliser un data provider PHPUnit ?
lang: fr
subtitle: Ou plutôt, quand faut-il éviter d'en utiliser un !
description: Quand l'utilisation d'un data provider PHPUnit est-elle pertinente et quand ne l'est-elle pas.
tags: [phpunit, dataprovider, data provider]
---

Lors de mes dernières missions, il m'est arrivé plusieurs fois de tomber sur **un usage des Data Provider qui ne me paraissait pas forcément pertinent**. Voici donc un petit article pour parler de tout ça (en complément de [mon article sur le sujet](/blog/la-puissance-des-data-providers-de-phpunit/), qui date un peu !).

## Qu'est-ce qu'un Data Provider ?

Un *"fournisseur de données"* en bon français est une fonctionnalité bien pratique de PHPUnit qui permet de **lancer plusieurs fois le même test avec des données d'entrée différentes**.

Voici un exemple très simple (que nous réutiliserons) permettant de tester la méthode `isValid` d'une classe `EmailValidator` :

```php
<?php declare(strict_types=1);
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;

final class EmailValidatorTest extends TestCase
{
    #[DataProvider('emailProvider')]
    #[TestDox('Ensure $email is a valid email')]
    public function testValidator(string $email)
    {
        $validator = new EmailValidator();

        $this->assertTrue($validator->isValid($email));
    }

    public static function emailProvider()
    {
        return [
            'data set 1' => ['foo@bar.com'],
            'data set 2' => ['foo@bar.fr'],
            'data set 3' => ['foo@bar.br'],
            'data set 4' => ['foo@bar.es']
        ];
    }
}
```

Comme vous le savez peut-être déjà, le test `testValidator` sera lancé pour chaque données renvoyées par la méthode statique `emailProvider`.

C'est super, **pas besoin de réécrire plusieurs fois le même test ou bien de tester plusieurs choses dans la même méthode**. 👍

## Quand s'abstenir d'écrire un Data Provider ?

Il n'est pas rare, lorsque l'on découvre cette petite fonctionnalité bien utile de PHPUnit, qu'on en use et surtout, en abuse !

Voilà deux cas précis où je vous encourage fortement de vous passer de ces Data Provider. :)

### Quand il n'y a qu'un seul test

Prenons le test suivant :

```php
<?php declare(strict_types=1);
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;

final class ExampleTest extends TestCase
{
    #[DataProvider('additionProvider')]
    #[TestDox('Adding $a to $b results in $expected')]
    public function testAdd(int $expected, int $a, int $b): void
    {
        $this->assertSame($expected, $a + $b);
    }

    public static function additionProvider(): iterable
    {
        yield 'data set 1' => [0, 0, 0];
    }
}
```

Dans la mesure où notre data provider ne renvoie qu'un seul jeu de donnée, son existence même est-elle réellement pertinente ? Probablement pas !

```php
<?php declare(strict_types=1);
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;

final class ExampleTest extends TestCase
{
    #[TestDox('Adding $a to $b results in $expected')]
    public function testAdd(): void
    {
        $this->assertSame(0, 0 + 0);
    }
}
```

Et voilà, c'est plus lisible non ?

> *"Oui, mais peut-être qu'un jour, j'aurai besoin d'ajouter d'autres cas de tests".*

Peut-être. Peut-être pas. Peut-être également que ce test ne sera plus pertinent ? Ou que le cas à tester méritera son propre test ? Bref, **inutile d'essayer de prévoir l'avenir au risque de tomber dans l'over-engineering** : *"Less is more"*, *"Keep it simple, stupid!"*, *"You aren't gonna need it"* : [Wikipedia en parle bien mieux que moi](https://en.wikipedia.org/wiki/Overengineering) 😜.

## Quand le data provider vient ajouter de la complexité à votre test de base

Reprenons notre exemple de départ et admettons que nous voulions maintenant nous assurer que des emails invalides sont bien considérés comme tels par la méthode `isValid`. Une approche possible est de modifier le test et son Data Provider :

```php
<?php declare(strict_types=1);
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;

final class EmailValidatorTest extends TestCase
{
    #[DataProvider('emailProvider')]
    #[TestDox('Ensure $email is a valid email (or not)')]
    public function testValidator(string $email, bool $isValid)
    {
        $validator = new EmailValidator();

        if ($isValid) {
            $this->assertTrue($validator->isValid($email));
        } else {
            $this->assertFalse($validator->isValid($email));
        }
    }

    public static function emailProvider()
    {
        return [
            'data set 1' => ['foo@bar.com', true],
            'data set 2' => ['foo@bar.fr', true],
            'data set 3' => ['foo@bar.br', true],
            'data set 4' => ['foo@bar.es', true],
            'data set error 1' => ['@bar', false],
            'data set error 2' => ['foo@bar', false],
            'data set error 3' => ['foo@.gr', false],
        ];
    }
}
```

Cependant, cela vient ajouter de la complexité (un `if`) dans notre test de base. Plutôt que de gérer ce cas dans le data provider existant, il suffit de rajouter un nouveau test et un nouveau Data Provider dans notre classe :


```php
#[DataProvider('invalidEmailProvider')]
#[TestDox('Ensure $email is not a valid email')]
public function testInvalid(string $email)
{
    $validator = new EmailValidator();

    $this->assertFalse($validator->isValid($email));
}

public static function invalidEmailProvider()
{
    return [
        'data set error 1' => ['@bar'],
        'data set error 2' => ['foo@bar'],
        'data set error 3' => ['foo@.gr'],
    ];
}
```

Certes, le résultat final fait quelques lignes de plus néanmois **on gagne en lisibilité et on s'assure que chaque test s'occupe d'une chose précise** ([voir la *"Séparation des préoccupations"*](https://fr.wikipedia.org/wiki/S%C3%A9paration_des_pr%C3%A9occupations), plus connue sous le nom de *"Separation of Concerns"* ou *SoC* en anglais).

<div class="alert alert-info">
De manière générale, il faut garder en tête qu'<b>un data provider vient rajouter de la complexité dans nos tests</b>.<br />
Bien que relativement faible, <b>cette complexité n'est justifiée que si elle permet d'en éviter une plus importante encore</b> (typiquement en dupliquant des tests).
</div>

## Quelques conseils lors de l'utilisation de Data Providers

### 1. Toujours commencer SANS Data Provider

Plutôt que de commencer par écrire directement un Data Provider, **commencez par écrire un test simple**. Ne créez un Data Provider qu'une fois que le test est fonctionnel et uniquement si cela vous parait toujours pertinent.

### 2. Utiliser le mot clé `yield`

L'usage d'un générateur permettra d'éviter l'utilisation d'énormes tableaux PHP pour renvoyer vos données de test. Dans le cas d'un long data provider, ça simplifie grandement la lecture mais également l'écriture. :)

### 3. Nommez vos jeux de données

Ca permet aux copains de savoir précisément ce qui est testé et ça n'empêche pas de lancer uniquement le test qui nous intéresse avec `phpunit --filter "testAdd@data set 3"̀`.

### 4. Evitez au maximum les Data Provider avec trop d'arguments

C'est un constat personnel que j'ai pu faire sur de nombreux projets : **plus un test a besoin d'arguments différents, moins son data provider et lui sont lisibles**. Bien souvent, ce symptôme peut également être le signe d'un mauvais usage des Data Provider : un découpage en plusieurs tests distincts pourrait grandement simplifier la lecture.

Si d'aventure il vous reste tout de même des Data Providers retournant une liste d'arguments longue comme le bras avec des entiers ou des booléens dont on aura tôt fait d'oublier à quels arguments ils correspondent : n'hésitez pas à **nommer les clés de votre tableau de retours avec le nom des arguments** !

```php
public static function myProvider()
{
    // Sans arguments nommés
    yield [0, 0, 0, true, 'bar'];

    // Avec les arguments nommés
    yield ['expected' => 0, 'a' => 0, 'b' => 0, 'foo' => true, 'other' => 'bar'];
}
```


### Le résultat final

Voilà ce que ça donne si on reprend les quelques conseils ci-dessus :

```php
public static function additionProvider(): iterable
{
    yield 'Double zero' => ['expected' => 0, 'a' => 0, 'b' => 0];
    yield 'Zero left' => ['expected' => 1, 'a' => 0, 'b' => 1];
    yield 'Zero right' => ['expected' => 1, 'a' => 1, 'b' => 0];
    yield 'No zero' => ['expected' => 3, 'a' => 1, 'b' => 1];
}
```

Bon, c'est sur qu'avec un exemple aussi simple, les avantages ne sont pas forcément tous évidents mais j'espère que vous aurez l'occasion de vous rendre compte de leur efficacité dans vos propres tests ! 😉

Et une fois vos tests écrits, encore faut-il s'assurer qu'ils couvrent bien tout ce qui doit l'être : j'en parle dans [l'article sur mon bundle TestedRoutesCheckerBundle](/blog/announcing-tested-routes-checker-bundle-fr/), qui détecte les routes jamais couvertes par un test.
