// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

    // Create the defaults once
    var pluginName = "simpleCalendar",
        defaults = {
            months: ['Janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','octubro','novembro','dezembro'], //string of months starting from january
            days: ['dom','seg','ter','quart','quint','sext','sab'], //string of days starting from sunday
            minDate : "YYYY-MM-DD", // minimum date
            maxDate : "YYYY-MM-DD", // maximum date
            insertEvent: true, // can insert events
            displayEvent: true, // display existing event
            fixedStartDay: true, // Week begin always by monday
            event: [], //List of event
            insertCallback : function(){} // Callback when an event is added to the calendar
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {        
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.currentDate = new Date();
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            var container = $(this.element);
            var todayDate = this.currentDate;
            
            var calendar = $('<div class="calendar"></div>');
            var header = $('<header>'+
                           '<h2 class="month"></h2>'+
                           '<a class="btn btn-prev" href="#"><</a>'+
                           '<a class="btn btn-next" href="#">></a>'+
				            '</header>');
            
            this.updateHeader(todayDate,header);
            calendar.append(header);
            
            this.buildCalendar(todayDate,calendar);
            container.append(calendar);
            
            this.bindEvents();
        },
        
        //Update the current month header
        updateHeader: function (date, header) {
            header.find('.month').html(this.settings.months[date.getMonth()]);
        },
        
        //Build calendar of a month from date
        buildCalendar: function (fromDate, calendar) {
            var plugin = this;
            
            calendar.find('table').remove();
            
            var body = $('<table></table>');
            var thead = $('<thead></thead>');
            var tbody = $('<tbody></tbody>');
            
            //Header day in a week ( (1 to 8) % 7 to start the week by monday)
            for(var i=1; i<=this.settings.days.length; i++) {
                thead.append($('<td>'+this.settings.days[i%7].substring(0,3)+'</td>'));
            }
            
            //setting current year and month
            var y = fromDate.getFullYear(), m = fromDate.getMonth();
            
            //first day of the month
            var firstDay = new Date(y, m, 1);
            //If not monday set to previous monday
            while(firstDay.getDay() != 1){
                firstDay.setDate(firstDay.getDate()-1);
            }
            //last day of the month
            var lastDay = new Date(y, m + 1, 0);
            //If not sunday set to next sunday
            while(lastDay.getDay() != 0){
                lastDay.setDate(lastDay.getDate()+1);
            }
            
            //For firstDay to lastDay
            for(var day = firstDay; day <= lastDay; day.setDate(day.getDate())) {
                var tr = $('<tr></tr>');
                //For each row
                for(var i = 0; i<7; i++) {
                    var td = $('<td><a href="#" class="day">'+day.getDate()+'</a></td>');
                    //if today is this day
                    if(day.toDateString() === (new Date).toDateString()){
                        td.find(".day").addClass("today");
                    }
                    //if day is not in this month
                    if(day.getMonth() != fromDate.getMonth()){
                       td.find(".day").addClass("wrong-month"); 
                    }
                    //Binding day event
                    td.on('click', function(e) {
                        plugin.fillUp($(plugin.element),e.pageX,e.pageY);
                    });
                    
                    tr.append(td);
                    day.setDate(day.getDate() + 1);
                }
                tbody.append(tr);
            }
            
            body.append(thead);
            body.append(tbody);
            
            var eventContainer = $('<div class="event-container"></div>');
            
            calendar.append(body);
            calendar.append(eventContainer);
        },
        //Init global events listeners
        bindEvents: function () {
            var plugin = this;
            
            //Click previous month
            $('.btn-prev').click(function(){
                plugin.currentDate.setMonth(plugin.currentDate.getMonth()-1);
                plugin.buildCalendar(plugin.currentDate, $('.calendar'));
                plugin.updateHeader(plugin.currentDate, $('.calendar header'));
            });
            
            //Click next month
            $('.btn-next').click(function(){
                plugin.currentDate.setMonth(plugin.currentDate.getMonth()+1);
                plugin.buildCalendar(plugin.currentDate, $('.calendar'));
                plugin.updateHeader(plugin.currentDate, $('.calendar header'));
            });
        },
        //Small effect to fillup a container
        fillUp : function (elem,x,y){
            var plugin = this;
            var elemOffset = elem.offset();
            
            var filler = $('<div class="filler" style=""></div>');
            filler.css("left", x-elemOffset.left);
            filler.css("top", y-elemOffset.top);
            
            $('.calendar').append(filler);
            
            filler.animate({
                width: "300%",
                height: "300%"
            }, 500, function() {                
                $('.event-container').show();
                filler.hide();
            });
        },
        //Small effect to empty a container
        empty : function (elem,x,y){
            var elemOffset = elem.offset();
            
            var filler = $('.filler');
            filler.css("width", "300%");
            filler.css("height", "300%");
            
            filler.show();
            
            $('.event-container').hide();
            
            filler.animate({
                width: "0%",
                height: "0%"
            }, 500, function() {
                filler.remove();
            });
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
                if ( !$.data( this, "plugin_" + pluginName ) ) {
                        $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
                }
        });
    };

})( jQuery, window, document );
