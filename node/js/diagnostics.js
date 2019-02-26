const Smoothie = require('./smoothie.js');

var Diagnostics = function() {
    // Create a time series
    var series1 = new Smoothie.TimeSeries();

    // Find the canvas
    var canvas1 = document.getElementById('cpu_canvas');

    // Create the chart
    var chart1 = new Smoothie.SmoothieChart();
    chart1.addTimeSeries(series1, { strokeStyle: 'rgba(243, 74, 133, 1)', fillStyle: 'rgba(243, 74, 133, 0.4)', lineWidth: 2 });
    chart1.streamTo(canvas1, 500);


    // Create a time series
    var series2 = new Smoothie.TimeSeries();

    // Find the canvas
    var canvas2 = document.getElementById('mem_canvas');

    // Create the chart
    var chart2 = new Smoothie.SmoothieChart();
    chart2.addTimeSeries(series2, {strokeStyle: 'rgba(78, 134, 203, 1)', fillStyle: 'rgba(78, 134, 203, 0.4)', lineWidth: 2 });
    chart2.streamTo(canvas2, 500);
    
    return({cpu:series1,
           mem:series2});
}

module.exports = Diagnostics;
