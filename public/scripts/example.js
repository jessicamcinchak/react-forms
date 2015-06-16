var Chart = React.createClass({displayName: "Chart",
  componentDidMount: function() {
    var $el = $(this.getDOMNode()), $chart,
        search = $el.find('.cts'),
        cm;
    if (search.length > 0) {
      $chart = $(search);
      ChartistHtml.config.baseClass = 'cts';
      cm = new ChartistHtml.ChartManager($chart);
      cm.setData();
      cm.render();
    }
  },
  render: function() {
    var data = this.props.children;
    data.chart = data.chart || '<p></p>';
    return (
      React.createElement("div", {className: "chart"}, 
        React.createElement("h2", {className: "chartAuthor"}, 
          data.author
        ), 
        React.createElement("div", {dangerouslySetInnerHTML: { __html: data.chart}})
      )
    );
  }
});

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
        React.createElement(ChartList, {data: this.state.data}), 
        React.createElement(ChartForm, {onChartSubmit: this.handleChartSubmit})
      )
    );
  }
});

var ChartList = React.createClass({displayName: "ChartList",
  render: function() {
    var chartNodes = this.props.data.map(function(chart, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        React.createElement(Chart, {key: index}, 
          chart
        )
      );
    });
    return (
      React.createElement("div", {className: "chartList"}, 
        chartNodes
      )
    );
  }
});

var ChartForm = React.createClass({displayName: "ChartForm",
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    var chart = React.findDOMNode(this.refs.chart).value.trim();
    if (!text || !author || !chart) {
      return;
    }
    this.props.onChartSubmit({author: author, text: text, chart: chart});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    React.findDOMNode(this.refs.chart).value = '';
  },
  render: function() {
    return (
      React.createElement("form", {className: "chartForm", onSubmit: this.handleSubmit}, 

        React.createElement("label", {for: "author"}, "Author"), 
        React.createElement("input", {type: "text", id: "author", placeholder: "your name here", ref: "author"}), 

        React.createElement("label", {for: "chart-title"}, "Chart Title"), 
        React.createElement("input", {type: "text", id: "chart-title", placeholder: "chart title here", ref: "chart_title"}), 

        React.createElement("fieldset", null, 
          React.createElement("legend", null, "Chart Type"), 
            React.createElement("label", {for: "chart-type-button"}, "Bar"), 
            React.createElement("input", {type: "radio", id: "chart-type-button", name: "chart-type", value: "bar", ref: "chart_type"}), 
            React.createElement("label", {for: "chart-type-button"}, "Line"), 
            React.createElement("input", {type: "radio", id: "chart-type-button", name: "chart-type", value: "line", ref: "chart_type"}), 
            React.createElement("label", {for: "chart-type-button"}, "Pie"), 
            React.createElement("input", {type: "radio", id: "chart-type-button", name: "chart-type", value: "pie", ref: "chart_type"})
        ), 

        React.createElement("fieldset", null, 
          React.createElement("legend", null, "Bar Chart Subtypes"), 
            React.createElement("label", {for: "chart-subtype-button"}, "Horizontal"), 
            React.createElement("input", {type: "radio", id: "chart-subtype-button", name: "chart-subtype-1", value: "horizontal", ref: "chart_subtype"}), 
            React.createElement("label", {for: "chart-subtype-button"}, "Stacked"), 
            React.createElement("input", {type: "radio", id: "chart-subtype-button", name: "chart-subtype-2", value: "stacked", ref: "chart_subtype"})
        ), 

        React.createElement("fieldset", null, 
          React.createElement("legend", null, "Data Format"), 
            React.createElement("label", {for: "chart-labels-format"}, "Chart Labels"), 
              React.createElement("select", {id: "data-labels-format", name: "data-labels-format"}, 
                React.createElement("option", null, "Number"), 
                React.createElement("option", null, "Percent (%)"), 
                React.createElement("option", null, "Currency ($)"), 
                React.createElement("option", null, "Year"), 
                React.createElement("option", null, "Month"), 
                React.createElement("option", null, "U.S. State"), 
                React.createElement("option", null, "None")
              ), 
            React.createElement("label", {for: "chart-series-format"}, "Chart Series"), 
              React.createElement("select", {id: "data-series-format", name: "data-series-format"}, 
                React.createElement("option", null, "Number"), 
                React.createElement("option", null, "Percent (%)"), 
                React.createElement("option", null, "Currency ($)"), 
                React.createElement("option", null, "Year"), 
                React.createElement("option", null, "Month"), 
                React.createElement("option", null, "U.S. State"), 
                React.createElement("option", null, "None")
              )
        ), 

        React.createElement("label", {for: "chart-data"}, "Chart Data - Paste from Excel"), 
        React.createElement("textarea", {id: "chart-data", placeholder: "chart data here", ref: "chart_data"}), 

        React.createElement("input", {type: "submit", value: "Post"})
      )
    );
  }
});

React.render(
  React.createElement(ChartBox, {url: "charts.json", pollInterval: 120000}),
  document.getElementById('content')
);
