var data = [
 {"hour":0, "flux":3.16478601116465},
{"hour":0.5, "flux":22.1456482860809},
{"hour":1, "flux":25.8095946473111},
{"hour":1.5, "flux":0},
{"hour":2, "flux":12.9909545039493},
{"hour":2.5, "flux":5.77720381981341},
{"hour":3, "flux":2.31009320620076},
{"hour":3.5, "flux":3.68803143207302},
{"hour":4, "flux":4.95338773459244},
{"hour":4.5, "flux":4.22855320592019},
{"hour":5, "flux":1.39606574504859},
{"hour":5.5, "flux":0},
{"hour":6, "flux":2.85800588650305},
{"hour":6.5, "flux":2.39668593445223},
{"hour":7, "flux":4.1891561275925},
{"hour":7.5, "flux":2.40822589342636},
{"hour":8, "flux":1.85457785405726},
{"hour":8.5, "flux":-0.112183010162632},
{"hour":9, "flux":-2.68203182908294},
{"hour":9.5, "flux":0},
{"hour":10, "flux":-7.21431067810065},
{"hour":10.5, "flux":-6.86547952475759},
{"hour":11, "flux":-9.09431156101892},
{"hour":11.5, "flux":-7.42573521832241},
{"hour":12, "flux":-4.9564417463761},
{"hour":12.5, "flux":-6.47861235903334},
{"hour":13, "flux":-5.82924883701355},
{"hour":13.5, "flux":-7.96012820006848},
{"hour":14, "flux":-8.84107168651841},
{"hour":14.5, "flux":-5.62550730326903},
{"hour":15, "flux":-9.10427808185619},
{"hour":15.5, "flux":-7.22037683745786},
{"hour":16, "flux":-6.12972715312416},
{"hour":16.5, "flux":-5.5417524642788},
{"hour":17, "flux":-6.65296129600869},
{"hour":17.5, "flux":-5.07510288127219},
{"hour":18, "flux":-1.97457411269737},
{"hour":18.5, "flux":-2.31260500385695},
{"hour":19, "flux":0.528885083020355},
{"hour":19.5, "flux":2.89765672809648},
{"hour":20, "flux":2.18413132747326},
{"hour":20.5, "flux":6.98750213227665},
{"hour":21, "flux":64.337764101315},
{"hour":21.5, "flux":-0.434057340118761},
{"hour":22, "flux":10.8775751174247},
{"hour":22.5, "flux":33.6445234742752},
{"hour":23, "flux":30.6417394851409},
{"hour":23.5, "flux":5.83726386896085},
{"hour":24, "flux":2.93639442},
]

var ƒ = d3.f

var sel = d3.select('#theChart').html('')
var c = d3.conventions({
  parentSel: sel, 
  totalWidth: sel.node().offsetWidth, 
  height: 400, //chart height
  margin: {left: 50, right: 50, top: 30, bottom: 30} //margins
})


c.svg.append('rect').at({width: c.width, height: c.height, opacity: .40}) //general rectangle settings

c.x.domain([0, 24]) //x range
c.y.domain([-10, 70]) //y range

c.xAxis.ticks(24).tickFormat(ƒ()) //x access ticks
c.yAxis.ticks(10).tickFormat(d => d ) //y access ticks

var area = d3.area()
              .x(ƒ('hour', c.x))
              .y0(ƒ('flux', c.y))
              .y1(c.height)
              //.curve(d3.curveCatmullRom.alpha(0.5)); //curves it up but unsure this the right choice here . . . for the data that is
var line = d3.area()
              .x(ƒ('hour', c.x))
              .y(ƒ('flux', c.y))
              //.curve(d3.curveCatmullRom.alpha(0.5)); //match curve above
              

var clipRect = c.svg
  .append('clipPath#clip')
  .append('rect')
  .at({width: c.x(12), height: c.height})  //sets the clip path start ************

var correctSel = c.svg.append('g').attr('clip-path', 'url(#clip)')

correctSel.append('path.area').at({d: area(data)})
correctSel.append('path.line').at({d: line(data)})
yourDataSel = c.svg.append('path.your-line')

c.drawAxis()

yourData = data
  .map(function(d){ return {hour: d.hour, flux: d.flux, defined: 0} })
  .filter(function(d){
    if (d.hour == 12) d.defined = true //
    return d.hour >= 12 // start point for the user line -- needs to match start for clip path  **********
  })


var completed = false
var drag = d3.drag()
  .on('drag', function(){
    var pos = d3.mouse(this)
    //console.log(pos) // added to see how data is logged on the mouse change
    var hour = clamp(13, 24, c.x.invert(pos[0])) //make sure this first number is one higher than the clip number ... or not thought this was the key
    var flux = clamp(-10, c.y.domain()[1], c.y.invert(pos[1])) // limit x and y values for user created data  ***** first number should match where data clip occurs


    yourData.forEach(function(d){
      if (Math.abs(d.hour - hour) < .5){
        d.flux = flux
        d.defined = true
      }
    })

    yourDataSel.at({d: line.defined(ƒ('defined'))(yourData)})

    if (!completed && d3.mean(yourData, ƒ('defined')) == 1){
      completed = true
      clipRect.transition().duration(2000).attr('width', c.x(24))      
    }
  })

c.svg.call(drag)



function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }

//path class your-line seems to be what's holding user entered data

