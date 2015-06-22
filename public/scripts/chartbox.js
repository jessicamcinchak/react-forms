/** 
* @jsx React.DOM
*/

/* most top level component, render container to hold form and list */
var ChartBox = React.createClass({displayName: "ChartBox",
  loadChartsFromServer: function() {
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
      // `setState` accepts a callback. To avoid (improbable) race condition,
      // `we'll send the ajax request right after we optimistically set the new
      // `state.
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
  componentDidMount: function() {
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

React.render(
  React.createElement(ChartBox, {url: "charts.json", pollInterval: 120000}),
  document.getElementById('content')
);