function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}
//formating date 
function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}


function handleSubmit() {
  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input value from the form
  var tick = d3.select("#stockInput").node().value;
  console.log(tick);

  // clear the input value
  d3.select("#stockInput").node().value = "";

  // Build the plot with the new stock
  timebuildPlot(tick);
}




function timebuildPlot(tick) {
    /* data route */
  var url = "/api/stocks";
  d3.json(url).then(function(response) {

    console.log(response);
    var mydata = [response];
    //****Filtering apple data ******/
    console.log(tick);

    var applStocks =  response.filter(function(record) {
      return record.ticker == tick;
    });
    var tickdata = [applStocks];
    console.log("check-appl");
    console.log(applStocks);
    
    //console.log(data[0]);
   // date = [result[0] for result in all_data];
   var dateList =[];
   var highList =[];
   var lowList =[];
   var openList =[];
   var closeList =[];
   var tickerList =[];
   
   var dateList =[];
   var formDate =[];
   console.log(applStocks.length)
   for( var i = 0; i < applStocks.length; i++)
   {
    var dates = unpack(tickdata, i);
    console.log(dates);
    //var closingPrices = unpack(mydata, 1);
    //var highVal = dates.map(row => row.high);
    //var lowVal = dates.map(row => row.low);
   // var openVal = dates.map(row => row.open);
    //var closeVal = dates.map(row => row.close);
    //var tickerVal = dates.map(row => row.ticker);
    //var dateVal = dates.map(row => row.date);
    highList.push(dates[0]["high"]);
    lowList.push(dates[0]["low"]);
    openList.push(dates[0]["open"]);
    closeList.push(dates[0]["close"]);
    tickerList.push(dates[0]["ticker"]);
    dateList.push(dates[0]["date"]);
    formDate.push(formatDate(dates[0]["date"]));
    //console.log(dates[0]["high"])
    //console.log(highVal);
 

   }
   var rollingPeriod = 30;
   var rollingAvgClosing = rollingAverage(closeList, rollingPeriod);
   console.log(rollingAvgClosing);
   console.log(highList);
   console.log(dateList);
   
   console.log(formDate);
   var trace10 = {
    x: dateList,
    y: highList,
    mode: "markers",
    type: "scatter",
    name: "discus throw",
    marker: {
      color: "green",
      symbol: "diamond-x"
    }
  };

  var trace1 = {
    type: "scatter",
    mode: "lines",
    name: "closevalue",
    x: dateList,
    y: closeList,
    line: {
      color: "#17BECF"
    }
  };


  
  
  


  var layout = {
    title: `${tick} stock charts`,
    rangeSelector: {
      allButtonsEnabled: true,
      buttons: [{
          type: 'month',
          count: 3,
          text: 'Day',
          dataGrouping: {
              forced: true,
              units: [['day', [1]]]
          }
      }, {
          type: 'year',
          count: 1,
          text: 'Week',
          dataGrouping: {
              forced: true,
              units: [['week', [1]]]
          }
      }, {
          type: 'all',
          text: 'Month',
          dataGrouping: {
              forced: true,
              units: [['month', [1]]]
          }
      }],
      buttonTheme: {
          width: 60
      },
      selected: 2
  },
    
      
  };



  var plotData = [trace10]


  Plotly.newPlot("plot", plotData,layout);

 
});
}
//timebuildPlot();

d3.select("#submit").on("click", handleSubmit);
d3.select("#moresubmit").on("click", timebuildPlot);


