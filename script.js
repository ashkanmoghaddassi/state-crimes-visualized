import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

let crime_data;
let violent_data;

d3.csv("state_crime.csv",d3.autoType).then(data => {
  console.log("crime_data:", data);
  crime_data = data;
  
  fill_state_select(crime_data);
  
  getStackedChartData(crime_data, "Alabama");

  //update stacked area chart on selection of state
  var element = document.querySelector("#select-state");
  element.addEventListener("change", event => {
    var state = event.target.value;
    console.log("selected state:", state);
    getStackedChartData(crime_data, state);
    
  });

});

//function that gets the data for the stacked area chart
function getStackedChartData(crime_data, state) {
    var new_data = []
    var index = 0;
    
    for(let i=0;i<crime_data.length;i++) {
      if(crime_data[i].State==state) {
        new_data[index] = {};
        
        //create new date format from given year
        var date_to_push = new Date(crime_data[i].Year, 0);
        
        new_data[index]["date"] = date_to_push;
        new_data[index]["Data Rates Property All"] = crime_data[i]["Data.Rates.Property.All"];
        new_data[index]["Data Rates Property Burglary"] = crime_data[i]["Data.Rates.Property.Burglary"];
        new_data[index]["Data Rates Property Larceny"] = crime_data[i]["Data.Rates.Property.Larceny"];
        new_data[index]["Data Rates Property Motor"] = crime_data[i]["Data.Rates.Property.Motor"];
        new_data[index]["Data Rates Violent All"] = crime_data[i]["Data.Rates.Violent.All"];
        new_data[index]["Data Rates Violent Assault"] = crime_data[i]["Data.Rates.Violent.Assault"];
        new_data[index]["Data Rates Violent Murder"] = crime_data[i]["Data.Rates.Violent.Murder"];
        new_data[index]["Data Rates Violent Rape"] = crime_data[i]["Data.Rates.Violent.Rape"];
        new_data[index]["Data Rates Violent Robbery"] = crime_data[i]["Data.Rates.Violent.Robbery"];
        //new_data[index]["Data Rates Total"] = crime_data[i]["Data.Rates.Violent.All"] + crime_data[i]["Data.Rates.Property.All"];
        new_data[index]["Data Rates Total"] = crime_data[i]["Data.Rates.Violent.Assault"] + crime_data[i]["Data.Rates.Violent.Murder"] + crime_data[i]["Data.Rates.Violent.Rape"] + crime_data[i]["Data.Rates.Violent.Robbery"] + crime_data[i]["Data.Rates.Property.Larceny"]  + crime_data[i]["Data.Rates.Property.Motor"] + crime_data[i]["Data.Rates.Property.Burglary"];
        index++;
      }
    }
    
    new_data["columns"] = ["Data Rates Property Burglary",
                          "Data Rates Property Larceny", "Data Rates Property Motor"
                          ,"Data Rates Violent Assault",
                          "Data Rates Violent Murder", "Data Rates Violent Rape",
                          "Data Rates Violent Robbery"];
    
    let stackChart = StackedAreaChart(".stacked-chart");
    stackChart.update(new_data);
  
    //function that removes an element by class
    function removeElementsByClass(className){
      const elements = document.getElementsByClassName(className);
      while(elements.length > 0){
          elements[0].parentNode.removeChild(elements[0]);
      }
    }
  
    removeElementsByClass("chart");
    //first add div back with class stacked-chart
    var elem = document.createElement('div'); 
    elem.setAttribute("class", "chart");
    var referenceNode = document.querySelector('.stacked-chart');
    referenceNode.after(elem);
  
    let chart = AreaChart(".chart");
    chart.update(new_data);
    chart.on("brushed", (range) => {
      stackChart.filterByDate(range);
    });
    stackChart.update(new_data);

}

function fill_state_select(data) {
  var state_array = [];
  for(let i=0;i<data.length;i++) {
    if(!state_array.includes(data[i].State)) {
      state_array.push(data[i].State)
    }
  }
  var select_state = document.getElementById('select-state');
  for(let i=0;i<state_array.length;i++) {
    var opt = document.createElement("option");
    opt.value = state_array[i];
    opt.innerHTML = state_array[i];
    select_state.appendChild(opt);
  }
}
