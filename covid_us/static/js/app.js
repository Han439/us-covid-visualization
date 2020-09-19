// define variable
let map = document.getElementById("map");

let growRate = document.getElementById("cases");

let fatalityRate = document.getElementById("fatality");

// initialize echart
let mapChart = echarts.init(map);

let growRateChart = echarts.init(growRate);

let fatalityRateChart = echarts.init(fatalityRate);

// color palette

const color = {
    body: '#edeef3',
    main: '#26286f',
    container: {
        bg: '#f7f7f7',
        shadow: 'rgba(200,204,223,0.5)', //'#c8ccdf'
    },
    tooltip: {
        bg: '#dce2ef',
    },
    label: {
        text: '#70747a',
    },
    map: {
        scheme: ['#dae0f7', '#706db1', '#26286f' ],
        subtext: '#706db1',
        timeline: '#26286f',
        timelineShadow: 'rgba(36,34,112,0.5)',
        areaColor: '#edeef3',
    },
    bar: {
        grow: '#426ab9', 
        fatality: '#9999ca',
    }

};

const mainFont = 'monospace';


// urls
let mapUrl = "/api/map/";
let growUrl = "/api/grow/";
let fatalityUrl = "/api/death/";

// helper function

function numberFormat(text) {
    return (JSON.stringify(text)).replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
}

function getOptions(res) {
    let opt = []
    for (i = 0; i < res.dates.length; i++) {
        opt.push({})
        opt[i].series = {data: res.mapData[res.dates[i]]}
        opt[i].visualMap = {min: res.mapData[res.dates[i] + 'min'], 
                            max: res.mapData[res.dates[i] + 'max']==res.mapData[res.dates[i] + 'min']?
                            0:res.mapData[res.dates[i] + 'max']}
        opt[i].title = {subtext: 'Total Cases: ' + numberFormat(res.mapData[res.dates[i] + 'total'])}
    }
    return opt
    
};

// prepare function

function chartPrepare(barColor, res, chart, subtext) {
    let option = {

            title: {
                text: numberFormat(res.rate[res.rate.length - 1]),
                textStyle: {
                    color: barColor,
                    fontSize: 26,
                    fontFamily: mainFont,
                },
                subtext: subtext,
                subtextStyle: {
                    color: color.label.text,
                    fontSize: 10,
                    fontFamily: mainFont,
                },
                itemGap: 0,
                right: 'center',
                top: '5%',
                padding: [0,0,10,0],


            },

            xAxis: {    
                data: res.date,
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: color.label.text,
                    fontSize: 10,
                },
            },

            yAxis: {
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: color.label.text,
                    fontSize: 10,
                },
            },

            tooltip: {
                        formatter: function(params) {
                            var value = (params.value + '').split('.');
                            value = numberFormat(value[0]);
                            return params.name + '<br/>' + value + params.seriesName
                        },
                        backgroundColor: color.tooltip.bg, 
                        padding: [10,15],
                        textStyle: {
                            color: color.main,
                            fontFamily: mainFont,
                        },
                    },
            
            grid: {
                show: false,
                left: '15%',
                top: '30%',
            },

            series: [
                {
                    name: ' new cases',
                    type: 'bar',
                    color: barColor,
                    data: res.rate,
                    emphasis: {
                        itemStyle: {
                            color: color.main,
                        },
                    },
                },

                {
                    name: ' (7 day rolling average)',
                    type: 'line',
                    color: color.main,
                    data: res.rolling,
                }
            ]
    };

    chart.setOption(option);
};

// fetch data
fetch(growUrl)
  .then((data) => data.json())
  .then((res) => {
    chartPrepare(color.bar.grow, res, growRateChart, 'new cases');
  })
  .catch((err) => console.log(err));


// fatalities chart

fetch(fatalityUrl)
  .then((data) => data.json())
  .then((res) => {
    chartPrepare(color.bar.fatality, res, fatalityRateChart, 'new fatalities')
  })
  .catch((err) => console.log(err));


// US Map
let mapData;

fetch(mapUrl)
.then((res) => res.json())
.then((res) => {
	mapChart.showLoading();

fetch('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95368/USA_geo.json')
.then((usaJson) => usaJson.json())
.then((usaJson) => {
    mapChart.hideLoading();

    echarts.registerMap('USA', usaJson, {
        'Alaska': {            
            left: -131,
            top: 25,
            width: 15
        },
        'Hawaii': {
            left: -110,       
            top: 25,
            width: 5
        },
        'Puerto Rico': {       
            left: -76,
            top: 26,
            width: 2
        }
    });
    option = {
    	baseOption: {
    		timeline: {
	            axisType: 'category',
	            realtime: true,
	            // loop: false,
	            autoPlay: false,
	            currentIndex: res.dates.length - 1,
	            playInterval: 1000,
                symbolSize: 7,
	            controlStyle: {
	                position: 'left',
                    itemSize: 14,
                    emphasis: {
                        color: color.main,
                    },
	            },

	            data: res.dates,
	            tooltip: {
	            	formatter: function(params) {
	            		return params.name
	            	}
	            },
                itemStyle: {
                    color: color.main,
                    borderType: 'solid',
                    borderWidth: 0.5,
                    emphasis: {
                        color: color.main,
                    },
                },

                lineStyle: {
                    show: false,
                },

                checkpointStyle: {
                    symbol: 'circle',
                    color: color.map.timeline,
                    borderColor: color.map.timelineShadow,
                    symbolSize: 10,
                },

	            label: {
                    color: color.label.text,
                    fontSize: 10,
                    emphasis: {
                        color: color.label.text,
                    }
	            },
	        },
            title: {
                text: 'USA COVID-19 CASES',
                textStyle: {
                    color: color.main,
                    fontSize: 28,
                    fontFamily: mainFont,
                },
                subtextStyle: {
                    color: color.map.subtext,
                    fontSize: 18,
                    fontFamily: mainFont,
                },
                left: 'center'
            },
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params) {
                let value = numberFormat(params.value);
                return params.seriesName + '<br/>' + value;
            },
            backgroundColor: color.tooltip.bg,
            padding: [10,15],
            textStyle: {
                color: color.main,
                fontFamily: mainFont,
            },
        },
        visualMap: {
            left: 'right',
            inRange: {
                color: color.map.scheme
            },
            calculable: true,
            itemWidth: 7,
            textStyle: {
                color: color.label.text,
                fontSize: 12,
            },
        },
        series: [
            {
                name: 'Total Cases',
                type: 'map',
                roam: false,
                map: 'USA',
                itemStyle: {
                    borderColor: color.container.bg,
                    borderWidth: 2,
                },
                emphasis: {
                    label: {
                        show: true,
                        color: color.label.text,
                    },
                    itemStyle: {
                        areaColor: color.map.areaColor,
                        borderColor: color.container.bg,
                    },
                },
            }
        ]
    },
    options: getOptions(res)
    };

    mapChart.setOption(option);
})
.catch((err) => console.log(err))
})
.catch((err) => console.log(err))

