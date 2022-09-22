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

By design Anon has ***no third-party service dependencies*** and it runs with whatever you have on your website, no need to change your existing site -or framework at all. Anon does not require any database access and runs without the visitor knowing about it; however, your team can use Anon to build your website -or web-application from scratch also and it's quick, because Anon is made to be developer-friendly for any **custom applications** you need.

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

In Anon's configuration settings you can enable to "stain" (watermark) your images automatically with your logo (or anything) -even before they get to the visitor's web-browser, by setting a resolution-limit and choosing an image to stain them with. You can also set the stain opacity in your configuration. This "staining" happens on-the-fly, so you don't have to spend hours in watermarking your images.

![AnonStain](https://i.imgur.com/tSOVD1b.png)
>*screenshot - an image watermarked with Anon's logo .. this "stain" can be SVG as well, so it scales well with very large images .. you can also set the "stainCoverSizing" to better suit your needs; by default it adapts to the image dimensions*

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

Anon tests browser-compatibility for you automatically with every visitor -and if all is ***not well*** it informs the visitor to either upgrade to a modern browser, or enable JavaScript -before your website is shown. This guarantees your website will show as advertised, so you don't have to worry about that. This whole process takes a fraction of a second, but solves a lot of issues regarding delivery and security -right from the start; and of course, "good-bots" are not exposed to this at all.

![NoJavaScript](https://i.imgur.com/C67pGAP.png)
>*screenshot - a human visitor's JavaScript is turned off .. yes it's not "pretty", but you can customize it*

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

Every action a logged-in user makes is recorded on the server. All these action-stamps have the date & time -to the second and is added up together as time the user spent on the system while logged in. A task can have a `WorkPath` assigned to it, so if digital work is done on a task it can be automatically billed per task, or per company. Business names are associated with email addresses in the **Bill** app's contacts, though you can assign a business-name to an email address in a docket; so it all comes together well and you can invoice your clients accordingly. If it's physical work, the time is recorded when you drag dockets between columns anyway, so it's okay.

In the docket, you can assign a company-name to any new email address that comes in, this is automatically used in Billing and Anon remembers to which company belongs what.

With all the above in mind, essentially it means you can spend less time on admin and more time on doing what you love; Anon has your back ;-)

<br>


### Automated updates and Git version control
You've probably heard about Git, but [here](https://youtu.be/w3jLJU7DT5E) is a short video which illustrates why it makes sense to use it. Git is free, there are many alternatives to GitHub, like GitLab and BitBucket; you can also host your own, for free.

Anon is fully integrated with git and depends on it for Anon-related updates -as well as updates made to your website from an external repository. When new updates are available, any user that belongs to a power-user-clan, like **lead**, or **sudo** gets notified on-screen when logged into Anon. Your own site updates apply if you've configured Anon to pull your site's source from an external repository origin-URL.

When new software updates are available you can merge them to "test" or install them to your live website. If you choose to test it first, then you can take it for a spin in Anon's **Navi** app .. "Navi" is short for "navigation".

![AnonUpdate](https://i.imgur.com/H9peL56.png)
>*screenshot - you can see what's happening in the back-end by viewing the web-console in your browser's "developer tools", but Anon shows progress on-screen anyway; you don't have to see the details, though you can ;-)

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

As mentioned in the non-geek-intro: you don't have use Anon's innate functionality; as a matter of fact, if you already have a website running by means of having an `index.html` -or `index.php` file in your web-root, Anon runs your site in a separate DOM (document object model) -and does not interfere with it at all; unless you code it to do so explicitly.

If you decide to use Anon, remember: there will always be some trade-off with any framework, but, if "runtime-speed" is the main concern, pitch a server-upgrade to your client, or project-manager, but Anon is fast enough, however, you can always collaborate and make Anon better. The things you can do with Anon -and the tools it provides are worth it, you will see why in a bit .. hold onto your keyboard, it's about to get [freaky](https://youtu.be/wwvcp8gkR0M)!

![Anon Code](https://i.imgur.com/Kx7lJgt.png)
>*screenshot of Anon's Code app .. the `~` refers to the current logged in user's home folder, same in the terminal .. you can customize Anon for each user in just about every way imaginable with those files in your `Custom` folder*

Anon runs primarily as an SPA (Single Page Application), as such it comes with pretty neat capabilities, which you will discover as you read along .. perfect segway for some more [music](https://youtu.be/VuTf0oKgQxw) .. is your coffee doing okay there? Grab some snacks, you'll love what's up next ;-)

<br>

### Rapid development
Anon is designed to be easy to use for developers; it's back-end and front-end functionality "feels" more or less the same; so if you are a full-stack developer, you should find this trait rather pleasing.

Let's face it: in "the real world" most apps are sold as if they already exist, then developers are told to make it reality -and be quick about it; this is where things could get nasty real quick as deadlines approach .. security issues and bugs creep in, etc.

To mitigate all this, Anon has some rather interesting ways to deal with it as you can quickly "hack" something to look -and function as expected -then do it properly after. This does not mean everything will just be a "hack-job" though; it's up to you -and up to the task at hand.

#### Words have meaning
The provided functions, objects and methods in Anon are designed to flow well in a sentence, making code easy to read, though keep in mind: English is not really "functional" -so best-effort is applied in both front-end and back-end.

#### Front-end tools
From ***modals*** through to live-data-tables, Anon has it covered, but if there is some tool you need, it's very quick to implement.

You can either define some component with the 3 general front-end languages separately (HTML, CSS, JavaScript) -or you can create it on-the-fly in one go with JavaScript; you can even "take over" (hijack) some existing events.

This does not mean everything could end up as a "hack-job", quite the contrary; although it will require looking at things in a different way; here's an example:

You can have a JavaScript file as "index" of a folder, even web-root; inside it you can `ordain` some CSS-class to look and behave a certain way and it will automatically apply to all of them -even new elements with the same class added to the DOM on-the-fly; like this:

```javascript
ordain('.someCSSclass')
({
   style:
   {
       background:`#BADA55`,
   },

   listen:
   {
      focus:function()
      {
          this.notify(`type your name here`,COOL);
      },

      blur:function()
      {
          if(!isWord(this.value,6))
          {
              this.notify(`I need a word`,NEED);
          };
      },
   }
});
```

In the above:
- `isWord` will check if the value contain only characters that looks like a "word" altogether, and additionally (optional) -that it is at least 6 characters long .. there are many `isWhatever` functions in Anon, like: `isVoid isText isBool isNumr isPath isList isKnob isFunc` etc. -and these are available in the back-end too -which work as expected .. `knob` is for "key-notation object"
- `NEED` is a constant in Anon and can be used in any way as it contains the exact text: `:NEED:`; however, in this context it refers to `.need` as a CSS-class -which is purple. Buttons are styled the same way and there are 5 different "tones" like this: `good cool need warn fail`. All this is used by Anon itself to make pretty UI components that "mean" something

In addition to the above "ordain", you can define an entire web page with JavaScript and you don't have to hack JavaScript inside a string inside the `onWhatever` attribute of an element; you can define both the element AND events in JavaScript and the debugger will be happy about it, like this:

```javascript
render
([
    {title:`My awesome Tab Title`},
    {h1:`Big heading`},
    {a:`Click Me!`, href:`/some/link`, onclick:function(evnt)
    {
        evnt.hijack(true); // lay off -this is mine!
        this.notify(`i was clicked, yet i did nothing`);
    }},
]);
```

The function `render` above operates in 2 ways:
- if no "callback function" is given, it replaces the `#anonMainView` contents with contents given
- if a callback is given it renders the content and calls the callback with the rendered content

If you give it a path to a file e.g. markdown, it will fetch it first, then render it as mentioned; so you can refer some "htm" contents (partial hyper-text-markup, as apposed to an entire HTML document) -or anything else.

The `render` function uses the `insert` method in Anon to `create` and "append" contents to a node; though, `render` replaces the contents, where `insert` only appends. There are several "crud-like" functions in the Anon front-end, some of them extend any Element (node) and others used directly, like this:

```javascript
let foo = create(`div`);
foo.insert(`<span>hello!</span>`);
document.body.insert(foo);
let kids = foo.select(`span`);

render({div:`#boo .moo`, $:`Hello!`});
select(`#boo`).modify({id:`gone`, class:`noodles`, onclick:function(){}});

remove(foo,`#gone`);
```

Anon has several "special tags" .. in the "render" example above: `view` is styled to span the entire window as `position:fixed` .. There is also `layr` -which covers only its parent, but is `position:absolute` instead.

Apart from the structure above being rather self-explanatory, the `evnt.hijack` is built into Anon and it does: `event.preventDefault(); event.stopPropagation();` .. if `true` is also does: `event.stopImmediatePropagation();` -which as you know, prevents any other listeners from doing anything .. All this really means is "short-hand", and it makes coding easy to remember and cleaner to look at.

You can also ***hijack*** existing events in your own site, or if you're making some quick hack-job for a client as "proof of concept" to some requirement, you can tell Anon to "hijack" which-ever events you want in the sub-DOM structure.

You can see how all the above makes your life easy; there's a LOT more of this magic in Anon, stay tuned ;-)

>*info - Anon uses its `hijack` in front-end to protect against script injections -but you pass in a `function` (not bool); although, as you've probably noticed: Anon uses "hacking methods" to provide security .. front-end and back-end .. obviously this can be (miss)-used to your advantage and block any other listeners from interfering .. don't get ideas .. #WasntMe ;-)*

<br>

### Directory structure

After installing Anon in a clean `web-root`, there should be 1 visible item, and 4 "hidden", but you can install Anon in a web-root that contains anything, even another repo. The info below packs a punch, but before you start stressing like a sweaty teen on prom-night, everything is documented (or should be at least), but the info below is intense, and condensed:


![AnonClean](https://i.imgur.com/gSkCe6s.png)
>*screenshot - after clean install .. on the right-hand view: "hidden" files are not visible, both views show the same folder .. this makes it easy to manually manage your structure without the fear of deleting any Anon files by accident, just keep "show-hidden-files" off and you'll be fine*


- `README.md` - this readme you're reading now .. you can delete it after installation
- `.htaccess` - apart from being the 1st entry point, it also contains your own rules (if any), fused together with Anon's .. this points to Anon's **receiver** only if Anon has not already started, or if the request is for anything related to Anon; else it runs your htaccess rules, or leaves it up to Apache to handle.
- `.anon.php` - Anon's **receiver** - it does a few checks and starts the bootstrapping process, or fails gracefully if the server can't handle it due to missing dependencies
- `.anon.dir` - the directory holding all of Anon's ***Stems*** (we'll get to those in a bit) -though the `Proc` folder (stem) in there holds Anon's core libraries.
- `.git` - local web-root repository .. if it already existed before Anon was deployed in your web-root, no sweat, this is actually grand because Anon then uses that repository's `origin` as origin of your native ***Site*** repo, so you don't have to configure it, it happens automatically upon deploy, before Anon deletes the .git, but all your files and folders remain intact.

<br>

### Stems
Botanically speaking, "stems" grow from "root", so these are simply folders in your web-root with some specific files in them that Anon will recognize and use accordingly. If a request is made to a "stem", or any of its contents, Anon will handle it for you, instead of your native framework -or Apache.

![AnonStems](https://i.imgur.com/NdJw3DQ.png)
>*screenshot - have a look at the top of the file browser .. the left shows all the stems innate to Anon .. the right shows ALL the contents of the Repo-stem after Anon ran the first "upkeep", explained below ;-)*

Stems cannot have the exact same name in your web-root as inside Anon, because stems can be referred to in web-address directly, like: `example.com/Site/base/dbug.htm` .. notice there is no reference to `.anon.dir`.

A folder in web-root will only be an Anon-stem if it contains a `aard.php` file. This is exactly the same as the traditional "index.php", although this makes it easy to find as it will show up first in any file browser.

You can also have `aard.htm`, `aard.js` and `aard.md` -each of which will be rendered as a web-page on the fly; this "rendering" happens client-side, so it does not require extra server-workload at all. You can also have these as "index.js" and "index.md" - no matter, Anon finds the "index" of any folder as a file that starts with `aard.` or `index.` .. though only with these extensions: `php htm html js md`.

If your stem has a `conf` folder in it, Anon will use its contents as configuration entries in the Proc-settings as shown above in the non-geek intro; all stems that have a `pack.inf` file in it will show up as an icon on your menu-bar; granted the pack.inf file contains an icon reference.

![AnonPack](https://i.imgur.com/5wFgXzx.png)
>*screenshot - contents of a "pack.inf" file .. if you have an `ethereal: true` in there, it won't show up as an icon in the Anon panel, same if there is no `panlIcon` specified .. note that the `phpVersion` is "at least"*

Every stem can have a `boot.php` and `keep.php` file inside it; if found, Anon will run these while bootstrapping; however, `keep` is only run periodically, and only in the **API** interface.

<br>


### Keep
Anon runs ***upkeep*** every few minutes defined (in seconds) inside your `Proc/conf/sysClock` config. This checks for any updates from your site-repo and anon-repo, removes stale locks, etc. This is what keeps Anon alive and well. When new updates are being installed to web-root, Anon locks the entire website momentarily and every visitor sees that the site is locked on their screen, though it does not kick them out and disappears when done.

This "locking" is to avoid any collision -or conflicts while web-root is being updated and only happens when a "AnonSystemLock" signal is received from the server.

### Signals
When the Anon-client is fully loaded (after your own website of course) it listens for [Server-Sent-Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events). On the server side it's easy to send events and some signals are special, like `dump`. Here is an example:

```php
<?
namespace Anon;

signal::dump("Hello there!");
```
The message above is base64-encoded (to avoid issues, not for secrecy) -and sent to the client as a `dump` event, which the client is already listening on. The client decodes it and logs this to the console as plain text.

There are many "special" signals, `AnonSystemLock` is one of them, though, this signaling has more power. If you don't specify a 2nd argument (parameter) then the signal is sent to the current visitor, even if they are not logged in. Signals only work when the target is live e.g: they have to have a live session going on; else there is no target to send the signal to, yet it won't produce any error, there is just nobody to receive, hence it never gets dispatched.

The 2nd argument is used much like CSS selectors, but with slightly different meaning, though you use a character in front of some word, explained below:

- `#wd5262vvj3286783jhv767` - targets a specific session-id -which is a specific visitor on the site, even if they are anonymous (not logged in, just a visitor)
- `@argon` - targets a specific username .. for if you don't have the session-id
- `.geek` - targets all users in a clan
- `*` - targets everybody .. every live session receives it

When a signal is dispatched on the server, it only writes into the session of the target(s) specified, nobody else gets it at all; however for double-security (in case something changes -or if "mistakes were made" -you can listen on the client-side defining which clan(s) can listen on that event name.

That "dump" part above is the event name; however, you can make that anything you want, without having to define -or extend anything. It works with the `__callStatic` "magic-method" in PHP, so, no sweat.

On the client side it's easy to listen for an event, like this:

```javascript
server.listen("bark",function(what){alert(what)});
// .. OR
server.listen("bark: gang",function(what){alert(what)});
```

On the server side the above event can be dispatched like this:

```php
<?
namespace Anon;

signal::bark("Woof!");
// .. OR
signal::bark("Woof!",".gang");
```

The speed at which events are dispatched is defined in your `Proc/sysClock/server` config, and by default it's 100 milliseconds -in which time it dispatches all events queued.

-By the way, in mentioning the config like this: `Stem/file/property` you can do this server-side in Anon exactly like that, here's an example:

```php
<?
namespace Anon;

signal::dump(conf("Proc/sysClock/server"));
```
<br>

#### Progress indication
Often you would just sit and watch as nothing happens on the screen, think the web-app is stuck and just hit refresh? Well, this can cause a whole lot of problems, like duplicate data-inserts, process collisions, conflicts, lock-picking, it's just terrible, but, with Anon's signaling you can easily tell the visitor "hang on I'm thinking" -AND show progress of how far it's done, like this:

```php
<?
namespace Anon;

signal::busy(['with'=>"SoftwareUpdate",'done'=>50]);
// the `50` is "percent"
```

Anon's `Busy` mechanism is unified and you can tell it to indicate as many different jobs as you want, each with their own percentage, and it will add it all up together and show overall progress, even if new job-indications are added while it's running. When all "jobs" in its queue are 100% it disappears automatically.

![AnonBusy](https://i.imgur.com/eDOamcp.png)

This indication is essential at times, because it covers all "clickable" things that could make life difficult for a database administrator (duplicates) -or anything else that could go horribly wrong if a user keeps clicking away at a non-responsive thing. Yes, one can mitigate that in the back-end, but thinking of ***everything*** while you're on a deadline is not always possible, we're only human (for now) -and things get out of hand; so this could save you "egg on the face" -moments during live-demos ;-)

One can also make it go away by pressing `Esc` (escape) on your keyboard .. the same with dismissing "modals" (dialogue boxes) .. neat hack, now you know :D

By default Anon does not show this indication on your own site, though you can enable it, but beware: some peeps hate it, because it nullifies their "instant gratification"; they just want to dismiss it if they have to "wait" -doesn't matter if it's half-a-second or 1 minute .. interesting phenomenon, but it is what it is.

<br>


### Server-side-includes in client-side documents
Let's face it, you need this, everybody does, so in Anon you can pull them into any `htm md js` file like this:

```html
<h1>(~ HOSTNAME ~)</h1>
```

You can also include the contents of a file like this:
```js
console.log(`(~ "/some-file.txt" ~)`);
```

You can even get the output of a server function; don't worry, Anon does NOT use "eval" at all, not server-side and not client-side; except in running commands from the terminal as `sudo` where you specify the language you want to run .. but that is dark-magic, though you *can* do it .. I won't tell if you won't ;-)

```js
console.log(`(~ conf("Proc/sysClock") ~)`);
// .. outputs JSON

console.log(`(~ user("name") ~)`);
// .. `anonymous` .. or whichever the current user is
```

<br>


### Plugs
Anon provides a pretty neat way of performing "crud-like" actions on different remote interfaces, like email, ftp, mysql, etc. A "plug" in Anon is a line of text that specifies the "schema" (protocol), user, password, port, etc -and they all work via an ORM called: "plug". These different schemas (plugs) exist as libraries in `Proc/plug` as "adapters", so you can even make your own, or improve on the ones provided.

Here are some examples, each line is a separate plug:
```
ftp://mickey:m0us3@example.com/public_html
mysql://mickey:m0us3@example.com:3600/mainDB
mail://mickey:m0us3@example.com
mail://mickey:m0us3@example.com:993/?smtp=pluto.me:25
```

If you save this in a plain text file with extension `.url`, Anon will use it as a plug to open the resource, like a "hyper-conduit". These are NOT accessible to the general public at all and can only be seen and edited by users that belong to the `sudo` and `lead` clans.

Plugs can only be used server-side, and is really simple, yet also uniform, like this:

```php
<?
namespace Anon;

plug("/myStuff.url")->select("*");

plug("mysql://mickey:m0us3@example.com:3600/mainDB")->insert
([
    using => "users",
    write => ["Frodo","Baggins","frodo@theshire.tv"]
]);

plug("mysql://mickey:m0us3@example.com:3600/mainDB/users")->insert
(["Frodo","Baggins","frodo@theshire.tv"]);

plug("ftp://mickey:m0us3@example.com/public_html")->insert
([
    "new-file.txt" => "Hello there!"
])

plug("ftp://mickey:m0us3@example.com/public_html")->delete
([
    where => "name = new-file.txt"
])
```

The `using` and `write` are defined constants in Anon (there are many) -and each are exactly 5 letters long. All this is only possible if you are actually running a PHP file via Anon and inside the `Anon` name-space like in the example above.

Plug adapters are path-level-aware, so the last `insert` above should work as implied by "path".
Many functions and methods in Anon work on by what is "implied" directly (implicit in context) -which makes things simple and flexible so you can express your logic the way you want to; so these inserts above will use the table-fields as "implied" in order, though you can also define inserts by `key => value` and it will use the keys as field-names.

The **Help** documentation covers more about this (explained below), although you can always define a new plug-adapter and contribute it to Anon; making it better for everybody -including yourself.

<br>


### Help
In order to get help with anything when logged in, just click on the ***Help*** menu button, Anon has a stem dedicated to "help", and, each stem (even your own) can have a `docs` folder in it and the contents are expected to be plain markdown files.

![AnonHelp](https://i.imgur.com/jmMa5Le.png)
>*screenshot - Help with front-end coding in Anon .. shows how to create dialogue boxes*

All the stems with a `docs` folder are listed in Help, so it's easy to find help related to any stem. You should find most of the info you need in these help-docs, though it may require some TLC.

<br>


### Repository structure and CI-CD

Anon uses 5 main repositories; 2 is "remote" and 2 is "native" and 1 is in web-root.

#### Remote
The 1 remote is your own website, called `site` -which may or may not be defined; it doesn't exist if not specified as having a `SiteOrigin`-url in your `Repo/gitRefer` config.

The other "remote" is actually local but referred to as "remote" in git as it is a ***bare*** repository, called `tank`. This is used for fusing Anon together with your site and where local work gets pushed to and pulled from.

#### Native
This contains the ***non-bare*** `anon` and `fuse` repositories .. as you may have guessed: the `fuse` repo is used to combine your website source with Anon.
When new updates are available in either anon-remote, or site-remote, and you click to install them, then these updates are pulled into the native `anon` and `site` repositories respectively and their contents copied into the `fuse` repo -which gets pushed to `tank`. The `root` (web-root) repo pulls from `tank`.

Any work done in the fuse-repo gets committed and pushed to tank, the same with the web-root repo; although it pulls first before it pushes. The contents of the root -and fuse repos should always sync; even so, having `fuse` separately give you some room to play as you can test it live without merging with root.

Each user has their own repository, cloned from `tank.master`, yet on their own branch -named with the username as suffix, e.g: `user_frodo`. When a user chooses to "publish" their work it gets pushed to `tank.user_frodo` and gets pulled into e.g. `fuse.user_frodo`; where it gets merged with `fuse.master` upon either "Fuse Only" or "Install" when prompted to install new updates. All this happens automatically and if "Fuse Only" is chosen, then all work is ready for testing -before merging with `root.master`.

The project-manager (or team leader) can test any branch individually in the `fuse` repo by manual pull -and check-out, or test `fuse.master` after "Fuse Only", by using ***Navi***. Once all is working as expected in `fuse.master` it can be manually pushed to `tank.master`, then pulled into `root.master`.

When running a full software update, Anon commits a "restore-point" in the root-repo, then performs **unit-tests** on `fuse.master` -before merging with `root.master`; if the testing fails it reverts to the restore-point and fails with whichever messages came from the unit-tests. You can define any unit-tests to run in the `Proc/unitTest` config. You can also define **unit tests for the front-end** as JavaScript files -which will be run when using **Navi** to test the fuse-repo; so both the back-end (database incl) -and front-end can be tested to make sure everything runs according to the expected business-rules.

Branch checking, switching and merging should be done in the ***Repo*** app; even so, an experienced user can do it manually from the `terminal`, though, working in web-root manually can cause major issues as collisions, conflicts, etc, so: when you do, this would be a good time to pull out that "black magic" to lock the site while you are busy and unlock it when done, like this:

```
sudo php `siteLocked(true,"Hold on peeps")`
0b8d61bd7dc6cd9d81852c5b5189891e3f444358

# .. do some work

sudo php `siteLocked(false,"0b8d61bd7dc6cd9d81852c5b5189891e3f444358")`
```

You will have to belong to the `sudo` clan in order to do this, and you will be prompted for a password to authenticate "sudo" commands, like `git`, etc.
You can also run direct "bash" commands in the terminal like this:

```
sudo sh `git --version`
```

These commands should run even if PHP is in "safe mode", but, please be careful; with great power comes great ways to stuff up if you're not mindful.

***

<br><br>


## Installation
Installing Anon is quick, but you can do this the easy way, or the way of the Jedi :D

### The easy way
1. copy this link: `https://github.com/CharlSteynberg/anon#manual-installation`
2. contact your hosting provider and ask them to install it for you, send them the copied link

<br>

### Manual installation
It's important to check that your target host (server) configuration meets the basic requirements before you install.

#### Dependencies
The following is what Anon requires ***at least***
- Operating System: **Linux** .. if you intend to run this on a Mac -or on Windows, you can run Linux in a Virtual-Machine, like [VirtualBox](https://www.virtualbox.org/).
- Web Server: **Apache** .. at least v2.2 -although **v2.4** is expected .. make sure `AllowOverrides` is `on` in the Apache config, or vHost conf.
- Handler: **PHP** .. at least v5.6 -although **v7.2** is expected .. if any extensions are missing Anon will inform you.
- Permission: make sure your Apache-user can write inside its own web-root directory.

#### Installation procedure
1. click <a href="https://raw.githubusercontent.com/CharlSteynberg/anon/master/.anon.dir/Anon/base/deploy.php">here</a> to see Anon's [deploy.php](https://github.com/CharlSteynberg/anon/blob/master/.anon.dir/Anon/base/deploy.php) file in plain text; copy all that by pressing: `Ctrl a` then `Ctrl c` on your keyboard, then create a new file on your local computer and name it e.g: `anonDeploy.php` and paste all that text inside it and save.
2. copy that `anonDeploy.php` file to the target website's web-root folder, like `public_html` -via any means, e.g. FTP -or if mounted via sshfs then just use the terminal, or your file-browser
3. visit the target URL in your web-browser e.g: `example.com/anonDeploy.php`

You should see a confirmation screen like this:

![AnonDeploy](https://i.imgur.com/9FKpPPA.png)

When it's done installing it will remove this `anonDeploy.php` file automatically and redirect to your website.

- if you already had a website running with an `index.php` -or `index.html` in web-root, you should see it now; with no change at all.
- if this was a clean Anon install, you should see a "UNDER CONSTRUCTION" page

<br>

### After installation
In order to login, click 4 times on your website, even if it's the "under construction" page, you should now see a login dialogue box.

Anon comes with 2 innate users: `anonymous` and `master`. The **anonymous** user belongs to the `surf` clan, and **master** belongs to the `sudo` clan.
To login with **master** the first time, the password is: `0m1cr0n!` .. you need to change this immediately, so the first thing you will see is a prompt to change the master password, and to provide an email [plug](#plugs) for Anon to use for sending email to e.g. new users added, etc.

The login dialogue is for general users that are afraid of the terminal, but I know you're not afraid of anything, so just hit `Esc`, or close that; you will find the terminal very handy ;-)

To get started with the terminal, even if you are not logged in, just type: `help` and hit enter on your keyboard.

![AnonRepl](https://i.imgur.com/5aTl4nN.png)
>*screenshot - Anon's terminal*

You can hide the Anon-panel any time by just clicking on the screen 4 times .. to show it again just click 4 times.

***

<br><br>


## Documentation
All the **Help** docs are written in markdown and you can browse them [here](https://github.com/CharlSteynberg/anon/tree/master/.anon.dir) by opening the `docs` folder inside each of those folders listed; here's an [example](https://github.com/CharlSteynberg/anon/blob/master/.anon.dir/Code/docs/back-end/errors.md).

These help-docs are not complete (yet) but this Readme -together with the Help should get you up to speed quickly. Anon is built to be simple, yet powerful for developers.

>*if it's not easy to use, then it should change*

***

<br><br>

## License

>MIT License
>
>Copyright (c) 2020 AnonClan
>
>Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
>
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
