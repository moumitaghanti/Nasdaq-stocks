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
  // Calculate a rolling average for an array
  function rollingAverage(arr, windowPeriod = 10) {
    // rolling averages array to return
    var averages = [];
  
    // Loop through all of the data
    for (var i = 0; i < arr.length - windowPeriod + 1; i++) {
      // calculate the average for a window of data
      var sum = 0;
      for (var j = 0; j < windowPeriod; j++) {
        sum += arr[i + j];
      }
      // calculate the average and push it to the averages array
      averages.push(sum / windowPeriod);
    }
    return averages;
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
    buildPlot(tick);
  }
  function handlemoreSubmit() {
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

    var tickStocks =  response.filter(function(record) {
      return record.ticker == tick;
    });
    var tickdata = [tickStocks];
    console.log("check-appl");
    console.log(tickStocks);
    
    //console.log(data[0]);
   // date = [result[0] for result in all_data];
   
   var highList =[];
   var lowList =[];
   var openList =[];
   var closeList =[];
   var tickerList =[];
   
   var dateList =[];
   var formDate =[];
   console.log(tickStocks.length)
   for( var i = 0; i < tickStocks.length; i++)
   {
    var datas = unpack(tickdata, i);
    console.log(datas);
    //var closingPrices = unpack(mydata, 1);
    //var highVal = datas.map(row => row.high);
    //var lowVal = datas.map(row => row.low);
   // var openVal = datas.map(row => row.open);
    //var closeVal = datas.map(row => row.close);
    //var tickerVal = datas.map(row => row.ticker);
    //var dateVal = datas.map(row => row.date);
    highList.push(datas[0]["high"]);
    lowList.push(datas[0]["low"]);
    openList.push(datas[0]["open"]);
    closeList.push(datas[0]["close"]);
    tickerList.push(datas[0]["ticker"]);
    dateList.push(datas[0]["date"]);
    formDate.push(formatDate(datas[0]["date"]));
    //console.log(dates[0]["high"])
    //console.log(highVal);
 

   }
   //var rollingPeriod = 30;
   //var rollingAvgClosing = rollingAverage(closeList, rollingPeriod);
   //console.log(rollingAvgClosing);
   console.log(highList);
   console.log(dateList);
   
   console.log(formDate);
   var lastClose = closeList.slice(-1);
   var lastOpen = openList.slice(-1);
   var arrcolor = (lastClose > lastOpen ? 'green' : 'red');
   var direction = (lastClose > lastOpen ? '&#x25B2;' : '&#x25BC;');
   
   console.log("last close");
   console.log(direction);
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
    x: formDate,
    y: closeList,
    line: {
      color: "#17BECF"
    }
  };

 var selectorOptions = {
    buttons: [{
        step: 'month',
        stepmode: 'backward',
        count: 1,
        label: '1m'
    }, {
        step: 'month',
        stepmode: 'backward',
        count: 6,
        label: '6m'
    }, {
        step: 'year',
        stepmode: 'todate',
        count: 1,
        label: 'YTD'
    }, {
        step: 'year',
        stepmode: 'backward',
        count: 1,
        label: '1y'
    }, {
        step: 'all',
    }],
};

  
 

  var layout = {
    title:  `${tick} closing price stock charts  ${lastClose} ${direction}`,
    
    xaxis: {
      rangeselector: selectorOptions,
      rangeslider: {}
  },
  yaxis: {
      fixedrange: true
  }
  };



  var plotData = [trace1]


  Plotly.newPlot("plot", plotData, layout);

 
});
}
d3.select("#moresubmit").on("click", handlemoreSubmit);  