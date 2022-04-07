
        var initArray = [
            {period: "Warning Siren", fromHour: 8, fromMin: 10, toHour: 8, toMin: 15},
            {period: "Form", fromHour: 8, fromMin: 16, toHour: 8, toMin: 30},
            {period: "Period 1", fromHour: 8, fromMin: 31, toHour: 9, toMin: 20},
            {period: "Period 2", fromHour: 9, fromMin: 21, toHour: 10, toMin: 10},
            {period: "Period 3", fromHour: 10, fromMin: 11, toHour: 11, toMin: 0},
            {period: "Recess", fromHour: 11, fromMin: 1, toHour: 11, toMin: 30},
            {period: "Period 4", fromHour: 11, fromMin: 31, toHour: 12, toMin: 15},
            {period: "Period 5", fromHour: 12, fromMin: 21, toHour: 13, toMin: 5},
            {period: "Lunch", fromHour: 13, fromMin: 6, toHour: 13, toMin: 35},
            {period: "Warning Siren", fromHour: 13, fromMin: 35, toHour: 13, toMin: 40},
            {period: "Period 6", fromHour: 13, fromMin: 41, toHour: 14, toMin: 25},
            {period: "Period 7", fromHour: 14, fromMin: 26, toHour: 15, toMin: 15},
            {period: "End of Day", fromHour: 15, fromMin: 16, toHour: 16, toMin: 30}
        ];
        /************** end of init  *************/

        /***************************
         * !!! Change any of the script below only when you know what you are doing!!! 
         ****************************/
        var fromH, fromM, toH, toM;

        function getTime(element, index, array) {
            var fromTime = element.fromHour * 3600 + element.fromMin * 60,
                toTime = element.toHour * 3600 + element.toMin * 60,
                duration = toTime - fromTime;
            return { 
                fromTime: fromTime,
                toTime:   toTime,
                duration: duration
            }
        }

        function getText(num) {
            var text = ((num < 10 ) ? "0" : "") + num;
            return text;
        }

        function setText(id, text){
            document.getElementById(id).innerHTML = text;
        }

        function show(id) {
            document.getElementById(id).style.display = "block";
        }

        function hide(id) {
            document.getElementById(id).style.display = "none";
        }

        function setHeader(current, next) {
            var start, end, index, nextStart, nextEnd;

            if (current) {
                start = getText(current.fromHour) + ":" + getText(current.fromMin - 1);
                end = getText(current.toHour) + ":" + getText(current.toMin);
            } else {
                start = "00:00";
                end = "00:00";
            }
            
            setText("period", current.period);
            setText("start", start);
            setText("end", end);

            if (next) {
                var nextStart = getText(next.fromHour) + ":" + getText(next.fromMin - 1),
                    nextEnd = getText(next.toHour) + ":" + getText(next.toMin);

                show("next");
                setText("nextStart", nextStart);
                setText("nextEnd", nextEnd);
            } else {
                hide("next");
            }
            
        }

        var timeArray = initArray.map(getTime),
            length = initArray.length,
            last = length - 1;           
       
        function getSeconds() {
            var now = new Date(),
                time = now.getTime(),  // time now in milliseconds
                period = {}; // current period

            var midnight = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0), // midnight 0000 hrs
                ft = midnight.getTime();

            function realTime(element, index, array) {
                return {
                    fr: ft + element.fromTime * 1000,
                    to: ft + element.toTime * 1000,
                    d: element.duration,
                    index: index
                }
            }
            
            var realTimeArray = timeArray.map(realTime),
                earlestFrom = realTimeArray[0].fr,
                latestTo = realTimeArray[last].to;              

            function find(element, index, array) {
              if (element.fr <= time && time <= element.to) {
                period = element;
              }
            }
                       
            if (time >= earlestFrom && time < latestTo) { // if current time between earlest and latest time, start countdown
                show("current");
                hide("finish");// today not finished yet

                realTimeArray.map(find); // get current period                

                if (period.index != undefined) {
                    var duration = parseInt((period.to - time)/1000);

                    if (period.index != last) { 
                        setHeader(initArray[period.index], initArray[period.index + 1]); // set current and next time period on page
                    } else {
                        setHeader(initArray[period.index], null);
                    }

                    if ( time >= period.fr) { // if time falls in the period
                        startTimer(duration); 
                    } else {
                        setTimeout("getSeconds()", 1000); // check current time every second
                    } 
                    
                } else {
                    setTimeout("getSeconds()", 1000); // check current time every second
                }
                
                                                                                 
            } else if (time < earlestFrom ) {
                hide("finish");// today not finished yet

                setHeader(initArray[0], initArray[1]); // the first cycle not start yet
                setTimeout("getSeconds()", 1000); // check current time every second
            } else {
                setHeader(null, null); // cycles all finished
                hide("current");
                show("finish");
                setTimeout("getSeconds()", 1000); // check current time every second
            }           
        }

        var timeInSecs;
        var ticker;

        function startTimer(secs){
            timeInSecs = parseInt(secs);
            ticker = setInterval("tick()",1000); 
            tick(); // to start counter display right away
        }

        function tick() {
            var secs = timeInSecs;

            var hours= Math.floor(secs/3600);
            secs %= 3600;
            var mins = Math.floor(secs/60);
            secs %= 60;

            var hourText = getText(hours),
                minText = getText(mins),
                secText = getText(secs);

            setText("hours", hourText);
            setText("mins", minText);
            setText("secs", secText);

            timeInSecs--;
            if (timeInSecs < 0) {
                clearInterval(ticker); // stop counting at zero
                getSeconds(); //restart countdown
            }
        }

        
function darkToggle() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}

const btn = document.getElementById('btn');

btn.addEventListener('click', function handleClick() {
  const initialText = 'Toggle Dark mode';

  if (btn.textContent.toLowerCase().includes(initialText.toLowerCase())) {
    btn.innerHTML =
      '<span>Toggle Light mode</span>';
  } else {
    btn.textContent = initialText;
  }
});
        