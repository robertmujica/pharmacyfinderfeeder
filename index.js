//var phantom = require('phantom');

var readFile = require('read-file');
var cheerio = require('cheerio');
var geocoder = require('geocoder');
var format = require('string-format-js');
var fs = require('fs');
var path = require("path");

var p = "/Users/robertmujica/WebstormProjects/IPF_Feeder/output/";
var stream = fs.createWriteStream("output_sql.txt", {'flags': 'a'});

fs.readdir(p, function (err, files) {
    if (err) {
        throw err;
    }

    files.map(function (file) {
        return path.join(p, file);
    }).filter(function (file) {
            return fs.statSync(file).isFile();
        }).forEach(function (file) {

            //console.log(file);

            readFile.readFile(file, callback);

            //console.log("%s (%s)", file, path.extname(file));
        });
});

//stream.end();
return;

file.readFile('output.txt', callback);

function callback(status, fileContent){
    //console.log(fileContent);
    $ = cheerio.load(fileContent);
    var regNumber = $('table.content > tbody > tr > td:nth-child(1)')[0].next.children[0].data; //$('table.content > tbody > tr:nth-child(1)').cells[1];
    var pharmacyName = $('table.content > tbody > tr > td:nth-child(1)')[1].next.children[0].data;
    pharmacyName = pharmacyName.replace("'", "''");
    var address = $('table.content > tbody > tr > td:nth-child(1)')[2].next.children[0].data;
    address = address.replace("'", "''");
    var phone = "";
    try{
        phone = $('table.content > tbody > tr > td:nth-child(1)')[3].next.children[0].data;
    }catch(ex){
        return;
    }

    var openingTime = [];

    var monday_start = $('td table.content.divbackground').children(0).children(1).children(1).text();
    var monday_end = $('td table.content.divbackground').children(0).children(1).children(2).text();

    /*if(monday_end === "00:00"){
        monday_end = "24:00";
    }*/

    openingTime.push(
        {
            startTime: monday_start,
            endTime: monday_end,
            day:1
        });

    var tuesday_start = $('td table.content.divbackground').children(0).children(2).children(1).text();
    var tuesday_end = $('td table.content.divbackground').children(0).children(2).children(2).text();

    /*if(tuesday_end === "00:00"){
        tuesday_end = "00:00";
    }*/

    openingTime.push(
        {
            startTime: tuesday_start,
            endTime: tuesday_end,
            day:2
        });

    var wednesday_start = $('td table.content.divbackground').children(0).children(3).children(1).text();
    var wednesday_end = $('td table.content.divbackground').children(0).children(3).children(2).text();

    /*if(wednesday_end === "00:00"){
        wednesday_end = "00:00";
    }*/

    openingTime.push(
        {
            startTime: wednesday_start,
            endTime: wednesday_end,
            day:3
        });

    var thursday_start = $('td table.content.divbackground').children(0).children(4).children(1).text();
    var thursday_end = $('td table.content.divbackground').children(0).children(4).children(2).text();

    /*if(thursday_end === "00:00"){
        thursday_end = "24:00";
    }*/

    openingTime.push(
        {
            startTime: thursday_start,
            endTime: thursday_end,
            day:4
        });

    var friday_start = $('td table.content.divbackground').children(0).children(5).children(1).text();
    var friday_end = $('td table.content.divbackground').children(0).children(5).children(2).text();

    /*if(friday_end === "00:00"){
        friday_end = "24:00";
    }*/

    openingTime.push(
        {
            startTime: friday_start,
            endTime: friday_end,
            day:5
        });

    var saturday_start = $('td table.content.divbackground').children(0).children(6).children(1).text();
    var saturday_end = $('td table.content.divbackground').children(0).children(6).children(2).text();

    /*if(saturday_end === "00:00"){
        saturday_end = "24:00";
    }*/

    openingTime.push(
        {
            startTime: saturday_start,
            endTime: saturday_end,
            day:6
        });

    var sunday_start = $('td table.content.divbackground').children(0).children(7).children(1).text();
    var sunday_end = $('td table.content.divbackground').children(0).children(7).children(2).text();

    /*if(sunday_end === "00:00"){
        sunday_end = "24:00";
    }*/

    openingTime.push(
        {
            startTime: sunday_start,
            endTime: sunday_end,
            day:7
        });

    //console.log(address);

    // Geocoding


    function sleep(time, callback) {
        var stop = new Date().getTime();
        while(new Date().getTime() < stop + time) {
            ;
        }
        callback();
    };

    sleep(2000, function() { geocoder.geocode(address, getGeolocationByAddress); });

    function getGeolocationByAddress(err, data ){
            var lat = "", lng = "";

            //console.log("Geo by Address: " +  address +" status => " + data.status);
            if(data.status === "OK"){
                //console.log(data.results[0].geometry.location.lat + " " + data.results[0].geometry.location.lng);
                lat = data.results[0].geometry.location.lat;
                lng = data.results[0].geometry.location.lng;

                var sql = "exec pharmacyLocation.create_pharmacy '#{regNumber}', '#{name}', #{lat}, #{lng}, '#{addr}', '#{phone}'"
                    .format({regNumber:regNumber, name: pharmacyName, lat:lat, lng:lng, addr:address, phone:phone});

                console.log(sql);
                stream.write(sql + "\n");

                for(var i = 0; i < 7; i++){
                    if(openingTime[i].startTime !== "" && openingTime[i].endTime !== ""){
                        var sql_openinigTime = "exec pharmacyLocation.create_OpeningTime '#{regNumber}', #{day}, '#{startTime}', '#{endTime}'"
                            .format({regNumber:regNumber, day:i + 1, startTime:openingTime[i].startTime, endTime:openingTime[i].endTime});
                        console.log(sql_openinigTime);
                        stream.write(sql_openinigTime + "\n");
                    }
                }

            }
            else{
                geocoder.geocode(pharmacyName, function ( err, data ) {
                    var lat = "", lng = "";

                    //console.log("geo by Name :" + pharmacyName + " satus => " + data.status);
                    if(data.status === "OK"){
                        //console.log(data.results[0].geometry.location.lat + " " + data.results[0].geometry.location.lng);
                        lat = data.results[0].geometry.location.lat;
                        lng = data.results[0].geometry.location.lng;
                    }

                    var sql = "exec pharmacyLocation.create_pharmacy '#{regNumber}', '#{name}', #{lat}, #{lng}, '#{addr}', '#{phone}'"
                        .format({regNumber:regNumber, name: pharmacyName, lat:lat, lng:lng, addr:address, phone:phone});

                    console.log(sql);
                    stream.write(sql + "\n");

                    for(var i = 0; i < 7; i++){
                        if(openingTime[i].startTime !== "" && openingTime[i].endTime !== ""){
                            var sql_openinigTime = "exec pharmacyLocation.create_OpeningTime '#{regNumber}', #{day}, '#{startTime}', '#{endTime}'"
                                .format({regNumber:regNumber, day:i + 1, startTime:openingTime[i].startTime, endTime:openingTime[i].endTime});
                            console.log(sql_openinigTime);
                            stream.write(sql_openinigTime + "\n");
                        }
                    }
                });
            }
    }
}