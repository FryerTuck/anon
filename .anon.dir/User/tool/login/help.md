# login - command manual

This is used to login with a username and password.
Here are some examples for brevity, explanation follows after:

```
   login
   login spaceAlien

   su
   su spaceAlien
```

Any Linux-like command works as expected, with some exceptions.

These commands have nothing to do with any users registered on the server,
  these users are virtual and do not have any permissions on the server at all.

If you use these commands without any `username` it means the same as `master`.
After you've typed this command - followed by a registered username, hit enter.
You will be prompted for a password; type your password and hit enter.
If all went well the view/page will refresh and you will be logged in.

** IMPORTANT **
If this is the first time using this and you are the one who installed this
  framework manually, then use the username: `master` with password: `0m1cr0n!`
  -then directly after login, change your password to something else.
  To get help with changing a password, use:
    help user
  Remember your new master password, or save it some place safe.
