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
  var hour = date.getHours();
  var min = date.getMinutes();
  var day = date.getDay();
  var dotw = date.getUTCDay();
  console.log("Hours: " + hour);

  // Check time and date
  // Stock market isn't open weekends
  // Also only open from 9:30am-4:00pm
  if (dotw == 0 || dotw == 6) {
    date.setHours(16);
    date.setMinutes(0);
    date.setDate(day - 1);
    console.log("FIX: " + data);
  } else if (hour > 16) {
    date.setHours(16);
    date.setMinutes(0);
    console.log("FIX: " + data);
  } else if (hour < 10 && min < 30) {
    date.setHours(16);
    date.setMinutes(0);
    date.setDate(day - 1);
    console.log("FIX: " + data);
  }

  date = date.toISOString();
  console.log("TEST: " + date);
  //console.log(JSON.stringify(polished));

  // Catch for when the MAN ranomly closes the stock market on unpredictable holidays
  // Why must I add all this code please open the stock market 24/7 thank u
  if (polished.data[date].open == undefined) {
    console.log("ERROR: the powers at be have decided to close the stock market. It is unclear why, in this age of electronic trading, we must still close the market, alas my peasant self has no control over this sad issue.");
  } else {
    console.log("APPLE: " + polished.data[date].open);
    var price = polished.data[date].open;
    document.getElementById("value_text").innerHTML = "$" + (Math.floor(price * 100) / 100 );
  }
});

setInterval(function() {
  alpha.data.intraday(`aapl`).then(data => {
    const polished = alpha.util.polish(data);
    var date = new Date(Date.now() - 120000);
    date.setSeconds(0,0);
    var hour = date.getHours();
    var min = date.getMinutes();
    var day = date.getDay();
    var dotw = date.getUTCDay();
    console.log("Hours: " + hour);

    // Check time and date
    // Stock market isn't open weekends
    // Also only open from 9:30am-4:00pm
    if (dotw == 0 || dotw == 6) {
      date.setHours(16);
      date.setMinutes(0);
      date.setDate(day - 1);
      console.log("FIX: " + data);
    } else if (hour > 16) {
      date.setHours(16);
      date.setMinutes(0);
      console.log("FIX: " + data);
    } else if (hour < 10 && min < 30) {
      date.setHours(16);
      date.setMinutes(0);
      date.setDate(day - 1);
      console.log("FIX: " + data);
    }

    date = date.toISOString();
    console.log("TEST: " + date);
    //console.log(JSON.stringify(polished));

    // Catch for when the MAN ranomly closes the stock market on unpredictable holidays
    // Why must I add all this code please open the stock market 24/7 thank u
    if (polished.data[date].open == undefined) {
      console.log("ERROR: the powers at be have decided to close the stock market. It is unclear why, in this age of electronic trading, we must still close the market, alas my peasant self has no control over this sad issue.");
    } else {
      console.log("APPLE: " + polished.data[date].open);
      var price = polished.data[date].open;
      document.getElementById("value_text").innerHTML = "$" + (Math.floor(price * 100) / 100 );
    }
  });
}, 240000);