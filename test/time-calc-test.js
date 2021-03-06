var assert = require('chai').assert
var timeCalc = require('../time-calc')
describe('Should throw errors',function(){
  it('if hours are outside range 0 - 23', function(done){
    assert.equal(timeCalc('26:00:00').add(1,'s') instanceof Error, true)
    assert.equal(timeCalc('-03:00:00').add(1,'s') instanceof Error, true)
    assert.equal(timeCalc('26:00:00').subtract(1,'s') instanceof Error, true)
    assert.equal(timeCalc('-03:00:00').subtract(1,'s') instanceof Error, true)
    done()
  }),
  it('if minutes are outside range 0 - 59', function(done){
    assert.equal(timeCalc('23:62:00').add(1,'s') instanceof Error, true)
    assert.equal(timeCalc('03:-4:00').add(1,'s') instanceof Error, true)
    assert.equal(timeCalc('23:62:00').subtract(1,'s') instanceof Error, true)
    assert.equal(timeCalc('03:-4:00').subtract(1,'s') instanceof Error, true)
    done()
  }),
  it('if seconds are outside range 0 - 59', function(done){
    assert.equal(timeCalc('22:00:-01').add(1,'s') instanceof Error, true)
    assert.equal(timeCalc('03:00:63').add(1,'s') instanceof Error, true)
    assert.equal(timeCalc('22:00:-01').subtract(1,'s') instanceof Error, true)
    assert.equal(timeCalc('03:00:63').subtract(1,'s') instanceof Error, true)
    done()
  }),
  it('if time is not received as a string', function(done){
    assert.equal(timeCalc(2200).add(1,'s') instanceof Error, true)
    assert.equal(timeCalc(2200).subtract(1,'s') instanceof Error, true)
    done()
  }),
  it('if time is not received in the format \'HH:MM:SS\'', function(done){
    assert.equal(timeCalc('22:00').add(1,'s') instanceof Error, true)
    assert.equal(timeCalc('22:00').subtract(1,'s') instanceof Error, true)
    done()
  }),
  it('if first argument of add method is not a number', function(done){
    assert.equal(timeCalc('22:00:00').add('notANumber','s') instanceof Error, true)
    done()
  }),
  it('if first argument of subtract method is not a number', function(done){
    assert.equal(timeCalc('22:00:00').subtract('notANumber','s') instanceof Error, true)
    done()
  }),
  it('if second argument of add method does not begin with \'h\',\'m\' or \'s\'', function(done){
    assert.equal(timeCalc('22:00:00').add('notANumber','days') instanceof Error, true)
    done()
  }),
  it('if second argument of subtract method does not begin with \'h\',\'m\' or \'s\'', function(done){
    assert.equal(timeCalc('22:00:00').subtract('notANumber','days') instanceof Error, true)
    done()
  })
}),
describe('Adding time', function(){
  it('should add correct number of seconds',function(done){
    assert.equal('12:00:01',timeCalc('12:00:00').add(1,'s'))
    assert.equal('01:00:25',timeCalc('01:00:00').add(25,'secs'))
    assert.equal('13:00:52',timeCalc('13:00:49').add(3,'seconds'))
  done()
  }),
  it('should increase minutes correctly if seconds exceed 60',function(done){
    assert.equal('12:01:40',timeCalc('12:00:00').add(100,'s'))
    assert.equal('01:10:25',timeCalc('01:00:25').add(600,'secs'))
    assert.equal('13:01:01',timeCalc('13:00:49').add(12,'seconds'))
  done()
  }),
  it('should add correct number of minutes',function(done){
    assert.equal('12:01:00',timeCalc('12:00:00').add(1,'m'))
    assert.equal('01:25:00',timeCalc('01:00:00').add(25,'minutes'))
    assert.equal('13:52:00',timeCalc('13:49:00').add(3,'minutes'))
  done()
  }),
  it('should increase hours correctly if minutes exceed 60',function(done){
    assert.equal('13:01:00',timeCalc('12:01:00').add(60,'m'))
    assert.equal('11:10:25',timeCalc('01:10:25').add(600,'m'))
    assert.equal('14:04:49',timeCalc('13:52:49').add(12,'m'))
  done()
  }),
  it('should add correct number of hours',function(done){
    assert.equal('13:00:00',timeCalc('12:00:00').add(1,'h'))
    assert.equal('15:25:00',timeCalc('01:25:00').add(14,'hour'))
    assert.equal('16:49:00',timeCalc('13:49:00').add(3,'hours'))
  done()
  }),
  it('should restart hours at 0 if hours exceed 24',function(done){
    assert.equal('00:00:00',timeCalc('23:00:00').add(1,'h'))
    assert.equal('15:25:00',timeCalc('03:25:00').add(12,'hour'))
    assert.equal('08:49:00',timeCalc('16:49:00').add(16,'hours'))
  done()
  })
})

describe('Subtracting time', function(){
  it('should subtract correct number of seconds',function(done){
    assert.equal('12:00:00',timeCalc('12:00:01').subtract(1,'s'))
    assert.equal('01:00:00',timeCalc('01:00:25').subtract(25,'secs'))
    assert.equal('13:00:49',timeCalc('13:00:52').subtract(3,'seconds'))
  done()
  }),
  it('should decrease minutes correctly if seconds subtracted exceed seconds in time',function(done){
    assert.equal('12:00:00',timeCalc('12:01:40').subtract(100,'s'))
    assert.equal('01:00:25',timeCalc('01:10:25').subtract(600,'secs'))
    assert.equal('13:00:49',timeCalc('13:01:01').subtract(12,'seconds'))
  done()
  }),
  it('should subtract correct number of minutes',function(done){
    assert.equal('12:00:00',timeCalc('12:01:00').subtract(1,'m'))
    assert.equal('01:00:00',timeCalc('01:25:00').subtract(25,'minutes'))
    assert.equal('13:49:00',timeCalc('13:52:00').subtract(3,'minutes'))
  done()
  }),
  it('should decrease hours correctly if minutes subtracted exceed minutes in time',function(done){
    assert.equal('12:01:00',timeCalc('13:01:00').subtract(60,'m'))
    assert.equal('01:10:25',timeCalc('11:10:25').subtract(600,'m'))
    assert.equal('13:52:49',timeCalc('14:04:49').subtract(12,'m'))
  done()
  }),
  it('should subtract correct number of hours',function(done){
    assert.equal('12:00:00',timeCalc('13:00:00').subtract(1,'h'))
    assert.equal('01:25:00',timeCalc('15:25:00').subtract(14,'hour'))
    assert.equal('13:49:00',timeCalc('16:49:00').subtract(3,'hours'))
  done()
  }),
  it('should restart hours at 23 if hours pass 0',function(done){
    assert.equal('23:00:00',timeCalc('00:00:00').subtract(1,'h'))
    assert.equal('03:25:00',timeCalc('15:25:00').subtract(12,'hour'))
    assert.equal('16:49:00',timeCalc('08:49:00').subtract(16,'hours'))
  done()
  })
})