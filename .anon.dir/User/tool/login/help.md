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

- these commands have nothing to do with the underlying Operating System (OS),
- these users are virtual and do not have any permissions in the OS at all.

If you use these commands without any `username` it means the same as `master`.
After you've typed this command - followed by a registered username, hit enter.
You will be prompted for a password; type your password and hit enter.
If all went well, the view/page will refresh and you will be logged in.


### FIRST TIME
If you are the one who installed this framework, then use:
- username: `master`
- password: `(~/Proc/info/pass.inf~)`

Directly after first login, change your password to something else.
To get help with changing a password, use command: `help user`
Remember your new master password, or save it some place safe.


### FORGOT PASSWORD
It happens, don't stress, you can use either of these commands:
- `user pass username ?`
- `passwd username ?`

.. in the examples above, just replace "username" with your actual username
Your password will now be reset to a new randomly-generated password,
 -which you will receive in an email.
