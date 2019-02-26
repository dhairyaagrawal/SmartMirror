const PiStats = require('./py_stats.js');
const Clock = require('./clock.js');
const Diagnostics = require('./diagnostics.js');
const Smoothie = require('./smoothie.js');
const alpha = require('alphavantage')({ key: 'AYFF0INGRWOFNPJN' });

// -- HIDE / REVEAL ALL ELEMENTS -- //
document.getElementById("clock_window").onclick = function() {
  console.log("CLICKED");
  var main_border = document.getElementById("window_border");
  var flicker_count = 0;
  var interval_control = setInterval(function() {
    main_border.classList.toggle('fade');
    flicker_count++;
    if(flicker_count === 5) {
        console.log("TOGGLE");
        clearInterval(interval_control);
    }
  }, 50);
}

// -- Start the clock module -- //
var i=0,clocks = document.querySelectorAll('.clock'),l=clocks.length;
for (;i<l;i++) {
    new Clock(clocks[i]);
}

// Update Diagnostic Graphs with real-time cpu and mem data

var diagnostics = Diagnostics();
setInterval(function() {
  var point = 0;
  PiStats.getCPUInfo(function(err, data){
    point = data;
    diagnostics.cpu.append(Date.now(), point);
    document.getElementById("cpu_load_text").innerHTML = "CPU: " + (Math.floor(point * 100) / 100) + "%";
    //console.log("Current CPU Usage: " + data.percentUsed + "%");
    // -- Added this to feed system data into mirror core.js -- //
  });
}, 500);


setInterval(function() {
  var point = 0;
  PiStats.getMemoryInfo(function(err, data){
    point = data;
    diagnostics.mem.append(Date.now(), point);
    document.getElementById("mem_load_text").innerHTML = "MEM: " + (Math.floor(point * 100) / 100) + "%";
    //document.getElementById("stat_window").innerHTML = test_data;
  });
}, 500);

// -- HIDE / REVEAL DIAGNOSTICS -- //
document.getElementById("stat_window").onclick = function() {
  console.log("STAT_CLICKED");
  var stat_border = document.getElementById("stat_window");
  var flicker_count = 0;
  var interval_control = setInterval(function() {
    stat_border.classList.toggle('fade');
    flicker_count++;
    if(flicker_count === 5) {
    console.log("TOGGLE");
    clearInterval(interval_control);
    }
  }, 50);
}

// #################################################################################
// Alphavantage API calls

/**
 * Init Alpha Vantage with your API key.
 *
 * @param {String} key 
 *   Your Alpha Vantage API key.
 */
alpha.data.intraday(`aapl`).then(data => {
  const polished = alpha.util.polish(data);
  var date = new Date(Date.now() - 120000);
  date.setSeconds(0,0);

  date = date.toISOString();
  console.log(date);
  console.log("APPLE: " + polished.data[date].open);
});

setInterval(function() {
  alpha.data.intraday(`aapl`).then(data => {
    const polished = alpha.util.polish(data);
    var date = new Date(Date.now() - 120000);
    date.setSeconds(0,0);

    date = date.toISOString();
    console.log(date);
    console.log("MICROSOFT: " + polished.data[date].open);
  });
}, 240000);