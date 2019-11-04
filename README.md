# Anon

><small>*free multipurpose LAMP framework that relates less to hoo(v/k)ers*</small>


<!--[/User/note/homePageWorx.md]--->

## Introduction
To capture an intellectual audience within the first paragraph is tricky, but have a read, you're about to get blown away!
Even though Anon is a "general purpose" framework, it's tiny, yet built to be secure both in back-end and front-end.

As you probably know, security comes at the cost of speed and complexity; however, Anon is made to be as simple as possible, to save you (dear reader) the hassle of over-complicated nonsense so you can focus on the task at hand. That sounded like a cheesy sales pitch, but bare with me as the *devl* is in the details. If your are not a programmer -or just want to install it, ogle the pictures or skip ahead.

Anon is built on a set of simple principles expressed in the acronym: ***CANDRYKIS*** .. which is:
- **Compartmentalized And Nomadic** - modular design, each module (folder) can just be copied to another place and edited as you wish
- **Don't Repeat Yourself** - keeping code as short as possible, focusing on either no -or minimal word/line/block-duplication
- **Keep It Simple** - less complex, few levels of indentation, using small functions and/or constants as technical syntax

In order to describe what Anon is about, I'll use the same principle above, so without further word-crud, let's get into it.


#### File Structure
Anon's initial file structure is (wait or it) ... "hidden".
After installing Anon, the only file you should see in your file-browser is the "README" - granted that your "show hidden files" option is off.
![Imgur](https://i.imgur.com/B2uW2ZU.png)

This means that you can just create/drop your code in the main *web-root* of your web-server and not worry about over-writing anything.
The same applies if you just want to delete all of it, just select-all and delete, no worries; remember to keep your "show hidden files off" though.
Anon is not "supposed" be used this way, but, this was to explain that it does not get in your way if you just want to use Anon for some quickie.

This is not "the way" to use Anon; the actual way is to use the built-in "Code" editor, but this is to illustrate that the "built-in" apps do not interfere when Anon is used the "traditional" way web-developers are used to; except, don't mess with the "hidden" files, such as the `.htaccess` -unless you know exactly what the code in there does and why.

The rest (below) describes how Anon works "under the hood" - if you use it as intended.

Every folder (directory) in your web-root can potentially be a "stem"; botanically - stems grow from "root"; this simply means that you have a folder in the web-root of your server and inside it a file named "index.php" (-or aard.php).
> If you use "aard" it shows up first in your code-editor, so you don't have to fumble around to find it.

Every **stem** can have its own configuration; the config-folder-name in a stem can be any of these: `conf config settings cfg cnf`.
If you have a "crawler" file in a stem's config-folder, then its directives are used cumulatively with all the other stems' crawler-config in order to dynamically serve a "robots.txt" file -but this only happens upon request of said "robots.txt" explicitly.

Lastly, Anon is fully integrated with ***Git*** and each stem can be a "normal" repository as the primary git-repository-config ignores `.git` folders.
Every (non-public)-user also has their "own local clone" of the "web-root" repo, but it runs in a special branch called "tanker" -which is used to collect the work of all the collaborators when they "publish" their work. A sudoer can merge the `tanker` with `master` when all is well.

#### Interfaces
Anon responds to each request in a way that compliments the request; these "interfaces" are identified automatically per request:
- **BOT** - `web-crawler/robot` ~ if a visitor identifies itself as a robot, then it is served with content intended for web-crawlers
- **GUI** - `Graphical User Interface` ~ happens once per session, or upon refresh; Anon works as Single-Page-Application (SPA) -hybrid
- **DPR** - `Direct Path Request` ~ any request after ***GUI*** that is NOT *API* -or *SSE*
- **SSE** - `Server Side Event` ~ the server responds with "event-signals" as expected
- **API** - `Application Programming Interface` ~ response is in "plain text" (-or JSON), but only if XHR requests were made *FUBU* (for us by us) -or from another server -if an API-key is provided along with required headers such as "INTRFACE" and the key exists as file in your Anon server API-keys.
>The contents of an API-key-file is the original API-key


#### Security
On the server side, if any of the "interface" requirements are violated, then the server responds with `503 Service Unavailable`. Such violation can be triggered upon various criteria, but 1 example is: when you have a rule in your "robots.txt" that denies access to some folder/file (path) -and a visitor tries to visit said path -then a *kban* is raised and that visitor is shut out for some time -which is configurable.

Any sensitive data such as users, config, plugs, or API-keys, etc - are NOT directly accessible by the public in any way (except if you explicitly make it so on the server-side).

When the *GUI* is served, a "client-side bootstrapping" sequence is initialized.
1. Some minimal HTML, CSS and JavaScript is served for "probing" the client (user-agent/browser)
2. The HTML + CSS presents a "honey trap" - hidden from humans - as (no-follow)-link which is configurable
3. The JavaScript waits some milliseconds for the bot (if any) to fall in the trap, if the trap was ignored then the visitor is probably human (or a very clever bot) and then tests if the browser is "modern"; if not then the visitor is presented with a a notification to upgrade
4. The JS also checks if cookies are enabled, if not, then the visitor is notified to turn on cookies; this is for better security and UX.
5. One last JS check is done (hidden in an encrypted/obfuscated cookie) - which checks if the server-side canonical-host matches the client-side host, if not identical then the visitor is kicked out
6. If all went well, the GUI-bootstrapping is completed and the requested URL is served.

In each *stem* you can configure which paths are not accessible. Additionally you can set extra (config) security for images larger than a specified resolution, so if an image is requested directly (the GUI-strap happens regardless) and the image is served with a watermark of your choice. What all this really means is you have absolute control over what gets served; so nobody can leech images or any digital assets from your website, -if you choose it to be so.

Lastly - still on the client-side, if a visitor tries to inject some code into the "dev-tools console", or in the address-bar, or by manipulating an "onlick" event (or anything really) -which was NOT done *FUBU* (or us by us), then the visitor is kicked out.

![Imgur](https://i.imgur.com/v8HZyE2.png)

Anon has a built-in user privilege system, which is mainly used for the *WorkPanel*, but you can use it in your projects as well. You can also be logged in using multiple (different) browsers in order to work/test more efficiently. The user groups are called "clans". A typical "anonymous" visitor automatically has a username ("anonymous") -and belongs to the "surf" clan. Your members/subscribers can belong to the "back" clan (as "backer").
User passwords are NEVER stored "as is", they are hashed and stored (as hash) in a place that is not accessible to anybody; so not even users in the "sudo" clan can see your password. Additionally, a user can reset their own password, or a ganger/leader/sudoer can change your email address -or issue a password reset on your behalf - in which case you get an email with a temp password -which you can use to log in and change as you wish.

Any errors that occur either front-end -or back-end are hidden from the general public; you can only see the error-details if you are logged in as a user that belongs to the "geek" or "sudo" clans -which means you most probably work or the company or you were given such privilege explicitly.
In the case of an error and if you are only a "surfer" -or "backer", then all you see is prompt that mention that there was an error - and the visitor can either "ignore" it, "refresh", or "report bug and refresh".

![Imgur](https://i.imgur.com/vcVwfi3.png)

On the server-side, Anon is "name-spaced", so if you want to use Anon's features in a PHP file, just use `namespace Anon;`.
>More info in the *Help* docs.

#### Utility
When a folder -like `/` (web-root) is visited, Anon looks for any "aard or index" (-or README) -prefixed file-names in the order of file-extensions
1. `.php`
2. `.js`
3. `.md`

If that last one got your attention, you're right; you can have sub-repositories in Anon and your `markdown` files are rendered as web pages on the fly. This "rendering" happens client-side to save the server from extra work-load; (same reason why bots are served what they need).
Directory-listing (raw folder viewing) is disabled (config) by default.

You can also have `.js` files be served as web-pages, like this:

```javascript
document.body.insert
([
   {h1:`Testing 1,2`},
   {div:`#someID .someClass`, contents:
   [
      {span:`Hello!`}
   ]},
]);
```

The above example has the advantage of having event-functions as actual JavaScript, which makes debugging much easier.


#### Intro conclusion
There is a lot more info available in the "Help" docs; each stem can have its own "docs" folder -which is used to render as part of the documentation within the Anon ***WorkPanel*** -up next ;)
Now that you know more about "the boring tech stuff", next we explore the productivity tools and collaboration integration built into Anon.



## WorkPanel
Anon's *WorkPanel* is a collection of productivity apps which you can use to do your work directly on the server, while Anon tracks your time for you and you can use the Task-manager (kan-board) to organize what you need *TODO* or what you're *BUSY* with.

![Imgur](https://i.imgur.com/BF2esAD.png)

You can of coarse style your workpanel any way you want - just as you can style any of its "apps" (icons on the left) by using your own (personal) "skin.css" file - (more on that later).

Every **stem** can have its own "pack.inf" file - in which you can specify some dependencies, or permissions, etc. I you want your app to be shown in this workpanel, then you can simply give your app a "panlIcon" name in there (font icons are built in and browse-able).

The "terminal" (console, or simply CLI) you see there is very useful, you also use it to log in, or to pull updates from your remote repository, (-but you'll need "sudo" permission for that) .. This is NOT the "root" user/group in the underlying operating system, and Anon's users are "synthetic" - not part of the OS (at all).


### TreeMenu
This can be used to import/upload/create/delete repositories, files, folders and *plugs*.
A "plug" in anon is like a link, but, more like a "hyper-conduit" -which specifies credentials to use for remote resource access such as FTP-directory or MySQL-database.
> More info in the *Help* docs

![Imgur](https://i.imgur.com/nLQkRy5.png)

#### Task
The *Task* app is used to see if you have anything "TODO", or move along any work you've done to the "TEST" users for quality control (peer review).

![Imgur](https://i.imgur.com/TaDS7no.png)

You can configure an email address to use for tasks. New tasks come in either via email, or directly from within the code - where a task is identified by `title + filename` and each time that specific "todo" is called within the code, then the "hits" increment - as indicated in the picture.

Tasks can also be assigned (-or incremented) this way via the front-end when a user clicks to "report bug and refresh" when an error pops up.

Every task starts with its initial text as first comment - upon which you can reply. I the task was sent via email then your response will automatically be sent via email; i they reply -it will come in as another comment in the same task.

Comments can be rated. This is a way to decide (vote) on ideas, or to up-vote (or down-vote) a client. You also earn "ranking" this way, which ties in together with the user-privilege system, again, so; this is a way to prevent "noobs" from accessing/editing/deleting the wrong (sensitive) config/data.

In the back-end, you can grant access to all of this very easily, per file on class-method, or function like this:

```javascript
// by rank
   permit::rank(12);

// by clan
   permit::clan('work');

// in bulk
   permit::fubu('clan:geek,mind,lead','rank:12');
```

This way you can keep out those who don't know what they are doing (yet) in order to prevent nasty accidental issues.

When a task is opened (double-click) it can be edited. If the sender's email address is one of the registered users in the "work" clan, then the company assigned is your company name (configurable). If the email address has not been tagged with a company-name before, you can set that. You can also set a "workPath" and all the work you do inside this "path" (folder or file) will be used to calculate time spent on it by company/task. So this can be used for billing, accurately.

>Every time you access or edit a file in the *Code* editor, or *Draw* (graphics editor), or *Data* minding, then that action is recorded along with the user and timestamp.


### Code
The code editor is nothing short of pure awesomeness (biased opinion). It "feels" a lot like Atom (inspiration) and it also comes with bulk-find/replace - which can be used by folder -or file path.

Have a close look at the image below, I'm sure you can figure out the (intentional) details:

![Imgur](https://i.imgur.com/IKpMOUZ.png)

You can also edit database sprocs (stored procedures and functions) with it when you `Ctrl click` it from within a DB-tree (tree-menu).


### Draw
The image editor is "simple yet effective". It has basic graphics editing unctions such as zoom, crop, layers, hue, blur, glow/shadow, (gradient)-fill, stroke, etc. With little practice you will ind it quite useful.

![Imgur](https://i.imgur.com/mXHntNl.png)


### Data
You can explore/edit data quite easily via "plugs" -and run queries using the terminal.
To edit a field in a row, just `Ctrl click` it, change what you want and hit Enter to save. Currently it's compatible with MySQL and SQLite; the latter is used by Anon for time-tracking.

![Imgur](https://i.imgur.com/VWCvsSO.png)

***


## Installation
- You'll need a Linux OS (virtualbox works too) with Apache & PHP installed.
- Clone the repository, or download & extract its contents to your web server, then visit its URL
- Log in (instructions below) and change the `master` password
- (optional) - change the `remote origin` of this (cloned) repo to your own.

#### Getting started

In order to change anything in your Anon system (the Anon way), you'll need to use the *WorkPanel*.
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
