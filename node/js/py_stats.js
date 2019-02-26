'use strict'
const request = require('request');

// A very simple nodeJS script that demonstrates how you can access
// memory usage information similar to how free -m works on the
// Raspberry Pi. Goes with µCast #14. http://youtu.be/EqyVlTP4R5M


// Usage: node pi_mem.js
// Example Output
//
// total    used    free    cached
// 469      65      404     31
// Memory Usage:    7%

/*var fs = require('fs');
console.log("-- THIS IS FS --");
console.log(fs);
console.log("-- END FS --");*/
var fs = require('browserify-fs');

var PiStats = function(){
    
    var memInfo = {};
    var currentCPUInfo = {total:0, active:0};
    var lastCPUInfo = {total:0, active:0};
    
    function getValFromLine(line){
        var match = line.match(/[0-9]+/gi);
        if(match !== null)
            return parseInt(match[0]);
        else
            return null;
    }
    
    var getMemoryInfo = function(cb){
        request('http://127.0.0.1:3000/system.json', { json: true }, (err, res, body) => {
          if (err) { return console.log("ERROR: " + err); }
          //console.log("Memuse: " + body.memuse);
          if (body !== undefined) {
            cb(null, body.memuse);
          }
        }); 

    };
    
    var calculateCPUPercentage = function(oldVals, newVals){
        var totalDiff = newVals.total - oldVals.total;
        var activeDiff = newVals.active - oldVals.active;
        return Math.ceil((activeDiff / totalDiff) * 100);
    };
    
    var getCPUInfo = function(cb){
        request('http://127.0.0.1:3000/system.json', { json: true }, (err, res, body) => {
          if (err) { return console.log("ERROR: " + err); }
          //console.log("RESULT: " + body.cpuload);
          if (body !== undefined) {
            cb(null, body.cpuload);
          }
        });
        
    };
    
    return{
    getMemoryInfo: getMemoryInfo,
    getCPUInfo: getCPUInfo,
    printMemoryInfo: function(){
        getMemoryInfo(function(err, data){
                      console.log("total\tused\tfree\tcached");
                      //console.log( data.total + "\t" + data.used + "\t" + data.free + "\t" + data.cached );
                      //console.log("Memory Usage:\t" + data.percentUsed + "%");
                      // -- Added this to feed system data into mirror core.js -- //
                      //return("TEST");
                      });
    },
    printCPUInfo: function(){
        getCPUInfo(function(err, data){
                   console.log("Current CPU Usage: " + data.percentUsed + "%");
                   // -- Added this to feed system data into mirror core.js -- //
                   //return("TEST2");
                   });
    }
    };
}();
module.exports = PiStats;
//PiStats.printMemoryInfo();
//console.log("")
//setInterval(PiStats.printCPUInfo, 1000);


