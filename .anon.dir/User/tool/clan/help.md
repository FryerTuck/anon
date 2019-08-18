# clan - command manual

This is used to manage clans (roles/groups) on this platform.
In Anon the word "clan" is synonymous with "role" or "group".

Here are some examples for brevity, explanation follows after:

```
   clan list
   clan make noob "follow instructions"
   clan edit noob "follow instructions and expect to be teased for a while"
   clan user noob
   clan void noob

   lsgrp
```

To show all the clans, use: `clan list` or `lsgrp`

To create a new clan, use: `clan make clanName "duty here as a sentence"`
When creating a clan, remember that it will be used dynamically in sentences.
The following is used as a guideline when creating new clans within Anon:
- before creating a new clan, make sure no existing clan already implies what you are about to create
- use a short word, preferably 4 letters
- this word must be "sanely" extensible by adding `s`, `er` and `ing` afterwards
- to validate, speak it in a sentence like: "the noob noobs as the noober is noobing all day long"

To show all users affiliated with a specific clan, use: `clan user clanName`

To delete a clan, use: `clan void clanName` .. just remember:
- a clan cannot be deleted unless all users of said clan are banished from it
- do not delete built-in clans that came with your Anon installation as this will cause major issues
