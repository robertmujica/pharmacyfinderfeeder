//var phantom = require('phantom');

var file = require('read-file');
var cheerio = require('cheerio');
var geocoder = require('geocoder');
var format = require('string-format-js');

file.readFile('output.txt', callback);

function callback(status, fileContent){
    //console.log(fileContent);
    $ = cheerio.load(fileContent);
    var regNumber = $('table.content > tbody > tr > td:nth-child(1)')[0].next.children[0].data; //$('table.content > tbody > tr:nth-child(1)').cells[1];
    var pharmacyName = $('table.content > tbody > tr > td:nth-child(1)')[1].next.children[0].data;
    var address = $('table.content > tbody > tr > td:nth-child(1)')[2].next.children[0].data;
    var phone = $('table.content > tbody > tr > td:nth-child(1)')[3].next.children[0].data;

    var monday_start = $('td table.content.divbackground').children(0).children(1).children(1).text();
    var monday_end = $('td table.content.divbackground').children(0).children(1).children(2).text();

    if(monday_end === "00:00"){
        monday_end = "24:00";
    }

    var tuesday_start = $('td table.content.divbackground').children(0).children(2).children(1).text();
    var tuesday_end = $('td table.content.divbackground').children(0).children(2).children(2).text();

    if(tuesday_end === "00:00"){
        tuesday_end = "00:00";
    }

    var wednesday_start = $('td table.content.divbackground').children(0).children(3).children(1).text();
    var wednesday_end = $('td table.content.divbackground').children(0).children(3).children(2).text();

    if(wednesday_end === "00:00"){
        wednesday_end = "00:00";
    }

    var thursday_start = $('td table.content.divbackground').children(0).children(4).children(1).text();
    var thursday_end = $('td table.content.divbackground').children(0).children(4).children(2).text();

    if(thursday_end === "00:00"){
        thursday_end = "24:00";
    }

    var friday_start = $('td table.content.divbackground').children(0).children(5).children(1).text();
    var friday_end = $('td table.content.divbackground').children(0).children(5).children(2).text();

    if(friday_end === "00:00"){
        friday_end = "24:00";
    }

    var saturday_start = $('td table.content.divbackground').children(0).children(6).children(1).text();
    var saturday_end = $('td table.content.divbackground').children(0).children(6).children(2).text();

    if(saturday_end === "00:00"){
        saturday_end = "24:00";
    }

    var sunday_start = $('td table.content.divbackground').children(0).children(7).children(1).text();
    var sunday_end = $('td table.content.divbackground').children(0).children(7).children(2).text();

    if(sunday_end === "00:00"){
        sunday_end = "24:00";
    }


    console.log(address);

    // Geocoding
    geocoder.geocode(address, function ( err, data ) {
        var lat = "", lng = "";

        if(data.status === "OK"){
            console.log(data.results[0].geometry.location.lat + " " + data.results[0].geometry.location.lng);
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;
        }

        /*
         insert into pharmacylocation.pharmacy(RegistrationNumber, Name, Location, City, Address, WebURL, Email, PhoneNumber) values('5882', 'Hartstown Pharmacy',
         geography::Point(53.392763, -6.419633,4326), 'Dublin', 'Unit 2, Hartstown Shopping Centre, Clonsilla, Dublin 15', null, null, '(01) 8202860')
         */



        /*var sql = "insert into pharmacylocation.pharmacy(RegistrationNumber, Name, Location, City, Address, WebURL, " +
            "Email, PhoneNumber) values('#{regNumber}', '#{name}',geography::Point(#{lat}, #{lng},4326), null, '#{addr}', null, null, '#{phone}')"
                .format({regNumber:'1111', name: pharmacyName, lat:lat, lng:lng, addr:address, phone:phone});
        */

        var sql = "exec pharmacyLocation.create_pharmacy '#{regNumber}', '#{name}', #{lat}, #{lng}, '#{addr}', '#{phone}'"
            .format({regNumber:regNumber, name: pharmacyName, lat:lat, lng:lng, addr:address, phone:phone});


        var sql_openinigTime = "exec create_OpeningTime @regNumber, @day, startTime, endTime";
        console.log(sql);

    });
}