# path - command package manual

This is used for simple C.R.U.D functionality on files and folders.

** IMPORTANT **
These commands have a lot of power, please be careful.

Here are some examples for brevity, explanation follows after:

```
   path make /path/of/new/dir/note/trailing/slash/
   path make /path/to/file
   path mode /path/to/file/or/dir 755
   path gain /path/to/file "Hello World"
   path scan /path/to/file
   path scan /path/to/dir
   path copy /Proc/temp/logs/dump /some/copy/of/dump
   path move /Proc/temp/logs/dump /some/other/location/dump
   path void /path/to/file/or/dir
   path goto /path/to/dir

   mkdir /path/of/new/dir
   touch /path/to/file
   chmod /path/to/file/or/dir 755
   echo "Hello World" >> /path/to/file
   cat /path/to/file
   ls /path/to/dir
   cp /Proc/temp/logs/dump /some/copy/of/dump
   mv /Proc/temp/logs/dump /some/other/location/dump
   rm /path/to/file/or/dir
   cd /path/to/dir
```

Any Linux-like command works as expected, with some exceptions.

When using the `path make` command to create a folder,
  remember to include a trailing `/`

To replace the contents of a file, use: `path make /path/to/file.txt "hello"`
To remove the contents from a file, use: `path make /path/to/file.txt ""`
To rename any file or folder, use like: `path move /path/of/old /path/of/new`
To remove the contents from a folder then `goto` it and use: `path void *`

The `scan` -and `ls` commands will list the contents of a folder,
  these work with -or without any arguments, i.e: no "path" is fine.
  If you want to list "hidden" files also, then append ` -a`

When using the `mode` and `chmod` commands, it will only work on paths created
  by the web-server-user in the underlying operating system. If you don't work
  on this file-system via any other user account, then don't worry.
  If no path is given then these operate on the current folder you're in.
  If no mode is given, it will return the current mode of the given path.

To change the folder you're in, use the `cd` or `goto` commands.

The following commands operate recursively:
  make mode copy move void touch mkdir chmod cp mv rm
This means that it will run on the path given and all of its contents.
When making new paths, the entire path will be created if not exist.
