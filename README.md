# SketchToFramer

A node based app and a Framer module to recreate Sketch artboards in code.

## Installation

* Download the the project on your computer
* Install the dependencies
```
npm install
```


## Description


SketchToFramer consists of two parts:

* **s2f.js* is a node app that will convert Sketch files into a JSON file and png files

* **SketchImporter.coffee** a Framer module that will read the generated JSON file and recreate the Sketch design in code


The objective is to be able to replicate Sketch designs in a reusable and code-base manner.



### s2f.js ###

  This node process will read the sketch file and convert it to JSON file. It will also export images as PNG when needed.

#### Usage ####
 node s2f.js
  * --input= sketchFile
  * --output= folder where to output
  * --artboards= list of *artboards* inside the sketch file to be exported (if empty, it will export all of them)

##### Example: #####
```
  node s2f.js --input=test/activityCard.sketch --output=test/s2f.framer/fromSketch/
```





### SketchImporter.coffee ###

This class will read a JSON file, look for the specified ArtBoard and recreate it.


#### Arguments: ####
* *file* = the location of the JSON file
* *page* = the page where the artboard to be recreated is
* *artboard* = the name of the artboard

I recommend creating classes for artboards so you can create shortcuts directly to layers you want to manipulate later

##### Example #####
```
{SketchImporter} = require 'SketchImporter'

class exports.ActivityCard extends Layer

  constructor : (obj = {}) ->

    super obj

    obj.file      = 'fromSketch/ActivityCard.json'
    obj.page      = 'Page 1'
    obj.artboard  = 'activityCard'

    @content = SketchImporter.import obj, @

    # this is a shortcut to change the title text
    # the original text style is applied to the new html

    @title_txt = @content.mod_info.txt_title

```




## Watch outs: ##
For Sketch:
  * layers/artboards/pages can't have '-' in their name


## To Do: ##

* fonts (no idea how to implement Bold, Thin, etc...)
* polish the gulp process
* special borders
* some other fx
