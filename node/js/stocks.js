// #################################################################################
// Alphavantage API calls

/**
 * Init Alpha Vantage with your API key.
 *
 * @param {String} key 
 *   Your Alpha Vantage API key.
 */
const alpha = require('alphavantage')({ key: 'AYFF0INGRWOFNPJN' });

// Inject HTML to style the page
document.getElementsByClassName("one")[0].innerHTML = '<div class="container"><div class="stock" id="stock_1"><span class="symbol">unknown</span><span class="price">$00.00</span></div><div class="stock" id="stock_2"><span class="symbol">unknown</span><span class="price">$00.00</span></div><div class="stock" id="stock_3"><span class="symbol">unknown</span><span class="price">$00.00</span></div><div class="stock" id="stock_4"><span class="symbol">unknown</span><span class="price">$00.00</span></div></div>';
function addCss(fileName) {

  var head = document.head;
  var link = document.createElement("link");

  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = fileName;

  head.appendChild(link);
}

// Add a reference to your custom stylesheet
addCss('./css/stocks.css');


module.exports = {
  getStocks: function(){
    var stocks = ['aapl', 'spy', 'tsla', 'amd'];
    alpha.data.batch(stocks).then(data => {
      const polished = alpha.util.polish(data);
      
      var prices = [polished.data[0].price, polished.data[1].price, polished.data[2].price, polished.data[3].price];

      // Set stock names
      document.getElementById('stock_1').getElementsByClassName('symbol')[0].innerHTML = stocks[0];
      document.getElementById('stock_2').getElementsByClassName('symbol')[0].innerHTML = stocks[1];
      document.getElementById('stock_3').getElementsByClassName('symbol')[0].innerHTML = stocks[2];
      document.getElementById('stock_4').getElementsByClassName('symbol')[0].innerHTML = stocks[3];

      // Set stock prices
      document.getElementById('stock_1').getElementsByClassName('price')[0].innerHTML = "$" + (Math.floor(prices[0] * 100) / 100 );
      document.getElementById('stock_2').getElementsByClassName('price')[0].innerHTML = "$" + (Math.floor(prices[1] * 100) / 100 );
      document.getElementById('stock_3').getElementsByClassName('price')[0].innerHTML = "$" + (Math.floor(prices[2] * 100) / 100 );
      document.getElementById('stock_4').getElementsByClassName('price')[0].innerHTML = "$" + (Math.floor(prices[3] * 100) / 100 );

      var ids = ['stock_1', 'stock_2', 'stock_3', 'stock_4'];

      (function() {
        var i = 0;
        function loadFruit() {
          if (i < 4) {
            var id = ids[i];
            var stock = stocks[i];
            curr_price = prices[i];
            alpha.data.daily(stock).then(data => {
              console.log("id: " + id);
              const clean = alpha.util.polish(data);
              //console.log("CLEAN: " + JSON.stringify(clean));
              var date = new Date();
              date.setDate(date.getDate() - 1);
              date.setSeconds(0);
              date.setHours(19);
              date.setMinutes(0);
              date.setMilliseconds(0);

              date = date.toISOString();
              open_price = clean.data[date].open;
              console.log("PRICE: " + curr_price);
              console.log("OPEN: " + open_price);

              
              if(open_price <= curr_price) {
                document.getElementById(id).getElementsByClassName('symbol')[0].style.color = "#44d668";
                document.getElementById(id).getElementsByClassName('price')[0].style.color = "#44d668";
                document.getElementById(id).style.border = "2px solid #44d668";
              } else {
                document.getElementById(id).getElementsByClassName('symbol')[0].style.color = "#e04c4c";
                document.getElementById(id).getElementsByClassName('price')[0].style.color = "#e04c4c";
                document.getElementById(id).style.border = "2px solid #e04c4c";
              }
              ++i;
              loadFruit();
            });
          }
        }
        loadFruit();
      })();
    });
  },

  loopStocks: function() {
    module.exports.getStocks();
    setInterval(function() {
      module.exports.getStocks();
    }, 60000); //////////////////////////////////////////// Notice the stock miner is set at 30s, alphavantage only allows 500 calls per day, might want to change this
  }
};







    /*
              if (date.getMonth() < 10 && date.getDate() < 10) {
                date = date.getFullYear() + "-0" + (date.getMonth() + 1) + "-0" + date.getDate();
              } else if (date.getMonth() < 10) {
                date = date.getFullYear() + "-0" + (date.getMonth() + 1) + "-" + date.getDate();
              } else if (date.getDate() < 10) {
                date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-0" + date.getDate();
              } else {
                date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
              }*/
    /*
    alpha.data.intraday('aapl').then(data => {
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
        document.getElementById("ticker_text").innerHTML = ticker.toUpperCase();
        document.getElementById("value_text").innerHTML = "$" + (Math.floor(price * 100) / 100 );
      }
    });*/


