# Anon

><small>*free multipurpose LAMP framework that relates less to hoo(v/k)ers*</small>


<!--[/User/note/homePageWorx.md]--->


### Introduction
After reading and watching a truckload full of geek-porn ranging from security snags to performance -and complexity issues regarding PHP frameworks, I bet you are getting tired of all this BS .. been there; it's a dark place and it gets even darker if you choose the wrong framework for your business and end up being stuck with it.

So "what makes Anon different?" - I hear you say; well, not to brag but:
- You can use Anon to assist with any kind of project, not only web development; it comes with a "simple yet effective" task management & billing system
- Anon is easy to install, just download & extract it to your web-host .. or clone it via Git
- It is built on the most popular (open-source) internet "technical" languages: (HTML, CSS, JavaScript, PHP)
- Even though it supports various databases, it has no database dependencies .. so it can run without MySQL
- It has its own server-debugging and client-debugging built in; so if it does not complain about something, all is well
- If ever there may be an error, it is designed to suppress any details to the general public, only visible by your own employee-privilege
- Anon is built from the ground up to be modular and portable as **CANDRYKIS** .. which means: "structured well" .. (leave your cousin out of this)
- You start out with a blank web-root; Anon does not clutter up your `doc-root` (at all), its dependencies in doc-root are few, and hidden
- With "show hidden files" `off` in your file-browser, the only file you see in your doc-root is this document you are reading now, which you can delete
- You can write web pages in MarkDown; you don't have to, but it's built in; after install this is the Anon repo's `README.md` you are reading now as a web page
- Anon can work as either a "Single Page Application", or as a normal website .. -or both
- It has a built-in IDE (Integrated Development Environment) - only accessible via secure login as a privileged user
- It has a built in user privilege system with roles .. this - together with the IDE means you don't have to give anybody your FTP details anymore
- It has automatic time logging per user and per task - which is linked to any client(s) of yours, which gives you accurate billable time per client
- It is self-hosted, so you can install and use it independently, no dependencies on any other domain but your own
- It has detailed documentation on every major feature and encourages documenting any features you may build yourself
- Security is very important in both front-end and back-end of Anon, nobody has access to your private data -or configuration, you are in control (and responsible)
- Contributors can earn money by building features and selling them; these are peer reviewed before privately advertising them to other relative Anon hosts
- For sanity reasons any feature contributions are handled by humans, who has bills, so they ask a small percentage per feature-sale for their labor - which ads a "QC" stamp on verified features
- Anyone can become an Anon QC agent who verifies (peer review) the work of contributors and by this earn money for their labor
- All of this is made possible with what the Anon framework offers you and on top of all this it creates jobs for people who are willing to earn an honest living
- Anon is free .. no trials, no waiting, no limitations, no public ads, no "catch"

With all that out in the open, it's clear that A LOT of work and careful planning went into the creation of Anon; made for us by us.
Let's get busy.

***
<br>

### Installation
1. Download and extract (or clone) the Anon repository
2. If it's not on your web server yet, copy it over via any means, (usually via FTP)
3. Visit that web server's domain using your favorite web browser

In order to change anything in your Anon system (the Anon way), you'll need to use the ***WorkPanel***.
>You benefit from using "the Anon way" because Anon logs your time and provides security and assistance relative to what you're doing.

#### How to toggle the WorkPanel on and off
- To open: on your keyboard press -and hold the `` {:CTRLKEYS:} `` keys in sequence together then let go .. quickly does it ;)
- To shut: do the exact same thing as above :D


There is a default *root* user in Anon named `master` -which is used to set system configuration and to create/delete users with/without "lead" privileges. If you haven't changed the master password yet, you'll need to change it now.

Assuming you've opened the WorkPanel already, you should see a command-prompt (terminal) at the bottom. Focus on the terminal (click on it) then type:
```plain
help login
```
-then hit the `Enter` key on your keyboard. You should now see detailed information on how to login, and also about how to change the master password.

To create any users you will need to be logged in as a user with `lead` or `sudo` privileges.
For a list of all the commands available to you once you are logged in, type:
```plain
help
```
-then hit the `Enter` key on your keyboard. You should see a bunch of commands you can use.

To get help on how to create (or manage) users, use:
```plain
help user
```

You won't see the full work-panel unless you assign the `work` clan (meaning: role -or group) to a user; this simply means that this user is part of your staff as a worker, and not a subscriber to your service.
To see a detailed list of all the clans and what they mean, these commands may come in handy:
```plain
help clan
clan list
```

Now that you are familiar with the terminal commands, go ahead and create a user. Remember to assign the `sudo` clan to at least one (important) user, such as the CEO (or leader, or sysadmin). If this is you then you'll find it convenient otherwise, you'll have to login as `master` every time you need to do something important.

Once you've created a new user that also belongs to the `work` clan; check the email of that user for their (temporary) password. This password won't expire, but it's definitely not something memorable; so that user should login and change their password, instructions are provided in that same email.

If you you've logged in with a user that (also) belongs to the `work` clan, you'll see the full work-panel with icons on the left; these are apps that this user has access to, but `Help` will be there too.
- click on that "Help" (mortarboard hat) button and then from the HELP tree-menu,
- click the "Help" -> "README" for a *quick-start* guide and some tutorials

***

### Welcome to the anon clan!

<small>*The Anon framework is licensed under the MIT license and as such you cannot legally sell it "as is", however you can modify it as you wish and sell your labor as long as the original LICENSE document is shipped with your software. It also means we are not responsible for any losses or damages; please see the full LICENSE for more info.*</small>

***
