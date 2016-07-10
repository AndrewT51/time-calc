function timeCalc(time){

  if(typeof time === 'string' && time.length === 8){
    var split = time.split(/[:.]/)
    var hour = Number(split[0])
    var minute = Number(split[1])
    var second = Number(split[2]) 
  }

  function normalize(returnArray){
    return returnArray.map(function(part){
      part = part.length < 2 ? '0' + part : part
      return part
    }).join(':')
  }

  function validation(unit, num, method){
    if(time.length < 8 || time.length > 8){
      throw 'Time argument must be received in the format \'HH:MM:SS\''
    }
    if(typeof time !== 'string'){
      throw 'Time argument must be a string'
    }
    if(isNaN(num)){
      throw 'First argument of ' + method + ' method must be a number'
    }
    if(hour > 23 || hour < 0){
      throw 'Hours must be between 0 and 23'
    }
    if(minute > 59 || minute < 0){
      throw 'Minutes must be between 0 and 59'
    }
    if(second > 59 || second < 0){
      throw 'Seconds must be between 0 and 59'
    }
    if(['h','m','s'].indexOf(unit[0]) < 0 ){
      throw 'Second argument of '+ method + ' method must be hours, minutes or seconds'
    }
  }

  return {

    add: function addTime(num, unit){
      try {
        validation(unit, num, 'add')
      }
      catch(err){
        return new Error(err)
      }
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
      try {
        validation(unit, num, 'subtract')
      }
      catch(err){
        return new Error(err)
      }
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
