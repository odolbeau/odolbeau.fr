---
layout: post
title: "Why & How to use Doctrine Migrations Rollup?"
subtitle: Cause keeping your old migrations is just useless.
description: If you're an doctrine migrations user, you probably have tens or hundreds old migrations living in your project.
tags: [php, doctrine, migrations, rollup]
---

## Why removing your old migrations?

If you're working on a fast moving project, it's easy to have hundreds of migrations living in your project.

**I have a question for you:** Do you really think you will have to rollback the migration `Version20190503193054.php` (which is in your repository since more than 1 year) one day or another?

If the answer is "*yes*", I'll be glad to hear your arguments on twitter. Otherwise, you may be interested by this article.

## Introducing `doctrine:migrations:rollup` command

Even if it's not documented (yet?), doctrine provides a feature to get rid of all your useless migrations.

**On paper**, it's pretty simple:

1. Remove all your existing migrations
1. Generate a new migration with `doctrine:migrations:dump-schema`.
1. Create a commit. Push your code.
1. Deploy!
1. Run the command `doctrine:migrations:rollup` in production

As you may have noticed, even if it looks simple, deploying a new migration containing the whole creation of your database in production is **not a good idea**. The migration contains all queries needed to create your whole schema but you don't want to run them on an existing database (it will fail anyway as your database already contains those tables).

To avoid this problem, there is a simple solution. You can alter your migration manually to skip it when tables already exist in the schema. To achieve this, you can use the schema manager at the beginning of the migration.

```language-php
if ($this->sm->tablesExist('member')) {
    return;
}
```

If the `member` table already exists (which is probably the case in production if you have a table named like this) the migration will be skipped.

Everything's fine, you can now deploy your migration & run the `doctrine:migrations:rollup` command.

## How to automate the rollup command

With the process described in the previous chapter, you have to manually run the rollup command on your production. This step can easily be avoided!

In your deployment process, you probably have post deployment scripts (to automatically apply your migrations in production for example?). If it's the case, you can add those few lines to automatically launch the rollup command if relevant.

```language-bash
if [ 1 == `ls -1 $PATH_TO_MIGRATIONS/ | wc -l` ]; then
    php bin/console doctrine:migrations:rollup
fi
```

Here it is! If there is one (and only one) migration available, it means you can make a rollup automatically. Don't worry, this command won't fail (nor do anything) if you launch it several times with the same migration.

I hope this article will help you remove all these useless files living in your project. :)

Let met know [on twitter](https://twitter.com/odolbeau) if it helps or f you have any question!
