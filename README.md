# Anon

>*free multipurpose framework for remote business management*


## Introduction

This is some cheesy introduction pitch to grab your attention; if it's not working yet, grab your favorite beverage, [here's some music](https://youtu.be/LLPoZGX0qZk?t=665) that goes well with what Anon is about, so you can experience a proper introduction.

If you already know about Anon and just want to install, see the [Installation](#Installation) section below. The rest of this introduction is sectioned as 2 demographics: for [non-geeks](#intro-for-non-geeks) and .. the [rest of us](#intro-for-geeks) -but reading both may grant you super-powers, you never know ;-)

![Anon Draw - screenshot](https://i.imgur.com/wr7Ete2.png)
>*screenshot of Anon's built-in Draw app*

<br>

## Intro for non-geeks
Whether you are a business owner, CEO, project-manager, or just want to know what Anon can do for you; the following is brief, but intense, so strap on your thinking cap, it's about to get real.

By design, Anon runs with whatever you have on your website, no need to change your existing site -or framework at all. Anon does not require any database access and runs without the visitor knowing about it.

With that out the way, here's what Anon brings to the table:


### Role-based access
Have you ever had to give somebody your "FTP details" -or your server-admin panel details just so they can change a picture, or edit something on your website?

Every time you do, there is this lingering feeling about "what if this random stranger defaces my website..." - yep the risk is real; that is why in Anon you can create users and invite them to clans (groups), like **draw**, or **geek**, **mind**, etc. There are many clans, and you can also define your own.

In Anon, a user can only do what their clan have access to, so, if a user belongs to the **draw** clan -then they can use Anon's built-in graphics editor to make/edit pictures for you, but they cannot "code" anything, unless they also belong to the **geek** clan. This defines responsibilities of each person you give access to your system and your online-business is structured accordingly.

![Anon Panel](https://i.imgur.com/WBBouH8.png)
>*screenshot of Anon's web-overlay panel once logged in .. users can prettify their own private Anon workspace -or customize with JavaScript .. the terminal is drag-resize-able .. or you can hide it in your Custom style css ;-)*

<br>


### Security
Anon has several security features, for both your web-server and web-client (visitors), called front-end and back-end respectively; though, as you may already know: your web-server serves (or produces) your visitor's visible content, so, with that in mind, here are a few security-related things you will find Anon useful for:

#### Client security ~ front-end
Ever heard of [XSS attacks](https://youtu.be/9kaihe5m3Lk)? << (short video), but it covers this topic, basically.<br>
Even though you may be under the impression that you only need to worry about the back-end; there are various ways to "trick" a server by hijacking some system-requests a server expects to be authentic, like API-calls to a database.

It is not always possible to think of every little thing that could cause security issues while your developers are building your business software, so things could get messy with tight deadlines.

Anon will dismiss any code-injection attempt -from various angles, even from the web-console; when a hacking attempt is trapped, Anon removes anything "hack-able" in the user's browser and slaps the "purp" around a bit:

![purp-wack](https://i.imgur.com/6pHzfve.png)
>*screenshot - a hacking attempt from a browser's developer-tools is rewarded .. this does not happen if you are logged in as a geek , or sudo*

If you have a website that sells digital photos/designs for artists, you most probably do not want people (or web-crawlers) to steal their work.

In Anon's configuration settings you can enable to "stain" (watermark) your images automatically with your logo (or anything) -even before they get to the visitor's web-browser, by setting a resolution-limit and choosing an image to stain them with. This happens on-the-fly, so you don't have to spend 100's of hours in watermarking your images -or pay someone to do it, but now you don't have to worry about that anymore:

![AnonStain](https://i.imgur.com/tSOVD1b.png)
>*screenshot - an image watermarked with Anon's logo .. this "stain" can be SVG as well, so it scales well with very large images*

<br>

#### Server security ~ back-end
As you may have heard: there are good web-crawlers that work for you, but also the bad kind -which scrape your website for personal information; this is how many social media businesses get bad press and lose customers, or worse...

When Anon is installed on your website: every time a visitor visits your site, Anon does a few checks in order to identify which kind of visitor is visiting and renders a tailored response. This way your website-links look good on social-media when shared on various platforms.

When a "visitor" does something only a bad-bot will do, like: visit places on your website it is explicitly told **not** to (by robots.txt and "no-follow" links), then Anon [ensnares](https://en.wikipedia.org/wiki/Honeypot_(computing)) and redirects them into a never-ending pool of useless data -which causes [list-poisoning](https://en.wikipedia.org/wiki/List_poisoning) in the crawler's database, rendering their generated "leads" useless -which has no monetary value.

This is configurable and by default it redirects bots away from your site to save work-load on your server.

![SpamPoison](https://i.imgur.com/ZO374IS.png)
>*screenshot of SpamPoison .. http://spampoison.com*

<br>

In a "real-world" scenario, even though one would expect a visitor's web-browser to be **modern** and has JavaScript enabled, this is not guaranteed -and could cause your website to show up broken.

Anon tests this for you automatically with every visitor -and if all is ***not well*** it informs the visitor to either upgrade to a modern browser, or enable JavaScript -before your website is shown. This guarantees your website will show as advertised, so you don't have to worry about that. This whole process takes a fraction of a second, but solves a lot of issues regarding delivery and security -right from the start; and of course, "good-bots" are not exposed to this at all.

![NoJavaScript](https://i.imgur.com/C67pGAP.png)
>*screenshot - a human visitor's JavaScript is turned off .. yes it's not pretty, you can customize it if you want to*

I can almost hear you thinking "but what about web services and API's?"<br>
Anon detects several "interfaces". If a visitor shows up as one who expects an "API-like" response, then it is treated as an API and gets a response accordingly, though Anon has built-in API support, so you can generate API-keys and either give (or sell) these to your clients. There is more to this, but this intro-demographic is supposed to be "non-technical", keep going, you're doing great!

<br>


### Task Management and Time tracking
When you've set an email address for Anon to receive and send email; any mail coming into that email inbox is a new *Task* -or a comment on an existing task if the sender replied back. Anon auto-responds to new emails with the ticket (docket) -number in the subject.

![AutoMail](https://i.imgur.com/4tN6s0P.png)
>*screenshot - Anon auto-responds to emails*

<br>

Your incoming-job-handling in your business has to have a handling-process as pipe-line. From basic "Handy-Man", through to T-Shirt printing and software development alike. Any logged-in user that belongs to the **sort** clan has access to the **Task** app in Anon. The Task app has 4 distinct columns: TODO, BUSY, HOLD, DONE -as "swim-lanes".

Even though 4 columns may seem too few at first-glance, you can also "tag" dockets; although the power is in the pipe-line. When you drag a docket to DONE, then the next clan responsible for handling the job-ticket (docket) sees it in their TODO-list; once one of them claim it, it disappears from the previous user's DONE-list.

Dockets can be "rejected" too, even if it's the very first one that just came in; -in such case the sorter has to type a message in response to the sender, else it will not reject it; being nice helps.

![AnonSwim](https://i.imgur.com/1X2uRPm.png)
>*screenshot - Anon's Task manager*

When a new task comes in, a **sort** user sees it in their TODO-list. From here they can open it, assign it to a specific clan -or user, or write a comment in the docket.
If a comment starts with a hash-tag -followed by an email address, then the comment is also sent as email; you can specify many.

![AnonDokt](https://i.imgur.com/cKCCOys.png)
>*screenshot - opened job-ticket .. called dockets for short .. attachments can be previewed and also saved to the handler's `home` folder*


Anon is tablet-friendly, so you can have it with you everywhere you go on construction/maintenance sites, assembly lines, etc. Anon locks itself when the user is not responding.

Every action a logged-in user makes is recorded on the server. All these action-stamps have the date & time -to the second and is added up together as time the user spent on the system while logged in. A task can have a `WorkPath` assigned to it, so if digital work is done on a task it can be automatically billed per task, or per company. Email addresses are kept in the **Bill** app's contacts, so it all comes together well and you can invoice your clients accordingly; if it's physical work, the time between BUSY & DONE (for each user) is used anyway, so it's okay.

In the docket, you can assign a company-name to any new email address that comes in, this is automatically used in Billing and Anon remembers to which company belongs what.

With all the above in mind, essentially it means you can spend less time on admin and more time on doing what you love; Anon has your back ;-)

<br>


### Git version control
You've probably heard about Git, but [here](https://youtu.be/w3jLJU7DT5E) is a short video which illustrates why it makes sense to use it. Git is free, there are many alternatives to GitHub, like GitLab and BitBucket; you can also host your own, for free.

Anon is fully integrated with git and depends on it for updates. When new updates are available, any user that belongs to a power-user-clan, like **lead**, or **sudo** gets notified on-screen when logged into Anon. This also applies if your website is on a repository and you've configured Anon to pull your site's source from there.

When new software updates are available you can merge them to "test" or install them to your live website. If you choose to test it first, then you can take it for a spin in Anon's **Navi** app (navigation).

<br>


### Simple yet powerful configuration
You can configure just about anything in Anon, it's one of its key principles; you can even change the repository origin of Anon's source itself. You can set path-routing, configure apps, and protection settings too, all without a single line of code.

![AnonConf](https://i.imgur.com/uarmU0f.png)
>*screenshot - all Anon's `apps` are in their own sub-folder and each have their own config files .. yours can be in here too, you can define you own Anon `stem` .. more on this in the geek section below ;-)*


Now that you know all this, you don't have to stress about *yet another new framework to learn* -because even if you don't "use" it, your website will benefit from installing Anon; though if you do, it gives you a lot of power to manage your business remotely.

<br>


## Intro for geeks
If you've skipped straight ahead to this section, consider reading the "non-geek" part above as it provides context.

To make a multipurpose framework that doesn't [suck](https://youtu.be/DuB6UjEsY_Y?t=10) is hard (pun intented) -because every business has different needs, though also need a framework of some sort, for reasons of conformity in a work-group, project, etc. -although there are trade-offs to consider, like: dependencies, learning-curve, development-time, complexity, developer-experience, server/client-machine-workload, user-experience, security, extensibility, scalability, portability, etc.

There will always be some trade-off with any framework, but, if "runtime-speed" is the main concern, pitch a server-upgrade to your client, or project-manager, but Anon is fast enough, however, you can always collaborate and make Anon better. The things you can do with Anon -and the tools it provides are worth it, you will see why in a bit .. hold onto your keyboard, it's about to get [freaky](https://youtu.be/wwvcp8gkR0M)!

![Anon Code](https://i.imgur.com/Kx7lJgt.png)
>*screenshot of Anon's Code app .. the `~` refers to the current logged in user's home folder, same in the terminal .. you can customize Anon for each user in just about every way imaginable with those files in your `Custom` folder*

<br>

### Directory structure

After installing Anon in a clean `web-root`, there should be 1 visible item, and 4 "hidden", but you can install Anon in a web-root that contains anything, even another repo. The info below packs a punch, but before you start stressing like a sweaty teen on prom-night, everything is documented (or should be at least), but the info below is intense, and condensed:

- `README.md` - this readme you're reading now .. you can delete it after installation
- `.htaccess` - apart from being the 1st entry point, it also contains your own rules (if any), fused together with Anon's .. this points to Anon's **receiver** only if Anon has not already started, or if the request is for anything related to Anon; else it runs your htaccess rules, or leaves it up to Apache to handle.
- `.anon.php` - Anon's **receiver** - it does a few checks and starts the bootstrapping process, or fails gracefully if the server can't handle it due to missing dependencies
- `.anon.dir` - the directory holding all of Anon's ***Stems*** (we'll get to those in a bit) -though the `Proc` folder (stem) in there holds Anon's core libraries.
- `.git` - local web-root repository .. if it already existed before Anon was deployed in your web-root, no sweat, this is actually grand because Anon then uses that repository's `origin` as origin of your native ***Site*** repo, so you don't have to configure it, it happens automatically upon deploy, before Anon deletes the .git, but all your files and folders remain intact.



<br>

### Repository structure

Anon uses 5 main repositories to make all the above possible.

***

<br><br>

## Installation
