# Error Handling
Sometimes PHP spews out some unwanted warnings that could be such a chore to handle.
The ideal is to NOT suppress warnings -or errors, but handle them accordingly.


## Trapping errors and warnings
In Anon it's really easy to do this; however there are various ways of doing this; let's start with the quickest.


#### when you need silence
We can let PHP hush for a bit by using `defail()` and `enfail()`.

```php
<?
namespace Anon;

$old = defail();      // $old = handler that was active
$con = SomeFooThing;  // undefined constant throws a warning
$arr = enfail($old);  // $arr is a list of error objects

```


#### roll your own handler

```php
<?
namespace Anon;

dbug::trap('myHandler',function($err)
{
   // $err is an object with keys:
   // name, mesg, file, line, stak
});
```


#### switching handlers
You can switch to any existing error handler created; the built-in one is named **anon**

```php
<?
namespace Anon;

dbug::trap('anon');

```


#### active handler name
Maybe you just want to know which handler is active

```php
<?
namespace Anon;

dbug::trap(); // anon
dbug::trap('silence',function(){});
dbug::trap(); // silence
```
