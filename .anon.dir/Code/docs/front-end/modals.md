# Coding front-end ~ modals
These are useful in many ways and the minimum code you need is quick to type (copy & paste) -and easy to remember; however, the following examples should get you started quickly.



### Wizard
Aside from the usual magic, this one is for multi-step interaction.

```javascript
popModal({theme:`dark`, size:`600x360`})
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