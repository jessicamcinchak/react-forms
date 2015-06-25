/** 
* @jsx React.DOM
*/

/* 
* Create most top level component
* Renders container to hold ChartForm and ChartList
* @returns div (div tags are not actual DOM nodes, but instantiations of React div components)
*/
var ChartBox = React.createClass({displayName: "ChartBox",
  loadChartsFromServer: function() { //hook up the data model
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleChartSubmit: function(chart) {
    var charts = this.state.data;
    charts.push(chart);
    this.setState({data: charts}, function() {
      $.ajax({
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
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() { //method called automatically by react when component is rendered
    this.loadChartsFromServer();
    setInterval(this.loadChartsFromServer, this.props.pollInterval);
  },
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
* React.render() runs only once
* It instantiates the root component, starts the framework, and injects markup in raw DOM element
*/
React.render(
  React.createElement(ChartBox, {url: "charts.json", pollInterval: 120000}), //fetch data from server every 2 minutes
  document.getElementById('content')
);