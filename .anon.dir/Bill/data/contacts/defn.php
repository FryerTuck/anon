<?
namespace Anon;


$mailFirm = knob
([
    'cols' =>
    [
        'mail' => 'TEXT NOT NULL',
        'firm' => 'TEXT NOT NULL',
    ],
]);


$firmInfo = knob
([
    'cols' =>
    [
        'firmName' => 'TEXT NOT NULL',
        'addrStrt' => 'TEXT NOT NULL',
        'addrTown' => 'TEXT NOT NULL',
        'adrCntry' => 'TEXT NOT NULL',
        'adrPersn' => 'TEXT NOT NULL',
        'phoneNmr' => 'TEXT NOT NULL',
    ],
]);
