---
layout: post
title: "How to install your laptop with ansible?"
subtitle: Cause you don't want to do it manually!
description: Ansible is a great easy-to-use tool! Automating the installation of your personal laptop is a perfect use case to start playing with it!
tags: [ansible, configuration management]
---

## Why Ansible?

As you may know, I'm pretty familiar with [chef](https://www.chef.io/chef/ "Official chef website") and I use it almost every day, for both professional & personal stuff.
Despite that, I am quite willing to try something else and [Ansible](https://www.ansible.com/ "Official Ansible website") is a well known (and used!) configuration management tool. I know a lot of people who are quite pleased to use it!

Furthermore, I changed my laptop last week so it was the perfect occasion to give it a try :).

## Let the journey begin!

As you will see, Ansible is really easy to use.

### What's the goal?

As I said, my goal is to automatically install a laptop development. I use debian and I will only focus on it. :)

**I would like:**

* 2 steps maximum (bootstrap + run)
* as less manual actions as possible
* an easy to understand / maintain project

### Implementation

First of all, let's start with the project tree:

```language-bash
.
├── bin
│   └── bootstrap
├── laptop.yml
├── Makefile
├── README.md
└── roles
    └── common
        ├── files
        │   └── ssh
        │       ├── config
        │       ├── id_rsa
        │       └── id_rsa.pub
        └── tasks
            ├── main.yml
            └── nginx.yml
```
There aren't a lot of files which is a good point for maintainability, right? :)

Furthermore, the installation process is **very** simple:

1. Clone the repository
2. Boostrap the laptop with the `bin/boostrap` command
3. Install the laptop with `make install`

As you can see, I only have 2 commands to run: it seems one of my goal is already reached! \o/

Let's explain those 2 steps.

#### Bootstrap

As `ansible` isn't installed by default on your laptop, the goal of the bootstrap is to install it. Furthermore, I don't want to deal with the `ansible` command line because there are several arguments to include and I'm used too `make install` everything; that's why I need `make` too. Finally, as ansible will be run by my user and not by root, I need to have some privileges, that's why I also install `sudo` and grant all privileges to the current user.

Here is the boostrap script:

```language-bash
#!/bin/bash

echo "Installing sudo, make & ansible, and allow user \"${USER}\" to run any command with sudo..."

LOCAL_USER=${USER} su -c 'apt-get install sudo make ansible && echo "${LOCAL_USER}      ALL=(ALL:ALL) NOPASSWD:ALL" > /etc/sudoers.d/${LOCAL_USER}'
```

Once all prerequisites are installed, we can use ansible.

#### Installing the laptop

As I said, I use a Makefile. It contains only one command:

```language-makefile
.PHONY: ${TARGETS}

install:
        ansible-playbook -i '127.0.0.1,' laptop.yml --ask-vault-pass
```

We simply ask ansible to run the playbook named `laptop.yml` on `127.0.0.1`.
Forget the `--ask-vault-pass` option for now, we'll discuss it later! ;)

##### Playbook

As said before, we ask ansible to run a playbook. In our case, it's called `laptop.yml` and here is the content of this file:

```language-yaml
---

- hosts: 127.0.0.1
  connection: local
  roles:
    - common
```

The only impacted host is `127.0.0.1`.
We use the local connection (you can use ssh to configure a remote server for instance).
Then we list all roles which concern our host.

It's a **very** simple playbook and I won't go into details on this subject for two reasons:

* you don't need anything else to configure a personal laptop
* that's a huge subject I'm definitively not the best specialist of to talk about it :)

If you're interested in anyway, you can take a look at [the official documentation](http://docs.ansible.com/ansible/playbooks.html "Ansible's playbooks documentation").

##### Roles & Tasks

Our playbook mention only 1 role: `common`.

Let's have a look at it:

```language-bash
roles/common/
├── files
│   └── ssh
│       ├── config
│       ├── id_rsa
│       └── id_rsa.pub
└── tasks
    ├── main.yml
    └── nginx.yml
```

It contains several files related to ssh and two tasks respectively called `main.yml` and `nginx.yml`.

You will always have a `main.yml` task in a role as it's the default entry point. Here is an extract of this file:

```language-yaml
---

- name: install packages
  become: true
  apt: name="{{item}}" state=present
  with_items:
    - ack-grep
    - composer
    - curl
    - make
    # ...

- name: Install slack
  apt:
    deb: https://downloads.slack-edge.com/linux_releases/slack-desktop-2.1.0-amd64.deb
    state: present
  become: true

- name: Install ssh keys
  copy:
    src: "ssh/{{ item }}"
    mode: "0644"
    dest: /home/odolbeau/.ssh/
  with_items:
    - id_rsa
    - id_rsa.pub

- name: Install ssh config
  copy:
    src: "ssh/config"
    mode: "0644"
    dest: /home/odolbeau/.ssh/

- name: Download dot files from github
  git: repo=ssh://git@github.com/odolbeau/dot-files.git dest=/home/odolbeau/dot-files

- name: Install dot files
  command: make -C /home/odolbeau/dot-files install

- name: Download VIM configuration from github
  git: repo=ssh://git@github.com/odolbeau/vim-config.git dest=/home/odolbeau/vim-config

- name: Install VIM configuration
  command: make -C /home/odolbeau/vim-config install

- include: nginx.yml
```

There are several instructions in this file. As you may have noticed, everything is in yaml and clearly understandable.

Let's explain some of this instructions:

```language-yaml
- name: install packages
  become: true
  apt: name="{{ item }}" state=present
  with_items:
    - ack-grep
    - composer
    - curl
    - make
    # ...
```

Most of the ansible instructions speak for themselves!

In this case, we create a task which will use the `apt` module to install a package. This task will be run with several items listed under `with_items` key.

The `become: true` option is used to run this task as root (cause the default value for `become_user` is root).

```language-yaml
- name: Install slack
  apt:
    deb: https://downloads.slack-edge.com/linux_releases/slack-desktop-2.1.0-amd64.deb
    state: present
  become: true
```

In this case, we still use the `apt` module to install a remote package.
Notice that you can use an inline syntax like in the first example with `apt: deb="..."` or the extended syntax like here.

```language-yaml
- name: Install ssh config
  copy:
    src: "ssh/config"
    mode: "0644"
    dest: /home/odolbeau/.ssh/
```

Again, a very easy to understand task! I simply want to copy files coming from my roles (placed under `my_role/files/`) on my laptop. Easy! \o/

```language-yaml
- name: Download dot files from github
  git: repo=ssh://git@github.com/odolbeau/dot-files.git dest=/home/odolbeau/dot-files

- name: Install dot files
  command: make -C /home/odolbeau/dot-files install
```

Those 2 tasks are used to install my [dot-files](https://github.com/odolbeau/dot-files "My dot files"). The first one uses git to download the repository and the second executes a `make install` inside the correct folder.

I won't list all modules I use though. There are plenty of them and [their documentation](http://docs.ansible.com/ansible/modules_by_category.html "Ansible modules documentation") is very clear! Don't forget to have a look at existing modules before running a command by yourself. :)

#### That's it!

You know everything you need to start to use ansible by yourself for a single host!

## Bonus

### Ask the user to do something for you

Let's confess: sometimes, it's hard / painful / time-consuming / impossible to do everything with a configuration management.

For instance, in my case, I need to install a VPN client and to create a tunnel in order to download some private projects.

Once the VPN is installed, here is what I use:

```language-yaml
- command: ping -c 1 "a.private.url"
  register: vpn_connected
  ignore_errors: True

- pause:
    prompt: "Make sure to run the VPN in order to continue the installation. [Press any key once done]"
  when: vpn_connected|failed
```

I try to ping a private URL. I register the result of this command inside the `vpn_connected` var.

Then I use the `pause` module. If the tunnel isn't running, I simply ask the user to launch it, otherwise, it keeps going!

Of course, the goal is not to use this trick every time: if your users have to do everything manually, you're not using a configuration management tool correctly! Use this only when you **really** can't configure something automatically.

### Deal with sensitive data

As previously explained, I use ansible to install my private ssh keys. Even if all my private keys are protected by a passphrase, I don't want to version them without encryption!

In my case, I use a private repository to store my ansible configuration. In this situation, it's not really necessary to encrypt your keys but as you will see, it's very easy to do! :)

Of course encrypt keys / passwords / files is a common use case and Ansible propose a very powerful solution to deal with it: [Vault](http://docs.ansible.com/ansible/playbooks_vault.html "Ansible vault documentation").

It's shipped with the `ansible` package and it's easy to use! I mean, **really** easy!

If you want to encrypt your ssh keys:

```language-bash
# Copy files into your role
cp ~/.ssh/id_rsa ~/.ssh/id_rsa.pub my_role/files/
# Encrypt them!
ansible-vault crypt my_role/files/id_rsa my_role/files/id_rsa.pub
New Vault password:
Confirm New Vault password:
Encryption successful
```

And that's it! Your files are now encrypted —congrats by the way! :)

As soon as you have encrypted file in a role, you'll have to add the `--ask-vault-pass` option when running the `ansible-playbook` command.

## Conclusion

I hope I convinced you: it's pretty convenient to write an ansible playbook to install your laptop! In case you change it, you will gain a lot of time running 2 commands instead of installing everything manually! :)

Ansible is easy to use which make it a good choice to fulfill this need, but there are a lot of other configuration management tools out there, so don't hesitate to take a look at them! :)
