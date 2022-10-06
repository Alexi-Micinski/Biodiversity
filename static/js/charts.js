function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        // Use d3 to select the panel with id of `#sample-metadata`
        var PANEL = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        PANEL.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

    });
}

// Create the buildCharts function.
function buildCharts(sample) {
    // Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
        // Create a variable that holds the samples array. 
        var allSamples = data.samples;
        // Create a variable that filters the samples for the object with the desired sample number.
        var filterSamples = allSamples.filter(sampleObj => sampleObj.id == sample);
        console.log(filterSamples);
        // Create a variable that holds the first sample in the array.
        var firstSample = filterSamples[0]
        console.log(firstSample);
        // Create variables that hold the otu_ids, otu_labels, and sample_values.
        var otuIds = firstSample.otu_ids;
        var otuLabels = firstSample.otu_labels;
        var sampleValues = firstSample.sample_values;

        // Create the yticks for the bar chart.
        // Hint: Get the the top 10 otu_ids and map them in descending order  
        //  so the otu_ids with the most bacteria are last. 

        var yticks = otuIds.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();

        // Create the trace for the bar chart. 
        var rawbardata = {
            x: sampleValues.slice(0, 10).reverse(),
            y: yticks,
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };

        var barData = [rawbardata];

        // Create the layout for the bar chart. 
        var barLayout = {
            width: 450,
            height: 375,
            margin: { t: 100, r: 25, l: 75, b: 50 },
            title: "Top 10 Bacteria Cultures Found",
        };
        // Use Plotly to plot the data with the layout. 
        Plotly.newPlot("bar", barData, barLayout);

        // Bubble charts
        var rawbubbledata = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                color: otuIds,
                size: sampleValues,
                colorscale: 'Earth'
            }
        };

        var bubbleData = [rawbubbledata];

        // Create the layout for the bubble chart.
        var bubbleLayout = {
            width: 1100,
            height: 500,
            margin: { t: 100, r: 25, l: 50, b: 100, pad: 1 },
            responsive: true,
            title: "Bacteria Cultures Per Sample",
            xaxis: { title: "OTU IDs" },
            hovermode: "closest"
        };

        // Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        // Create a variable that filters the metadata array for the object with the desired sample number.
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

        // Create a variable that holds the first sample in the metadata array.
        var result = resultArray[0];

        // Create a variable that holds the washing frequency.
        var washFreq = result.wfreq;

        // Create the trace for the gauge chart.
        var rawgaugeData = {
            domain: { x: [0, 1], y: [0, 1] },
            value: washFreq,
            title: { text: "Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                'axis': { 'range': [null, 10] },
                bar: { color: 'black' },
                'steps': [
                    { 'range': [0, 2], 'color': "red" },
                    { 'range': [2, 4], 'color': "orange" },
                    { 'range': [4, 6], 'color': "yellow" },
                    { 'range': [6, 8], 'color': "limegreen" },
                    { 'range': [8, 10], 'color': "green" }
                ]
            }
        };

        var gaugeData = [rawgaugeData];

        // Create the layout for the gauge chart.
        var gaugeLayout = {
            width: 400,
            height: 375,
            margin: { t: 100, r: 25, l: 25, b: 25 },
            title: "Belly Button Washing Frequency"
        };

        // Use Plotly to plot the gauge data and layout.
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
}