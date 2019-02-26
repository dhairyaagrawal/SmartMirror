// -- CLOCK LOGIC -- //
// -- THE FOLLOWING CLOCK CODE IS NOT MINE AND WAS WRITTEN BY Rik Schennink -- //
// -- VIEW THE CODE HERE: https://codepen.io/rikschennink/pen/lyuaf -- //
var Clock = (function(){
             
             var exports = function(element) {
             this._element = element;
             var html = '';
             for (var i=0;i<6;i++) {
             html += '<span>&nbsp;</span>';
             }
             this._element.innerHTML = html;
             this._slots = this._element.getElementsByTagName('span');
             this._tick();
             };
             
             exports.prototype = {
             
             _tick:function() {
             var time = new Date();
             
             // -- Added code to convert to 12 hour format and add ampm/day -- //
             var hours = time.getHours();
             var day = time.getDay();
             var ampm = hours >= 12 ? 'pm' : 'am';
             hours = hours % 12;
             hours = hours ? hours : 12; // the hour '0' should be '12'
             // -- End added code -- //
             
             this._update(this._pad(hours) + this._pad(time.getMinutes()) + this._pad(time.getSeconds()), ampm, day);
             var self = this;
             setTimeout(function(){
                        self._tick();
                        },1000);
             },
             
             _pad:function(value) {
             return ('0' + value).slice(-2);
             },
             
             _update:function(timeString, ampm, day) {
             // -- Added code to update day and ampm next to the clock -- //
             document.getElementById("curr_ampm").innerHTML = ampm.toUpperCase();
             
             
             switch(day) {
             case 0:
             document.getElementById("curr_day").innerHTML = "SUN";
             break;
             case 1:
             document.getElementById("curr_day").innerHTML = "MON";
             break;
             case 2:
             document.getElementById("curr_day").innerHTML = "TUE";
             break;
             case 3:
             document.getElementById("curr_day").innerHTML = "WED";
             break;
             case 4:
             document.getElementById("curr_day").innerHTML = "THU";
             break;
             case 5:
             document.getElementById("curr_day").innerHTML = "FRI";
             break;
             case 6:
             document.getElementById("curr_day").innerHTML = "SAT";
             break;
             default:
             document.getElementById("curr_day").innerHTML = "NULL :(";
             }
             
             
             var i=0,l=this._slots.length,value,slot,now;
             for (;i<l;i++) {
             
             value = timeString.charAt(i);
             slot = this._slots[i];
             now = slot.dataset.now;
             
             if (!now) {
             slot.dataset.now = value;
             slot.dataset.old = value;
             continue;
             }
             
             if (now !== value) {
             this._flip(slot,value);
             }
             }
             },
             
             _flip:function(slot,value) {
             
             // setup new state
             slot.classList.remove('flip');
             slot.dataset.old = slot.dataset.now;
             slot.dataset.now = value;
             
             // force dom reflow
             slot.offsetLeft;
             
             // start flippin
             slot.classList.add('flip');
             
             }
             
             };
             
             return exports;
             }());

module.exports = Clock;
// -- END CLOCK LOGIC -- //
