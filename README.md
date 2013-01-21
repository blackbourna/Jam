Jam
===
*Andrew* - 01-17 @ 11:35pm
Hey All, just a quick update-

I think we've mostly agreed on CreateJS (http://www.createjs.com/) for the engine, as everyone knows JS and we can theoretically do mobile 
with it... If there are other suggestions feel free, I was originally expecting we'd use multiple engines
but that may be too difficult over the weekend in reality...

I also know we can use Box2d physics if needed, and I'm hoping to either learn how to use the closure compiler 
JARfile, or just steal the scripts from LimeJS, it does a decent job of building Google Closure, but it's a 
particularly useful lib for OO, coordinates and couple of nice-to-have utilities that aren't built into Javascript. 

I'm hoping to get a bit of time to try and build a very generic shooter that we can skin and apply customization 
to (i.e. if we have a ship that moves and shoots, and a basic enemy, we can skin it and add new enemies and 
powerups and basically turn it into a real game without having to start with 1 line of code, was even thinking 
we could just pass it from small group to small group as we go). But I'm not sure if I'll have time to get to it 
before the jam.

Right now the jam consists of:

###Devs:
* AJ
* Andrew
* Alex
* Brian
* Geoff
* Mohamed (pending)

###UI guru:
Kevin

###Graphics/Animation:
Ken

(no last names people, this is the internet!)

##Game Programming Tutorials
Brian tweeted this and it's definitely worth posting here, a very concise rundown of how a game loop works, and 
some decent example code.
http://www.html5rocks.com/en/tutorials/canvas/notearsgame/

And here's a getting started guide for using CreateJS. There's also plenty of decent examples on the official site,
though they're mostly examples of the canvas wrapper features.
I'll try and get a working template before the jam so we have a bit of the boilerplate code out of the way.
(title screen and maybe a game loop with a sprite attached to keyboard movement)
http://active.tutsplus.com/tutorials/games/learn-createjs-by-building-an-html5-pong-game/

And an article on using Flash to generate spritesheets for CreateJS
http://www.fabiobiondi.com/blog/2012/08/createjs-zoe-create-spritesheets-in-adobe-flash-for-easeljs/
http://www.createjs.com/#!/Zoe

###Sound:
I'll bring along Fruityloops and a few other little synth programs that we can use to generate audio quickly, 
music/sound will likely be only minimally used for these games.


##Games:
As far as game ideas, right now the plan is to compile as many single-sentence ideas for minigames we can get (think 
stuff that takes anywhere from 30min to 3 hours) and we'll take the list to the jam and pump out the games by splitting
into groups of 2-3 and going at them for a few hours (3 hours?), then switching to something else, whether it's done or not. The 
idea being that we should hopefully have more rought stuff to show off rather than any one particularly polished work.

##Rough Game Ideas:
Add to this as ideas come.
* accelerometer bowling game, straight top-down, use html5 transform to fix perspective
* lunar lander ripoff
* jump on turtle?
* guess a number between 1 and 1000 using only rows of dots (high/low)
* fade to random colours, hit space when your colour shows up
* navigate an obfuscated maze
* 4 way directional shooting, used to solve... some kind of puzzle?
* rhythm based i.e. VOID/BEAT?
* atari-style shell game (find marble under clam shell)
* picture of an apple. eat the apple by typing "apple", otherwise a bad noise plays
* very obfuscated 2 player fighting game
* Addiction therapy puzzles
* Survival horror text game personalized for you
* Residene evil where instead of zombies you battle unresolved father issues
* Make rocket fly by blowing into mike
* conductor - use swipe events to play music, use public domain songs, like DDR
