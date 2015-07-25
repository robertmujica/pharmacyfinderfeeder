var phantom = require('phantom');

phantom.create(function (ph) {

    ph.addCookie({
        'name': 'PHPSESSID',
        'value': 'n39s6sft5i57o26e1b7qfo2ev5',
        'domain': 'public.thepsi.ie'
    });

    ph.createPage(function (page) {

        page.open("http://public.thepsi.ie/dialog.php?target=publicpharmacies&Mode=view&PublicPharmaciesId=89", function (status) {
            page.evaluate(function () { return document; }, function (result) {
                console.log('Page title is ' + result.content);
                ph.exit();
            });

            //console.log(js);
            //ph.exit();
        });

        /*page.onLoadFinished = function() {
            console.log(page.content);
            ph.exit();
        };*/
    });
});


/*

phantomjsWrapper = require('phantomjs-wrapper');

phantomjsWrapper({timeout:60000}, function(err, phantomjs){

    phantomjs.createPage(function(err, page) {

        page.addCookie({
            'name': 'PHPSESSID',
            'value': 'n39s6sft5i57o26e1b7qfo2ev5',
            'domain': 'public.thepsi.ie'
        });

        //console.log(page);
        page.open('http://public.thepsi.ie/dialog.php?target=publicpharmacies&Mode=view&PublicPharmaciesId=89', function(err) {
            //var js = page.evaluate(function () {
            //    return document;
            //});
            console.log(page);
        });
    });
});
*/