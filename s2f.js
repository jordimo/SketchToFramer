//
// Mark Artboards you want to Automatically Export
//
//

var sketch = require('sketchjs_with_sketchtool3.4');
var child_process = require('child_process');
var fs = require('fs');
var xml2js = require('xml2js');
var util = require("util");
var argv = require("yargs").argv;
var JSONPath = require('jsonpath')



// VARIABLES

var ORIGINAL_JSON = ORIGINAL_SVG = {};
var FILES_EXPORTED = IMAGES_TO_EXPORT = [];
var EXPORT_FOLDER = CURRENT_ARTBOARD = '';
var ARTBOARDS_TO_EXPORT = []
var SVG_DEFS = {}

var inputFile, workingFolder, outputFile;

function start()
{
  inputFile = argv.input
  outFile = argv.output


  if (!outFile)
  {
      EXPORT_FOLDER = inputFile.substring(0, inputFile.lastIndexOf('/')+1)
      outputFile = inputFile.substring(inputFile.lastIndexOf('/')+1, inputFile.lastIndexOf('.sketch'))+".json";

  } else if (outFile.indexOf(".json")<0) {

    EXPORT_FOLDER = outFile
    if (EXPORT_FOLDER[EXPORT_FOLDER.length-1] != '/') EXPORT_FOLDER += "/";
    outputFile = inputFile.substring(inputFile.lastIndexOf('/')+1, inputFile.lastIndexOf('.sketch'))+".json";


  } else {

      EXPORT_FOLDER = outFile.substring(0, outFile.lastIndexOf('/')+1)
      outputFile = outFile.substring(outFile.lastIndexOf('/')+1, outFile.length)
  }




  if (argv.artboards)
  {
    ARTBOARDS_TO_EXPORT = argv.artboards.trim().split(',');
  }

  getJSON()
}


function getJSON()
{
  run_cmd(
    "sketchtool",
    ['dump', inputFile],
    function(text) {
      ORIGINAL_JSON = JSON.parse(text);
      getSVG(argv.skipSvgExport);
    });
}

start();


function getSVG(skipSvgExport)
{
  if (!Number(skipSvgExport)) exportSVG()
  else{

    var f = []
    for (var ab in ARTBOARDS_TO_EXPORT)
    {
      f.push(ARTBOARDS_TO_EXPORT[ab]+".svg");
    }
    readSVGFiles(f)
  }
}

function exportSVG()
{
  var opt = {
    type : 'artboards',
    formats : 'svg',
    output : EXPORT_FOLDER,
    scale : '1',
  }

  if (ARTBOARDS_TO_EXPORT.length) {
    opt.items = ARTBOARDS_TO_EXPORT
  }

  sketch.export(
    inputFile,
    opt,
    function (err, stdout, stderr)
    {
      if (err) {

        throw new Error('something bad happened SKETCH.Export ' + err);
      }

      var files = stdout.split("\n");
      readSVGFiles(files)
    }
  )
}



function readSVGFiles(files)
{
  for (var f of files)
  {
    if (f=='') continue;

    if (f.indexOf('d ')>-1)
    {
      f = f.substring(f.indexOf('d ')+2, f.length);
    }
    var file = EXPORT_FOLDER+f
    var artboardName = file.substring(EXPORT_FOLDER.length, file.indexOf('.svg'));

    FILES_EXPORTED[artboardName] = file;

    var parser = new xml2js.Parser({explicitChildren:true, childkey:'children', attrkey:'attr', preserveChildrenOrder:true});

    var data = fs.readFileSync(file, 'utf8');


    parser.parseString(data, function(err, results){
      if (err) {
        throw new Error ("PROBLEM SVG TO JSON!")
      }

      ORIGINAL_SVG[artboardName] = results;
    });
  }
  startParse();
}




function saveAndCleanFiles(outJSON)
{
  // CLEAN TEMP SVG
  for (var f in ORIGINAL_SVG)
  {
    var fpath = EXPORT_FOLDER+f+'.svg';
    fs.unlinkSync(fpath);
  }

  var qout = JSON.stringify(outJSON, null, '\t');

  fs.writeFile(EXPORT_FOLDER+outputFile, qout, function(err){
    if (err) {
      console.log(err);
      throw new Error ("ERROR SAVING JSON FILE");
    } else {
      console.log(EXPORT_FOLDER+outputFile)
    }

  })
}

function startParse()
{

  var data = ORIGINAL_JSON;

  var pages = data.pages['<items>'];

  var outJSON = {}

  outJSON.pages = {};


  for (var p in pages)
  {
    var page = parsePage(pages[p])
    var pageName = pages[p].name.split(" ").join("-");
    outJSON.pages[pageName] = page;
  }

  saveAndCleanFiles(outJSON);

}


function parsePage(pageData)
{
  // we need to get ArtBoards from Layers

  var artboards_arr = [];

  var layers = getChildrenLayers(pageData);

  var artboards_arr = {};

  for (var l in layers)
  {
      // ONLY PARSE MSArtboardGroup
     if (layers[l]['<class>']!='MSArtboardGroup') continue

     CURRENT_ARTBOARD = layers[l].name;
     if (ARTBOARDS_TO_EXPORT.length == 0 || ARTBOARDS_TO_EXPORT.indexOf(CURRENT_ARTBOARD) > -1)
     {
        artBoardData = parseArtBoard(layers[l]);
        artboards_arr[CURRENT_ARTBOARD] = artBoardData;
    }
  }

  return artboards_arr;
}




function parseArtBoard(data) {

  var artBoardData = {}

  artBoardData.id = data.name;
  artBoardData.frame = parseFrame(data.frame)
  // force artboards to have origin 0, 0
  artBoardData.frame.x = artBoardData.frame.y = 0

  if (data.hasBackgroundColor) {
    artBoardData.backgroundColor = data.backgroundColor.value
  } else {
    artBoardData.backgroundColor = 'transparent';
  }


  var node = ORIGINAL_SVG[data.name]['svg'];

  if (node.defs)
  {
     artBoardData.defs = parseDefs(node.defs);
  }

  var doSVG = true;


  if (doSVG)
  {
      var query = "$..*[?(@.id=='"+artBoardData.id+"')]"
      var res = JSONPath.parent(ORIGINAL_SVG[artBoardData.id], query);

      artBoardData.children = parseChildrenNodes(res.children, artBoardData);
  }

  return artBoardData;
}


function parseChildrenNodes(arrObj, pater)
{

  var children = [];

  for (var i in arrObj)
  {
    var obj = {}
    var type = arrObj[i]['#name']
    var data = arrObj[i]


    switch (type) {
      case 'g':
        obj = parseGroupNodeInfo(data)

        break;

      case 'rect' :

        obj.type = 'layer'
        obj.id = data.attr.id;
        obj.frame = getNodeFrameFromAttr(data.attr)

        obj.backgroundColor = data.attr.fill || pater.attr.fill ;

        break;

      case 'path' :

        var svgContent = getSVGContent(data)

        if (!pater.svgContent) pater.svgContent = [];
        pater.svgContent.push(svgContent)
        // INSERT SVG CONTENT AS ATTR IN PARENT OBJ

        obj = null

      break;


      case 'image' :
        obj = parseImageFromSVG(data)
      break;

      case 'text' :

        obj = parseTextInfoFromJSON(data.attr.id, CURRENT_ARTBOARD)
        obj.type = 'text'
        obj.id = data.attr.id;
        data.children = null;

        break;

      default:
        obj = null;
        data.children= null;
      }

    if (data.attr.mask)
    {
      obj.mask = parseMaskForElement(data)
    }

    if (data.children) {
      obj.children = parseChildrenNodes(data.children, obj);
    }

    if (obj) children.push(obj)
  }

  return children;
}

function parseTextInfoFromJSON(nodeId, artboardId) {

  var dId = desanitize(nodeId)

  var jsonContentRoot = ORIGINAL_JSON.pages['<items>'][0].layers['<items>'][0];
  var query = "$..*[?(@.name=='"+dId+"')]"
  var res = JSONPath.query(ORIGINAL_JSON, query)[0];

  paterObj = {}

  paterObj.frame = getNodeFrameFromAttr(res.frame)

  paterObj.allText = res.storage.text.split(" ").join("&nbsp;");
  paterObj.parts = [];


  for (var p in res.storage.attributes)
  {
    var part = res.storage.attributes[p]
    var partObj = {}
    partObj.color = part.NSColor.color;
    partObj.alignment = part.NSParagraphStyle.style.alignment;
    partObj.lineSpacing = part.NSParagraphStyle.style.maximumLineHeight;
    partObj.fontFamily = part.NSFont.family;
    partObj.fontName  = part.NSFont.name;
    partObj.fontSize = part.NSFont.attributes.NSFontSizeAttribute;
    partObj.startIndex = part.location
    partObj.text = part.text.split(' ').join("&nbsp;");

    paterObj.parts.push(partObj)
  }

  return paterObj;
}

function parseMaskForElement(data)
{
  var maskId = data.attr.mask.substring(data.attr.mask.indexOf('#')+1, data.attr.mask.length-1);
  var query = "$..*[?(@.id=='"+maskId+"')]"
  var res = JSONPath.parent(ORIGINAL_SVG[CURRENT_ARTBOARD], query);

  var maskObj = {}
  maskObj.id = maskId;
  if (data.attr.fill) maskObj.fill = data.attr.fill;

  maskObj.use = res.use[0].attr['xlink:href']

  // get use Id to pull from DEFS
  maskObj.use = maskObj.use.substring(1, maskObj.use.length);

  return maskObj
}



function parseImageFromSVG(data)
{
  var obj = {}
  obj.id = data.attr.id
  obj.frame = parseFrame(data.attr)
  obj.type = 'image'
  obj.image = extractImage(data, CURRENT_ARTBOARD)

  return obj;
}





function parseGroupNodeInfo(group)
{

  var groupId = desanitize(group.attr.id);

  var obj = {};
  obj.id = groupId;
  obj.type = 'layer';

  var query = "$..*[?(@.name=='"+groupId+"')]"
  var jsonContentRoot = ORIGINAL_JSON.pages['<items>'][0].layers['<items>'][0];
  var res = JSONPath.query(ORIGINAL_JSON, query)[0];

  obj.attr = group.attr;

  if (res.frame)  obj.frame = getNodeFrameFromAttr(res.frame)

  return obj;
}



function getNodeFrameFromAttr(attr)
{
  var frame = {}
  frame.width = Number(attr.width);
  frame.height = Number(attr.height);
  frame.x     = Number(attr.x)
  frame.y     = Number(attr.y)
  return frame;
}

function getSVGContent(data)
{

  var svgobj = data.attr
  svgobj.type = data['#name']
  delete svgobj['#name']


  return svgobj;
}


function parseDefs(data, obj) {

  var defs = {};
  data = data[0]

  if (data.children) {
    for (var td in data.children) {
      var svgElement = getSVGContent(data.children[td])
      svgElement.type = data.children[td]['#name']
      defs[svgElement.id] = svgElement
    }
  } else {
    defs = null;
  }

  return defs;
}








// ------------------------------------------------------------------------------

function getChildrenLayers(node) {
  if (node.layers) return node.layers['<items>'];
  else return [];
}

function sanitizeName(name) {
  return name.split(" ").join("-");
}

function desanitize(name){
  return name.split("-").join(" ");
}

function extractImage(data, artBoardId) {

  keepURL = false


  var imgObj = {}
  imgObj.frame = getNodeFrameFromAttr(data.attr)
  imgObj.id = data.attr.id;


  var query = "$..*[?(@.id=='"+imgObj.id+"')]"
  var res = JSONPath.parent(ORIGINAL_SVG[CURRENT_ARTBOARD], query);

  var imgSrc = res.attr['xlink:href'];

  // GET IMAGE SRC OR FILE

  var src = '';

  for (i in IMAGES_TO_EXPORT)
  {
    var dataInMemory = IMAGES_TO_EXPORT[i].src
    if (dataInMemory == imgSrc)
    {
      src = IMAGES_TO_EXPORT[i].fileName;
    }
  }

  if (src == '')
  {
    src = createPNGFile(imgObj.id, imgSrc)
    IMAGES_TO_EXPORT.push ({
      src : imgSrc,
      fileName : src
    })
  }

  imgObj.src = src;

  return imgObj;
}

function parseTextStorage(storageData) {

    var txtObj = {}
    txtObj.allText = storageData.text.split(' ').join('&nbsp;');
    txtObj.strings = []

    for (a in storageData.attributes)
    {
      var atData = storageData.attributes[a];

      var component = {};
      component.color = atData.NSColor.color;
      component.text = atData.text.split(' ').join('&nbsp;');
      component.startAt = atData.location;
      component.length = atData.length;
      component.fontName = atData.NSFont.name;
      component.fontSize = atData.NSFont.attributes.NSFontSizeAttribute;
      component.fontFamily = atData.NSFont.family;
      component.textAlign = atData.NSParagraphStyle.style.alignment;

      if (atData.NSParagraphStyle.style.maximumLineHeight)
      {
        component.lineHeight = atData.NSParagraphStyle.style.maximumLineHeight
      } else {
        component.lineHeight = 'normal'
      }

      txtObj.strings.push(component)
    }
    return txtObj;
}



function parseFrame(data) {
  if (isEmpty(data)) return null;

  var _dataobj = {}

  _dataobj.width  = data.width;
  _dataobj.height = data.height;
  _dataobj.x      = data.x;
  _dataobj.y      = data.y;

  return _dataobj;
}


// ------- UTILS



function createPNGFile(fileName, rawData) {

  var imageBuffer = decodeBase64Image(rawData);

  fs.writeFile(EXPORT_FOLDER+fileName+'.png', imageBuffer.data, function(err) {
    if (err) {
      throw new Error ("ERROR CREATING PNG FILE");
    }
  });
  return EXPORT_FOLDER+fileName+".png";
}



function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

function isEmpty(obj) {

    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

function run_cmd(cmd, args, callBack ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function() { callBack (resp) });
}
