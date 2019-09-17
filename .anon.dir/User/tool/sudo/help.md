# sudo - command manual

This is used to run dangerous commands reserved for sudoers.
Here are some examples for brevity, explanation follows after:

```
   sudo js `alert("hello world");`
   sudo php `print_r($_SERVER);`

   sudo sh `whoami`
   sudo sh `git pull origin master`
```

This deviates from Linux completely, except commands given to `sh`.

**!!! DANGER !!!**

These commands are *VERY* dangerous and should NOT be tried at home or AT ALL.
If you find yourself in a tight spot and there is NO OTHER WAY, then go ahead.
Fair warning: you could lose your entire website, timelogs, users, everything.

***PLEASE BE CAREFUL***

... you were warned; now go ahead and hack like you mean it!
