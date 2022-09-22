<?
namespace Anon;


$quoteDoc = knob
([
    'cols' =>
    [
        'adminRef' => 'TEXT NOT NULL',
        'doketRef' => 'TEXT NOT NULL',
        'timeMade' => 'INT NOT NULL',
        'firmName' => 'TEXT NOT NULL',
        'itemList' => 'TEXT NOT NULL',
        'totalAmt' => 'INT NOT NULL',
        'docuHash' => 'TEXT NOT NULL',
    ],
]);


$invoiDoc = knob
([
    'cols' =>
    [
        'adminRef' => 'TEXT NOT NULL',
        'doketRef' => 'TEXT NOT NULL',
        'timeMade' => 'INT NOT NULL',
        'firmName' => 'TEXT NOT NULL',
        'itemList' => 'TEXT NOT NULL',
        'totalAmt' => 'INT NOT NULL',
        'docuHash' => 'TEXT NOT NULL',
    ],
]);
