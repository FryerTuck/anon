# Anon

><small>*free multipurpose LAMP framework that relates less to hoo(v/k)ers*</small>


<!--[/User/note/homePageWorx.md]--->


### Introduction
After reading and watching a truckload full of geek-porn ranging from security snags to performance -and complexity issues regarding PHP frameworks, I bet you are getting tired of all this BS .. been there, it's a dark place and it gets even darker if you choose the wrong framework for your business.

If your goal is "raw performance" - no matter the cost then, I'm afraid you'll have to build your own thing, however, bare in mind that the larger your project becomes, the more complex it would be and you will have to plug the security holes yourself; soon you will realize inevitably that you've built your own framework. This is not some outlandish claim, this is from years of experience in dealing with back-end, front-end and full-stack software engineering and team work.
There are obvious reasons why frameworks exist, to name a few:

 - rapid software development, efficiency and customer satisfaction
 - uniformity in structure, functionality and compartmentalization
 - security implementations that protect your assets as clients, employees, stock, and reputation.

From a business point of view, it is clear that everybody needs a framework, but every business is different; and yet if you choose a framework tailored for specific business rules, then you are stuck within that "business framework". If you are looking for a competitive edge, to stay ahead of the masses, you need something with a tad more intelligence in its design and purpose.

Instead of trying to cater for every possible business setup, Anon rather aims to provide a solid platform upon which you can build "modularized" applications (sub-packages, or simply: stems).

These sub-packages are encouraged to be in separate folders, and contain some plain-text configuration files -which specify dependencies upon either other sub-packages, or PHP-version, PHP-extensions, Anon-version, etc. This makes each stem (feature) "portable" - meaning you can simply copy it from one Anon-server to another without running some mystical installation at all; it will work as expected regardless. Of course these configurations are not mandatory, you can really do what you want, but if you want to benefit from these principles, then you can use it.

Anon will tell you if dependencies are missing upon feature access - without showing the general public (or bots) any details about any kind of error at all, period.
The only way you can see any kind of error details is when you are logged in as a user whom has technical privileges.

Users are assigned to groups (clans); these clans define what kind of user it is; e.g: worker, sorter, dealer, drawer, geeker, ganger, leader, etc. So, simply put: a "drawer" will be able to open graphic files in the graphics editor and draw with them -but won't have access to "code" files -or any database; the same way a geeker will be able to edit code files -but not have access to edit graphics.

These groups are stack-able; a user can be assigned to many groups and they function as expected implicitly and logically.
For instance: a user can be in the `draw` and `geek` clans which grants them access to both edit code and graphics.
In the same way a user in the `work,draw,gang` clans (as ganger) is only responsible for other users within the `work,draw` clan, but a user within `work,draw,gang,lead` clans is responsible for users in the `work,draw,gang` clan. However, a user in the `work,geek,gang` clan is not responsible for users in the `work,draw` clan.

This user privilege system is tightly knit into Anon in the back-end and front-end; these even have functions to test if a user belongs to a certain clan, thereby granting/limiting access programmatically. In the front-end you can simply omit whole sections if a user does not belong to a clan; this is not simply "hiding", but completely omit/not-render at all. This greatly enhances security and gives developers unique ways to deal with content dynamically without having to duplicate anything.

Whew this was a long introduction, but hopefully you are intrigued enough to continue reading :D

---
<br>


### Orientation
As its name suggests, this is an anonymous software package; it has no name. It is a "white-label" product, so you can name your copy of it anything you want, but for reference sake it is: Anon.

One of the first issues anyone has with "a new framework" is to learn it's **structure** and often very complex mechanisms of operation. Now we are not gonna throw stones unless we expect to be thrown back, but .. .. (many ~~good~~ words here).

Anon is all about:
- simplicity
- elegance
- collaboration
- security

..but foremost it cares very much for its developers and project leaders; you'll see why in a bit.
<br>

#### Simplicity
From installation, it's as simple as either copy+paste via FTP or clone via Git.
After installation is done and you browse to it via a file browser, you'll notice something quite different. Assuming you've downloaded/installed it to a Linux machine and your file browser does not show hidden files, You'd see only 1 file: this `README.md` file. You should delete this README file (when you're done reading), but that's just it: Anon does not force any folder structure on you and it does not clutter your `web-root` with anything (at all).
Better yet: you can do your own thing as you usually would and still benefit from Anon's dynamic+reactive security mechanisms - which protect your system against bad web crawlers (crawlers that disobey the `robots.txt` rules. ..what's that you say? there is no `robots.txt`? Go ahead and install Anon on a LAMP-capable server, then navigate to `yourdoman.wut/robots.txt` .. magic, only not, just a lot of hard work, because that response is dynamic as it gains "robots.txt rules" from inside ... I'm digressing - more info down below in **security**.
Anyway, simplicity yes, we've dealt with the complexity so you don't have to; like seeing an HTML-rendered page from this `README.md` upon first install; yes you can have your own docs or web pages even in markdown, anywhere you want, it will work as expected; which brings us to "elegance".
<br>

#### Elegance
As mentioned, you can do your regular thing and Anon won't stand in your way, however, it gives you a lot of power. You can have 4 kinds of files as "index" for any folder and Anon serve it as expected: `index.php` `index.html` `index.js` `index.md` `README.md`.

In addition to this freedom, an `index.php` file is handled first and foremost as a ***controller*** for that folder (and its children); however, if you have a folder in your ***doc-root*** with an `index.php` file in it - and this PHP file has a class inside it named exactly as the folder it is in, then this folder is seen as a ***stem*** - from root and this class is that stem's controller for all its branches (subdirectories) and contents. However, if a user browses into (-or past) this folder in the path (by link or whatever) and your controller does nothing, then any files will be served/processed as usual (it won't "serve" PHP as text, gosh no, unless you tell your controller to do exactly that).

Anon comes with a few nice front-end and back-end programming tools (functions, classes, etc) - to make life a bit easier. For instance, in the back-end it has a standard CRUD interface that work in the same manner as you would with a an ORM to a database - but this works the same way also for MySQL, SQLite, Git, FTP, IMAP, SMTP .. more info on the tools are available in the manual, this is just the "intro" and getting too long by the looks of it :smile:

>Conviction is the realization of elegant simplicity.

<br>

#### Collaboration
Anon is fully integrated with Git. When a user is assigned a role that involves content creation & editing; Anon assigns them their very own private repository, which they can work in without disturbing the public, or any other users. This means if they are logged in as a certain user they can browse to pages and apps that don't even exist in the tree structure of the doc-root. Once their work is ready for review they can commit and push their work to the development branch where it can be reviewed by a team leader (still not live). This can then be exported to some other place, or merged with your doc-root - if you decide to make your doc-root a repository.

Other than that, Anon comes by default with some essential productivity tools, which enable anyone using Anon to do business remotely without having to compromise security via e.g: sharing FTP or SSH credentials. You can use Anon either for your own site, or to work on the sites (-or web apps) of others who don't even have Anon installed.

All of this is available in the ***WorkPanel*** (more on this below), but don't worry about performance with all this as Anon only loads/runs what is needed - when it is needed, per feature (stem), when called, or visited.

The WorkPanel comes with a simple (yet effective) code editor (with syntax highlighting).
It also has a simple (yet effective) graphics editor with which you can crop/resize add text, draw shapes, clip, etc.

The file-browser's tree-view is equipped with drag+drop - on which you can drop files from your local machine and they will be uploaded into where you dropped it. You can also drop image files directly on the image editor either from your local machine, or from the tree-view .. just sayin' .. but all this is covered in detail from the "help" docs of every intrinsic package.

It has a database browser/editor which works directly through the venerable ***Adminer*** - which as you probably know works very well with nearly any database system.

It also has a "kanban" (kan-board like Jira, or Trello)
The activities of every user are logged by project/context and timestamp, so this provides efficient time tracking "per project" data, without the need for manual time-sheet fill in, and without the need for third-party timers or invasive screen-shots; simply put: Anon records the time your workers spend on work and that can be used to debit your clients (relative to projects), and/or credit your workers in salaries/commission, etc.

The above-mentioned collaboration tools are only loaded when accessed, and the WorkPanel is only loaded (once) when toggled on. As you will see below, you cannot access anything unless you have a registered account on your anon-server - and you are logged in.
<br>

#### Security
Anon protects your online business logic even if your hosting provider (or techie) messes up the PHP installation; it does this by identifying if PHP is installed and available via the `.htaccess` (first and foremost); if it fails then it checks if a bot was visiting, if so it serves a 503 (service unavailable) header, else it gracefully serves an error message about what is wrong with the server. It does the bot-check because we don't want a proper web-crawler to index your site as being "under maintenance" if some hosting techie messed up your server by accident on a PHP upgrade/downgrade/etc.

If PHP is available it checks if the bare minimum stable/secure PHP version is available, if not, it fails gracefully - same as above; after which it checks if the required PHP extensions are available - if not, it fails gracefully. Then it checks if the framework boot-strapper is intact ...
> "so goes the chain of ascension"
><sub>-- Alarak - highlord of the Tal'darim</sub>

Anon serves requests via ***interfaces***. If you come via a normal browser and you don't say you're a bot (user-agent-string) and you don't act like a bot (disobeying robots.txt rules) - then you are most likely seen as a human, or a damn good robot.

There is more in depth discussion about this detection, but would suffice to say that if a bot passes as a human, it deserves to be treated as such, but I'm sure some people rant and rave about "captia" while others know it is easily fooled.

Anyway, all that is up to you as the developer; however, Anon holds a firm storm-barrier between you and the less desirables in the unforgiving sea of misbehaving robots and the clever humans behind them. When Anon realizes it's being attacked, it locks in a temporary ban of x-minutes (configurable, 15 is default). And it does not check only the IP of this attacker, it tries to identify so that it does not block other people behind the same proxy (-or VPN).

Once the "killban" is deployed against an attacker Anon will not waste resources on them, they get ignored (service unavailable) - by header only - right at the very start of Anon's request-bootstrapper.

You can also configure the `badRobot` settings' `lure` + `trap` values in order to lure bad bots into misbehaving (robots.txt does this anyway, reverse psychology haha) .. then trap them in a never-ending loop of click-bait from another server (away from your server) to reserve your server's resources for your customers and good robots, such as GoogleBot, Jeeves, etc.

The above was only 2 interfaces, here's some interfaces and how Anon handles them in order to get a better grasp of Anon's aggressive security:

- **BOT** - roBOT; identified when a visitor identifies as a web-crawler, or follows a link which is invisible to humans, directly as the GUI-boot HTML is served.
- **GUI** - Graphical User Interface; only happens once when a human-like session is established from a regular browser making a typical visit.
- **DPR** - Direct Path Request; identified as such when a request is made FUBU (For Us By Us) - meaning from your own website, the browser requests a file from your server after a GUI interface has been established, like css, or images, etc.
- **SSE** - Server-Side-Event; persistent unidirectional data transmission between established GUI made FUBU
- **API** - Application Programming Interface; identified either via XHR request made FUBU, or from an external visitor with a UUID API-key registered on your server as a legit client of yours and ONLY if their hashed IP/referrer/user-agent-string matches the stored credentials together with the API-key.

When a GUI is established it also checks if the client-side domain matches your server domain and by this prevent spoofing/snooping and script injection attacks.
It also checks if the browser is a modern W3C standards compliant browser by feature detection, if not compliant then the visitor is notified and asked to upgrade their browser, with link to a list of modern browsers to install from official sources.

Furthermore, it also denies any script injection via address-bar, console and dev-tools element editors built into modern browsers.

I bet at some point you were like: "good grief, that's overkill, what about performance?" It's fair, but which do you prefer:

a) save a few milliseconds per request
 -OR-
b) have your website spoofed, data-scraped and/or defaced
<br>

#### Orientation Conclusion
By now you've probably realized that A LOT of work has gone into the design of Anon, and it's here to help your business/project vision materialize .. for free. I hear you .. "what's the catch?" .. no catch, you have no financial obligation or any mandatory affiliation whatsoever, period.

You can't sell Anon as your own product as-is, it's in the LICENSE.txt - which nobody sees but you, and it must stay intact. Anon is free, your labor may not be free and that is what you can charge for when building software with Anon.

If you require a specific feature and you don't have the time -or manpower to build it, you can ask for a developer/team in the AnonClan forums to build it for you, for "fair" donation - depending on how much you can afford, or how much it is worth to you; however, being realistic helps, talk to the team, if you can pay them later then that's up to you, we don't interfere with that, it has nothing to do with us, we just build/upgrade/maintain the platform.

There are no "ads" perse, if you want to create a new project or feature, have a look at what's available, other devs build features and sell them, if you can buy a ready-built feature for $15 - or pay 2 devs $1500 each for 2 months for the exact same thing, do the math, it works for you and the devs who sell it; all we ask these devs is a small fee for peer-reviewing their work and for writing some articles about their features on popular geek-media such as HackerNoon, StackOverflow, etc. We can do the same for you, if you decide to sell your features, or release it for free -which is good publicity.

---
<br>


### Installation
You will need a web server running Linux, Apache and PHP.
If you've already installed Anon, skip to the ***Getting Started*** section below.

You can install Anon in 2 ways:

##### Automatic Install
- Go to https://www.anonclan.com/deploy and follow the instructions
- skip the ***manual install*** section below and keep reading from there.

>We have no need for your personal details, we don't record it and we don't share it with anybody; however if you are still skeptical about this method; simply change your FTP credentials after the installation.

<br>

##### Manual Install
The least complicated is via FTP:
- Go to https://www.anonclan.com/grabit , dowload the anon.zip, then
- extract & transfer (copy + paste) the extracted contents via FTP to your destination web-server's server's doc-root.
- assuming this FTP account has the same username as your apache user, it's fine as it is, or else to make sure, use your ISP's file management too to set permissions for the doc-root as 755 (recursively) and make sure the doc-root is writable by your web-user, (recursively).

The other method is via Git, but it may be a tad technical, use the following method if you cannot use FTP at all, but if you already did it via FTP, the skip this and read the ***Testing after install*** instead.

More complicated is via Git:
If you have ssh access to your destination server and you know some basic Linux commands, you can clone the repo directly into your doc-root.

-Login via ssh, cd into your Apache server's webroot. If the this ssh-user is not your "apache" (-or wwwdata, or httpd) -user then you'll need to `chown` and `chmod` to set the correct permissions, else Anon will not be able to work as expected. Run the following commands:

```bash
# get the most recent master, note the dot at the end
git clone --depth=1 https://bitbucket.org/argonfreeman/anon.git .

# remove the .git folder, Anon does not use it at all
rm -r ./.git

#set permissions, replace "apache" with your web-server-user name
chown -R apache ./
chmod -R 755 ./
```
<br>

##### Testing after install
Open your favorite web browser and visit your server via it's domain name. You should see this exact same README document as the home page.

---
<br>


### Getting started
If you've installed Anon via the ***automatic*** method and you just want to use it for its default security benefits AND you don't care about changing anything then you're done; IN THIS CASE: you can use what you have -the way you're used to - just delete this README from your doc-root and stop reading after this period.

Glad you stayed :D

In order to change anything in your Anon system (the Anon way), you'll need to use the ***WorkPanel***.
>Using "the Anon way" is not "just because", no, you actually benefit from this because Anon logs your time and provides security and assistance to what you're doing.

#### How to toggle the WorkPanel on and off
- To open: on your keyboard press -and hold the `` {:CTRLKEYS:} `` keys in sequence together then let go .. quickly does it ;)
- To shut: do the exact same thing as above :D

## &nbsp;

There is a default *root* user in Anon named `master` -which is used to set system configuration and to create/delete users with/without "lead" privileges. If you've installed Anon via the ***manual*** way, you'll need to change the `master` password.

Assuming you have opened the WorkPanel already, you should see a command-prompt (terminal) at the bottom. Focus on the terminal (click on it) then type:
```plain
help login
```
-then hit the `Enter` key on your keyboard. You should now see detailed information on how to login, and also about how to change the master password.

---
<br>


### Learning Anon
People often assume that Anon must be "kinda huge" and maybe "too difficult"? .. on the contrary, Anon is tiny (less than 5Mb in file size - uncompressed) and this includes all the fonts, pictures, documentation, configuration, etc.

You can learn (and master) Anon within 5 days easily, if you have PHP & JavaScript experience then even less. There are some tutorials that teach via "real world" examples and a detailed manual in the **Help** package -which you can find in the ***WorkPanel*** - just click on the the *Help* button on the side menu (book icon).
