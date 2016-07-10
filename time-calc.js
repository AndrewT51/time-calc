function timeCalc(time){

  if(typeof time === 'string' && time.length === 8){
    var split = time.split(/[:.]/)
    var hour = Number(split[0])
    var minute = Number(split[1])
    var second = Number(split[2]) 
  }

  function normalize(returnArray){
    return returnArray.map(function(part,i){
      part = part.length < 2 ? '0' + part : part
      return part
    }).join(':')
  }

  function validation(unit, num, method){
    if(time.length < 8 || time.length > 8){
      return new Error('Time argument must be received in the format \'HH:MM:SS\' ')
    }
    if(typeof time !== 'string'){
      return new Error('Time argument must be a string')
    }
    if(isNaN(num)){
      return new Error('First argument of ' + method + ' method must be a number')
    }
    if(hour > 23 || hour < 0){
      return new Error('Hours must be between 0 and 23')
    }
    if(minute > 59 || minute < 0){
      return new Error('Minutes must be between 0 and 59')
    }
    if(second > 59 || second < 0){
      return new Error('Seconds must be between 0 and 59')
    }
    if(['h','m','s'].indexOf(unit[0]) < 0 ){
      return new Error('Second argument of '+ method + ' method must be hours, minutes or seconds')
    }
  }

  return {

    add: function addTime(num, unit){
      var err = validation(unit, num, 'add');
      if(err) return err
      switch(unit[0]){
        case 'h':
        hour = (hour + num) % 24
        break;
        case 'm':
        var hoursToAdd = Math.floor((minute + num)/60);
        minute = (minute + num) % 60;
        addTime(hoursToAdd,'hour')
        break;
        case 's':
        var minutesToAdd = Math.floor((second + num)/60);
        second = (second + num) % 60;
        addTime(minutesToAdd,'minute')
        break;
      }

      return normalize([String(hour), String(minute), String(second)])
    },

    subtract: function subtractTime(num, unit){
      var err = validation(unit, num, 'subtract');
      if(err) return err
      var count = 0;
      switch(unit[0]){
        case 'h':
        var hourAnswer = hour - num;
        while(hourAnswer < 0){
          count ++
          hourAnswer = 24 + hourAnswer
        }
        hour = hourAnswer
        break;
        case 'm':
        var minuteAnswer = minute - num;
        while(minuteAnswer < 0){
          count ++
          minuteAnswer = 60 + minuteAnswer
        }
        minute = minuteAnswer
        if(count){
          subtractTime(count,'h')
        }
        break;
        case 's':
        var secondAnswer = second - num;
        while(secondAnswer < 0){
          count ++
          secondAnswer = 60 + secondAnswer
        }
        second = secondAnswer
        if(count){
          subtractTime(count,'m')
        }
        break; 
      }
      return normalize([String(hour), String(minute), String(second)])
    } 
  }
}

module.exports = timeCalc

// console.log('a ',timeCalc('18.16:00').add(3,'mins').add(2,'hour'))
console.log('b ',timeCalc('02:35:00').add(3,'hours'))
console.log('c ',timeCalc('22:15').add(135,'minute'))
console.log('d ',timeCalc('23:30:00').subtract(135,'mins'))
console.log('e ',timeCalc('00:15:00').subtract(3,'hour'))