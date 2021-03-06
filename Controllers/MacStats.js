var lines = [];
var datapoints = [];

function chooseAll() {
  var obj = document.getElementById('countries')
  for (var i = 0; i < obj.options.length; i++) {
    obj.options[i].selected = true;
  }

}

function drawStatistic() {
  if ($("#stats option:selected").val() == "nbr") {
    NbrOfMcDonalds()
  }
  else if ($("#stats option:selected").val() == "nbrPC") {
    NbrOfMcDonaldsPC()
  }
  else if ($("#stats option:selected").val() == "nbrPerInhabitants") {
    NbrOfMcDonaldsPerInhabitants()
  }
}

function NbrOfMcDonalds() {

  var currentdata = [];
  var obj = document.getElementById('countries');
  for (var i = 0; i < obj.options.length; i++) {
    if (obj.options[i].selected) {
      var country = obj.options[i].innerHTML;
      var data = { y: datapoints[country].mc, label: country }
      currentdata.push(data);
    }
  }

  drawBarChart("Number of McDonalds per country", "Number of McDonalds", currentdata)
}

function NbrOfMcDonaldsPC() {

  var currentdata = [];
  var obj = document.getElementById('countries')
  for (var i = 0; i < obj.options.length; i++) {
    if (obj.options[i].selected) {
      var country = obj.options[i].innerHTML;
      var data = { y: datapoints[country].mc / (datapoints[country].pop / 100000), label: country }
      currentdata.push(data)
    }
  }

  drawBarChart("Number of McDonalds per 100 000 people", "Number of McDonalds per 100 000 people", currentdata)
}

function NbrOfMcDonaldsPerInhabitants() {

  var currentdata = [];
  var obj = document.getElementById('countries')
  for (var i = 0; i < obj.options.length; i++) {
    if (obj.options[i].selected) {
      var country = obj.options[i].innerHTML;
      var data = { y: datapoints[country].mc / (datapoints[country].pop), label: country }
      currentdata.push(data)
    }
  }

  drawBarChart("Number of McDonalds per inhabitant", "Number of McDonalds per inhabitant", currentdata)
}


function onLoad() {
  $.ajax({
    type: "GET",
    url: "McDonaldsPerCountry.txt",
    dataType: "text",
    success: function (data) { processData(data); }
  });
}

function processData(allText) {

  var select = document.getElementById('countries');


  var allTextLines = allText.split(/\r\n|\n/);
  for (var i = 1; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(",");
    if (data[0] == "") {
      continue;
    }
    datapoints[data[0]] = { mc: parseFloat(data[1]), pop: parseFloat(data[2]) };
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = data[0];
    select.appendChild(opt);
  }

  var options = $("#countries option");                    // Collect options
  options.detach().sort(function (a, b) {               // Detach from select, then Sort
    var at = $(a).text();
    var bt = $(b).text();
    return (at > bt) ? 1 : ((at < bt) ? -1 : 0);            // Tell the sort function how to order
  });
  options.appendTo("#countries");

}

function drawBarChart(title, text, labels) {
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,

    title: {
      text: title
    },
    axisX: {
      interval: 1
    },
    axisY2: {
      interlacedColor: "rgba(1,77,101,.2)",
      gridColor: "rgba(1,77,101,.1)",
      title: text
    },
    data: [{
      type: "bar",
      name: "mcdonalds",
      axisYType: "secondary",
      color: "#014D65",
      dataPoints: labels
    }]
  });
  chart.render();
}
