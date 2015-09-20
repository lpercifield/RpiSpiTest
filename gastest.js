ADC = require 'adc-pi-spi'
options =
    tolerance: 10       #default = 10
    pollInterval: 200   #default = 200
    channels: [0,1] #default = [0]

adc=new ADC('/dev/spidev0.0', options)

adc.on 'change', (channel, value)->
    console.log 'channel ', channel, 'is now', value

process.on 'SIGTERM', () ->
    adc.close()

process.on 'SIGINT', () ->
    adc.close()

process.on 'exit', () ->
    adc.close()
