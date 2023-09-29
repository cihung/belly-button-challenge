//Store API 
// Use the D3 library to read in samples.json
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
// Fetch JSON data 
d3.json(url).then(function(data){
    console.log(data);
});

// Display the default plots 
function init(){
    let dropdownMenu = d3.select("#selDataset");
    // Saple names and populate drop down menu 
    d3.json(url).then((data) => {
        let names = data.names;
        // Iterate through the names array 
        names.forEach((id) => {
            console.log(id);

            dropdownMenu.append("option").text(id).property("value", id);
        });
        //Set the name for the first name variables 
        let name = names[0];
        console.log(name);

        //Functions to make the demography panel, bar chart and bubble chart, innitial pilots.
        demographic(name);
        bar(name);
        bubble(name);
        gouge(name);
    });

};

// Fuction to make demographic panels
function demographic(sample){

    d3.json(url).then((data) => {

        // Get all metadata
        let metadata = data.metadata;
        // Filter based on the value of the sample
        let filteredData = metadata.filter(result => result.id == sample);
        console.log(filteredData);
        // Get the first index to index variable
        let valueData = filteredData[0]
        // Clear metadata
        d3.select("#sample-metadata").html("");
        // Use Object.entries to add an array of a given object's own enumerable property
        let entries = Object.entries(valueData);
        //Iterate throu the entries array
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
        //check entries 
        console.log(entries)
    }) ;
}

//Plot the bar chart
function bar(sample) {
    //Use json to retrieve all data sample
    d3.json(url).then((data) => {
        console.log('Data: ${data}');

        //Retrieve all sample data
        let sampleData = data.samples;

        //Filter data based on id
        let filteredData = sampleData.filter(result => result.id == sample);

        //Assign the first object to variable 
        let obj = filteredData[0];

        //Set the labels, sample values and otu_ids
        let otu_ids = obj.otu_ids;
        let otu_labels = obj.otu_labels;
        let sample_values = obj.sample_values;

        console.log(otu_ids, otu_labels, sample_values)

        //Plot the horizontal bar chart 
        let trace = [{
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        
        //Plot the bar using plotly 
        Plotly.newPlot("bar", trace);
    });
}

//Make bubble chart 
function bubble(sample) {
    //Use json to retrieve all data sample
    d3.json(url).then((data) => {

        //Retrieve all sample data
        let sampleInfo = data.samples;

        //Filter data based on value
        let filteredValue = sampleInfo.filter(result => result.id == sample);

        //Assign the first object to variable 
        let value = filteredValue[0];

        //Set the labels, sample values and otu_ids
        let otu_ids = value.otu_ids;
        let otu_labels = value.otu_labels;
        let sample_values = value.sample_values;

        console.log(otu_ids, otu_labels, sample_values)

        //Plot the bubble bar chart 
        let trace1 = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker:{
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];
        
        //Set up layout 
        let layout = {
            title: "Bacteria Per Sample",
            xaxis: {title: "OTU ID"},
            width: 1500,
            height: 550
        };

        //Plot data into a bubble chart using plotly 
        Plotly.newPlot("bubble", trace1, layout);
    });
}

//Gouge chart space 


//Function that updates dashboard when sample changes
function optionChange (sample){
    demographic(sample);
    bar(sample);
    bubble(sample)
}
init();