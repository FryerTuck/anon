<?
namespace Anon;


$logs = knob
([
   'cols' =>
   [
      'yearNumr' => 'INT NOT NULL',
      'mnthName' => 'TEXT NOT NULL',
      'mnthNumr' => 'INT NOT NULL',
      'wdayName' => 'TEXT NOT NULL',
      'mdayNumr' => 'INT NOT NULL',
      'hourNumr' => 'INT NOT NULL',
      'epochSec' => 'INT NOT NULL',
      'sesnBsec' => 'INT NOT NULL',
      'firmName' => 'TEXT NOT NULL',
      'taskDref' => 'TEXT NOT NULL',
      'userName' => 'TEXT NOT NULL',
      'clanList' => 'TEXT NOT NULL',
      'naviPath' => 'TEXT NOT NULL',
      'firstArg' => 'TEXT NOT NULL',
   ],
]);
