#### autoMail

The `autoMail` configuration value needs to be set in order for this framework to function properly.

For the sake of brevity, below is an example of how to do this, after which explanation will follow,
 but you need to do this in the terminal as a user with `geek` privileges, such as *master*

```
echo "mail://username:PassW0rd@example.com" >> /Proc/conf/autoMail
```

That command simply writes some text into a configuration file.
In this case, this text has very special meaning to Anon, because it's a URL standard that Anon uses
as "connection string" to securely connect to an existing email account in order to send/receive email.

You should have an existing email account for this; like: `mailroom@(~HOSTNAME~)` -recommended
Using `mailroom@(~HOSTNAME~)` as example, "mailroom" will be the `username` part in this URL.

Take care when you construct your own connection string as above, here's why:
- every special character in that text has special meaning in a URL, no spaces allowed
- you cannot use the `@` -or `:` symbols in your password, anything else (except white-space) is fine
- the password must be the exact password for this existing email account

This URL standard is used everywhere in protocols such as FTP, HTTP, WS, etc.
In Anon this has special meaning; let's break it down:
- the `mail://` part means this connection will use a CRUD plug (scheme) named "mail"
- the `username:PassW0rd` part is used for authentication, like: `master:0m1cr0n!`
- the `@` symbol signifies that the server you want to connect to is up next
- the `example.com` part is a server that [in this case] handles emails

Even though you *can* use Gmail as an automail account in Anon, we recommend using your own creation.
If you're gonna use Gmail, you have to enable IMAP in your settings, and also "allow third party apps",
-the password is that Google account's password.

> Don't worry about "what if somebody gets the password!" - no one can access your Anon configuration,
  except `master` and the people you give permission to do so; the general public has no access, period.
