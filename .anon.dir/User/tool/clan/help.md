# user - command manual

This is used to manage users and their privileges on this platform.
Here are some examples for brevity, explanation follows after:

```
   user make frodo mail:frodo@theshire.tv clan:work,geek
   user edit frodo name:bambi mail:bambi@mordor.tv clan:-geek,+draw pass:Fr3ak0ut!
   user pass bambi
   user info bambi
   user list
   user mesg bambi "you are terminated"
   user void bambi

   useradd frodo -M frodo@theshire.tv -G work,geek
   usermod -l bambi frodo & usermod -M bambi@mordor.tv
   id bambi
   passwd bambi
   lsusr
   userdel bambi

   invite frodo geek
   banish frodo geek
```

Any Linux-like command works as expected, with some exceptions.

If the `useradd` and `usermod` commands are used, the `-M` option refers to "mail".

When creating a new user, their email address and at least 1 group (clan) is required.
Upon creation of a new user an email with credentials and instructions is automatically sent.

Editing your password requires that it adheres to "strong password" compliance; these are:
 - at least 1 uppercase letter
 - at least 1 lowercase letter
 - at least 1 number
 - at least 1 special character

The *URL-friendly* "special characters" are: `! # $ % ^ * - _ ; , . ~ ` .. no spaces
  not that you should use your password in any URL .. this could become technical, but,
  `/` , `:` and `@` are used for demarcation in URL standards compliance.
  Other characters like `< > ( ) { }` may clash with 3rd party libraries.
  Anon uses this standard for "plugs", in which you can specify authentication credentials;
  for more info on this, see the manual, but the public has no direct access to `plug` details.
