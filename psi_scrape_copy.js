/**
 * Created by robertmujica on 23/09/2014.
 */

phantom.addCookie({
    'name': 'PHPSESSID',
    'value': 'rhpp2v2tkj3nfvmt029q0iabc7',
    'domain': 'public.thepsi.ie'
});

var page = require('webpage').create();
var fs = require('fs');

var file_h = fs.read('input_urls.txt'); // read the file into a single string
var arrayData = file_h.split(/[\r\n]/); // split the string on newline and store in array
var currentPage = 0;

next_page();

function handle_page(url){

    var qs = url.split("=");
    var fileName = "/Users/robertmujica/WebstormProjects/IPF_Feeder/output/" + qs[3] + ".htm";
    var content = "";

    page.open(url, function (status) {
        var js = page.evaluate(function () {
            return document;
        });

        content = js.all[0].outerHTML;
        fs.write(fileName, content, 'w');
        setTimeout(next_page,100);
    });
}

function next_page(){
    if(currentPage >= arrayData.length || arrayData[currentPage] === ""){
        phantom.exit(0);
    }
    handle_page(arrayData[currentPage++]);
}

/*
 page.open(url, function (status) {
 var js = page.evaluate(function () {
 return document;
 });
 console.log(js.all[0].outerHTML);
 //console.log(JSON.stringify(js));
 phantom.exit();
 });
 */