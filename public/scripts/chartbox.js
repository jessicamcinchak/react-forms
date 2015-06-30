/** 
* @jsx React.DOM
*/

/* 
* Create most top level component
* Renders container to hold ChartForm and ChartList
* @returns div (div tags are not actual DOM nodes, but instantiations of React div components)
*/
var ChartBox = React.createClass({displayName: "ChartBox",
  loadChartsFromServer: function() { //hook up the data model, make asynchronous request to server
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data}); //key to dynamic updates, replace old data array with new one from server
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleChartSubmit: function(chart) { 
    var charts = this.state.data; //react calls this "optimistic updates", update the UI list before the server call happens
    charts.push(chart);
    this.setState({data: charts}, function() {
      $.ajax({ //submit to the server and refresh the list
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: chart,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  getInitialState: function() { //executes exactly once during lifecycle of component, sets up initial state
    return {data: []};
  },
  componentDidMount: function() { //method called automatically by react when component is rendered
    this.loadChartsFromServer();
    setInterval(this.loadChartsFromServer, this.props.pollInterval);
  },
  /*
  * Pass data from child component back up to parent; new callback (handleChartSubmit) is triggered when event is invoked
  * Returns a tree of components
  */
  render: function() {
    return (
      React.createElement("div", {className: "chartBox"}, 
        React.createElement("h1", null, "Charts"), 
        React.createElement(ChartForm, {onChartSubmit: this.handleChartSubmit}), 
        React.createElement(ChartList, {data: this.state.data})
      )
    );
  }
});

/*
* Instantiate the root component, start the framework, and inject markup in raw DOM element 
* React.render() runs only once on top level component
*/
React.render(
  React.createElement(ChartBox, {url: "public/charts.json", pollInterval: 120000}), //fetch data from server every 2 minutes
  document.getElementById('content')
);