# Anon

>*free multipurpose framework for remote business management*


## Introduction

This is some cheesy introduction pitch to grab your attention; if it's not working yet, grab your favorite beverage, [here's some music](https://youtu.be/LLPoZGX0qZk?t=665) that goes well with what Anon is about, so you can experience a proper introduction.

If you already know about Anon and just want to install, see the [Installation](#Installation) section below. The rest of this introduction is sectioned as 2 demographics: for [non-geeks](#intro-for-non-geeks) and .. the [rest of us](#intro-for-geeks) -but reading both may grant you super-powers, you never know ;-)

![Anon Draw - screenshot](https://i.imgur.com/wr7Ete2.png)
>*screenshot of Anon's built-in Draw app*

<br>

### Intro for non-geeks
Whether you are a business owner, CEO, project-manager, or just want to know what Anon can do for you; the following is brief, but intense, so strap on your thinking cap, it's about to get real.

By design, Anon runs with whatever you have on your website, no need to change your existing site -or framework at all. Anon does not require any database access and runs without the visitor knowing about it.

With that out the way, here's what Anon brings to the table:


#### Role-based access
Have you had to give somebody your "FTP details" -or your server-admin panel details just so they can change a picture, or edit something on your website?

Every time you do, there is this lingering feeling about "what if this random stranger defaces my website..." - yep the risk is real; that is why in Anon you can create users and invite them to clans (groups), like **draw**, or **geek**, **mind**, etc. There are many clans, and you can also define your own.

In Anon, a user can only do what their clan have access to, so, if a user belongs to the **draw** clan -then they can use Anon's built-in graphics editor to make/edit pictures for you, but they cannot "code" anything, unless they also belong to the **geek** clan. This defines responsibilities of each person you give access to your system and your online-business is structured accordingly.

![Anon Panel](https://i.imgur.com/WBBouH8.png)
>*screenshot of Anon's web-overlay panel once logged in .. users can prettify their own private Anon workspace -or customize with JavaScript .. the terminal is drag-resize-able .. or you can hide it in your Custom style css ;-)*

<br>


#### Security
Anon has several security features, for both your web-server and web-client (visitors), called front-end and back-end respectively; though, as you may already know: your web-server serves (or produces) your visitor's visible content, so, with that in mind, here are a few security-related things you will find Anon useful for:

**Client ~ front-end**<br>
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

**Server ~ back-end**<br>
As you may have heard: there are good web-crawlers that work for you, but also the bad kind -which scrape your website for personal information; this is how many social media businesses get bad press and lose customers, or worse...

When Anon is installed on your website: every time a visitor visits your site, Anon does a few checks in order to identify which kind of visitor is visiting and renders a tailored response. This way your website-links look good on social-media when shared on various platforms.

When a "visitor" does something only a bad-bot will do, like: visit places on your website it is explicitly told **not** to (by robots.txt and "no-follow" links), then Anon [ensnares](https://en.wikipedia.org/wiki/Honeypot_(computing)) and redirects them into a never-ending pool of useless data -which causes list-poisoning in the crawler's database, rendering their generated "leads" useless -which has no monetary value.

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


#### Task Management and Time tracking
-organized in "tickets" with 4 simple columns: TODO, BUSY, HOLD, DONE; and even though this may seem little; your incoming-job-handling in your business has to have a handling pile-line in staff, or prosess-flow of how you want to serve your customers; from basic "Handy-Man", through to T-Shirt printing and software development alike; now you have it on you everywhere you go; Anon locks itself out when the user is not responding -and logs the time, for whichever billing you may have in mind;
- **simplified billing** -
- **auto-time-tracking** -for anyone authorized to login to your Anon system and do some work, making billing for separate tasks accurate and effortless for the participants
- **git version control** -for keeping track of changes to your website and automating updates to Anon and your website, though it won't install without confirmation ;-)
- **authoring tools** -built-in graphics-editor, code-editor and database-management

Now that you know all that, you don't have to stress about *yet another new framework to learn* -because even if you don't "use" it, you still get benefits from installing it.

So even if you're already running [WordPress](https://wordpress.org/), [CodeIgniter](https://codeigniter.com/), (and friends) -or your own hand-rolled creation, Anon has your back ;-)

<br>


### Intro for geeks
To make a multipurpose framework that doesn't [suck](https://youtu.be/DuB6UjEsY_Y?t=10) is quite a challenge, because everybody has different needs, though also need a framework of some sort, for reasons of conformity in a work-group, project, etc. -although there are trade-offs to consider, like: dependencies, learning-curve, development-time, complexity, developer-experience, server/client-machine-workload, user-experience, security, extensibility, scalability, portability, etc.

There will always be some trade-off with any framework, but, if "runtime-speed" is the main concern, pitch a server-upgrade to your client, or project-manager, but Anon is fast enough, however, you can always collaborate and make Anon better. The things you can do with Anon -and the tools it provides are worth it, you will see why in a bit .. hold onto your keyboard, it's about to get [freaky](https://youtu.be/wwvcp8gkR0M)!

![Anon Code](https://i.imgur.com/Kx7lJgt.png)
>*screenshot of Anon's Code app .. the `~` refers to the current logged in user's home folder, same in the terminal*

***
<br><br>

## Installation
