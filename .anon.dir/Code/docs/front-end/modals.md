# Coding front-end ~ modals
>A "modal" is simply a dialogue box that overlays everything in the current browser window.
These are useful in many ways and the minimum code you need is quick to type (copy & paste) -and easy to remember.



### Introduction
All "modals" in Anon use the `popModal` function and has a really flexible way on how to use it. The reason why it's named `popModal` and not not just `modal` is because *popModal* is implied as a verb, same as `alert()` and `confirm()` in plain (vanilla) JavaScript.

The `popModal()` function has 2 ways of calling it: *single* and *double*
- **single-call** `popModal(definition)` can be a `string` with ` : ` (space colon space) OR `object` with both ***head*** AND ***body*** properties defined.
- **double-call** `popModal(title/attributes)(definition)` is more verbose, but also gives you some syntactical freedom as in the examples below.


Both *single-call* and *double-call* can take any: `string`, `object`, or `array`; however, it is important to remember that `popModal` requies only a ***head*** AND ***body*** in order to work. The following rules specify how calling works:
- calling with `string` -which contain ` : ` (space colon space) assumes that ***head*** and ***body*** is present in a 1-liner string, so only a single call is required.
- calling with `string` -which contain NO ` : ` (space colon space) implies ***head*** only and returns a function -to call for defining the ***body***
- calling with `string` -which contain ONLY ` :: ` (space double-colon space) implies you only want an icon with a plain text ***head***, so a 2nd call is expected
- calling with `string` -which contain BOTH ` :: ` AND ` : ` only requires 1 call
- calling with `array` assumes you want to define some fancy title, but no attributes, so a second call is expected
- calling with `object` which does NOT contain BOTH ***head*** and ***body*** implies only attributes where given and a function is returned to define ***head*** and ***body*** explicitly, so a 2nd call is required
- calling with `object` with ONLY both ***head*** and ***body*** properties only requires a single call; default attributes and buttons will be applied automatically

The "info" icon will automatically be assumed if an icon is omitted from the "head".
If you use text as the body, then it is assumed as **markdown** and automatically parsed accordingly. You can also use multi-line-string definition and it will automatically fix any spacing issues before parsing as markdown; however, this applies to all variants.

If you define the ***body*** part as an array of objects -all of which are the same `nodeName` -and all of which are either `page` or `panl`, then this implies you want some kind of "multi-step wizard"; in such case you will automatically get "back", "next" and "done" buttons in the ***foot*** section, but also a menu-section on the left which corresponds to the *back* and *next* buttons.

The ***foot*** part is used for buttons; however, in text-based modals the foot part is implicit - as with object-based when it has been omitted.
All buttons in the modal will have the `root` and `dbox` properties assigned to them.
- the `popModal()` returns an element (modal) -which is the `root` as the "layer" that covers the screen
- the `dbox` is the actual "dialogue-box" -at which the attributes are directed when calling *popModal* with an object

Buttons in the ***foot*** section can either be an `array`, or an `object`. If `object` is used, then the property-keys can be written in a way to quickly assign a "tone" to them, like `cool :: Click Me` (blue button) .. see the examples below for more info on this.
If you have buttons with text as "Okay" or "Cancel" AND these have NO `onclick` event handler and NO `listen` property -then a "modal-exit" function will be assigned to them automatically.

Some attributes are "special":
- ***size*** (string) specifies width and height in pixels, used like this: `400x200` .. the first (left of `x`) is width .. the other is height .. yawn
- ***time*** (number) this shows a countdown-bar to the right and closes the modal after that number of seconds
- ***skin*** (string) specifies a modal-theme defined in some (loaded) CSS, this will become part of the classes if any defined; if none is given -then `dark` is assumed.

Lastly, The modal (root) object has 3 methods that it listens on and fires when applicable:
- The ***exit*** method emits the `exit` event and closes the modal after 60 milliseconds, allowing some grace for your listeners that refer to the modal contents before it's gone
- The ***gone*** method starts the expiration timer and shows/updates the expiration bar accordingly, then calls `exit` on expiry
- The ***done*** method refers to the "pager" and validates any input elements, then fires the `done` signal when all is well, then calls `exit`



### Examples
Refer to these examples for different ways of calling `popModal()`

#### single-call ~ string
This variant is used for quick "1-liner" messages.

```javascript
// without icon
   popModal(`Attention! : The roof is on fire!`);

// with icon
   popModal(`info :: Never mind : It was just my imagination`);
```


#### double-call ~ both calls as string
In this variant the *head* and *body* are separated by "call".
- if the 1st call specifies an icon (same way as above ` :: `) -then it is used accordingly
- if the 2nd call is string, then this variant is convenient for multi-line messages and looks better in code.

```javascript
   popModal(`smile :: Being seriaaas`)
   (`
      # Yo mama
      - Yo momma is so fat, I took a picture of her last Christmas and it’s still printing.
      - Yo momma is so stupid she brought a spoon to the super bowl.
   `);
```


#### single-call ~ object
This variant is used for being more verbose in a uniform way.

```javascript
// simple
   popModal
   ({
      head: `warning :: Not Funny`,
      body: `My cat just farted`,
   });

// verbose
   popModal
   ({
      attr: {id:`boomer`,class:`funky-jam`},
      head: [{icon:`smile-wink`}, {span:`An awesome totle`}],
      body:
      [
         {h1:`Not a typo`},
         {p:`Imagine totles where real, will they be friendly, or scary?`}
      ],
      foot:
      {
         `auto :: Blah`:function(){},
         `good :: Save`:function(){},
         `cool :: Continue`:function(){},
         `need :: Query`:function(){},
         `warn :: Ignore`:function(){},
         `harm :: Delete`:function(){},
      }
   });
```


#### double-call ~ object
```javascript
   popModal({class:`nice`, skin:`lite`, time:6})
   ({
      head: [{span:`For if defaults are not eenahf`}],
      body:
      [
         {some:`object`},
      ],
      foot:
      [
         {butn:`Cancel`}, // closes the modal
         {butn:`ShaZam!`, onclick:function()
         {
            dump(this.dbox.style.width);
            this.root.exit(); // also closes the modal
         }},
      ],
   });
```


#### double-call ~ array
```javascript
   popModal([{b:`something for the bold`}])
   ([
      {h1:`beeeg heading inside this box`},
      {textarea:`#iAmImportant`, placeholder:`blah blah`},
   ]);
```


#### double-call ~ hybrid
```javascript
// string + array + event
   popModal(`leaf :: sunshine all day long`)
   ([
      {some:`thing`},
   ])
   .listen(`exit`,function()
   {
      dump(`sunshine gone :(`);
   });
```



### Wizard
Aside from the usual magic, this one is for multi-step interaction.

```javascript
popModal({skin:`dark`, size:`600x360`})
({
    head:`Add New Product`,
    body:
    [
        {page:`screen 1`, contents:`screen 1 blah`},
        {page:`screen 2`, contents:`screen 2 blah dee`},
        {page:`screen 3`, contents:`screen 3 blah dee bleem`},
    ],
});
```

The result of the code above looks like this:
![Imgur](https://i.imgur.com/lefry8H.png)
