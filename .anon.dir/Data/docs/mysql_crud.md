
### Stored Procedure
You can interface with a *sProc* in expressive ways.

#### create
```php
<?
namespace Anon;

$purl = 'mysql://username:password@example.com/database';

crud($purl)->create
([
   basis => 'sproc',
   named => 'hello',
   param => ['OUT param1 INT'],
   write =>
   "
      BEGIN
          SELECT 'Hello World!' INTO param1;
      END
   ",
]);


# The following produces the EXACT same result .. read carefully

crud($purl)->create
([
   sproc => 'hello',
   param => ['OUT param1 INT'],
   write =>
   [
      'BEGIN',
      '    SELECT "Hello World!" INTO param1;',
      'END',
   ],
]);
```
