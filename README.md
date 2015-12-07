# Pharmacy Finder feeder

PhantonJS scripts to scrape PSI Web site to feed pharmacy database into SQL Azure database.

# Implementation Details

- Setup a valid cookie, as shown on code snippet below

`phantom.addCookie({
    'name': 'PHPSESSID',
    'value': 'vk9vfd0ea5nfohhq32fv7sq442',
    'domain': 'public.thepsi.ie'
});`


- Read Input file

Basically psi_scrape.js file read a input_file.txt which contains a list of web site urls containing Pharmacy specific details e.g. Opneinig time, Name, address, phone number, etc.

`var file_h = fs.read('input_urls.txt'); // read the file into a single string
var arrayData = file_h.split(/[\r\n]/); // split the string on newline and store in array`

- Start recursive execution

It then starts a recursive execution calling `next_page()` function, whicn in turn calls itself every 100 milliseconds.

This function open each pharmacy url asyncronously, read the full content and save the html into a predefined output folde.

``page.open(url, function (status) {
        var js = page.evaluate(function () {
            return document;
        });

        content = js.all[0].outerHTML;
        fs.write(fileName, content, 'w');
        setTimeout(next_page,100);
    });``
    
    
