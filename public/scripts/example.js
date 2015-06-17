'use strict';

var React = require('react');
var RadioGroup = require('react-radio-group');

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

var FormSelect = React.createClass({displayName: "FormSelect",
  render: function() {
    var optionsList = ['Number', 'Percent (%)', 'Currency ($)', 'Year', 'Month', 'U.S. State', 'None'].map(function(value) {
      return (
        React.createElement("option", null, 
          value
        )
      );
    });
    return (
      React.createElement("select", {id: this.props.id, name: this.props.name, value: this.value, ref: this.props.id}, 
        optionsList
      )
    );
  }
});

var Input = React.createClass({displayName: "Input",
  render: function() {
    return (
      React.createElement("div", {class: "chartForm__input"}, 
        React.createElement("label", {for: this.props.id}, 
          this.props['data-text']
        ), 
        React.createElement("input", {type: this.props.type, id: this.props.id, placeholder: this.props.placeholder, ref: this.props.id})
      )
    );
  }
});

var RadioButton = React.createClass({displayName: "RadioButton",
  render: function() {
    var radioButtonList = [ 'bar', 'line', 'pie' ].map(function(value) {
      // return (
      //   {value}
      // );
    });
    return (
      React.createElement("input", {type: "radio", id: this.props.id, name: this.props.name, value: this.value, ref: this.props.id}, 
        radioButtonList
      )
    );
  }
});

var CheckBox = React.createClass({displayName: "CheckBox",
  render: function() {
    var checkBoxList = [ 'horizontal', 'stacked' ].map(function(value) {
      // return (
      //   {value}
      // );
    });
    return (
      React.createElement("input", {type: "checkbox", id: this.props.id, name: this.props.name, value: this.value, ref: this.props.id}, 
        checkBoxList
      )
    );
  }
});

var formatters = {
  'chart_data': function(data) {
    return data.split('\n').map(function(x) { return x.split('\t'); });
  }
};

var ChartForm = React.createClass({displayName: "ChartForm",
  handleSubmit: function(e) {
    e.preventDefault();
    var key, value, obj = {};
    for (key in this.refs) {
      value = this.refs[key];
      // console.log(formatters[key]);
      if (formatters[key]) {
        obj[key] = formatters[key](React.findDOMNode(value).value);
      } else {
        obj[key] = React.findDOMNode(value).value;
      }
      React.findDOMNode(value).value = '';
    }
    console.log(obj);
    this.props.onChartSubmit(obj);
  },
  // getInitialState: function() {
  //   return {
  //     selectedValue: 'bar',
  //   };
  // },
  // handleChange: function(value) {
  //   this.setState({
  //     selectedValue: value,
  //   });
  // },

  render: function() {
    return (
      React.createElement("form", {className: "chartForm", onSubmit: this.handleSubmit}, 

        React.createElement(Input, {id: "author", type: "text", placeholder: "author name", "data-text": "Author", ref: "author"}), 
        React.createElement(Input, {id: "chart_title", type: "text", placeholder: "chart title", "data-text": "Chart Title"}), 

        "// ", React.createElement("fieldset", null, 
        "//   ", React.createElement("legend", null, "Chart Type"), 
        "//     ", React.createElement("div", null, 
        "//       ", React.createElement(RadioButton, {id: "chart-type-button", name: "chart-type", value: "bar", ref: "chart_type"}), 
        "//       ", React.createElement("label", {for: "chart-type-button"}, "Bar"), 
              
        "//       ", React.createElement(RadioButton, {id: "chart-type-button", name: "chart-type", value: "line", ref: "chart_type"}), 
        "//       ", React.createElement("label", {for: "chart-type-button"}, "Line"), 
              
        "//       ", React.createElement(RadioButton, {id: "chart-type-button", name: "chart-type", value: "pie", ref: "chart_type"}), 
        "//       ", React.createElement("label", {for: "chart-type-button"}, "Pie"), 
        "//     "), 
        "// "), 

        React.createElement("fieldset", null, 
          React.createElement("legend", null, "Chart Type"), 
          React.createElement("div", null, 
            React.createElement(RadioGroup, {
              name: "chart-type", 
              selectedValue: this.state.selectedValue, 
              onChange: this.handleChange}, 
              Radio => (
                React.createElement("div", null, 
                  React.createElement("label", null, 
                    React.createElement(Radio, {value: "bar"}), "Bar"
                  ), 
                  React.createElement("label", null, 
                    React.createElement(Radio, {value: "line"}), "Line"
                  ), 
                  React.createElement("label", null, 
                    React.createElement(Radio, {value: "pie"}), "Pie"
                  )
                )
                )
              )
            )
        ), 

        React.createElement("fieldset", null, 
          React.createElement("legend", null, "Bar Chart Subtypes"), 
            React.createElement("div", null, 
              React.createElement(CheckBox, {id: "chart-subtype-button", name: "chart-subtype-1", value: "horizontal", ref: "chart_subtype_1"}), 
              React.createElement("label", {for: "chart-subtype-button"}, "Horizontal"), 

              React.createElement(CheckBox, {id: "chart-subtype-button", name: "chart-subtype-2", value: "stacked", ref: "chart_subtype_2"}), 
              React.createElement("label", {for: "chart-subtype-button"}, "Stacked")
            )
        ), 

        React.createElement("fieldset", null, 
          React.createElement("legend", null, "Data Format"), 
            React.createElement("p", null, React.createElement("label", {for: "data-labels-format"}, "Chart Labels"), 
            React.createElement(FormSelect, {id: "data-labels-format", name: "data-labels-format", ref: "data_labels_format"})), 
            React.createElement("p", null, React.createElement("label", {for: "data-series-format"}, "Chart Series"), 
            React.createElement(FormSelect, {id: "data-series-format", name: "data-series-format", ref: "data_series_format"}))
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

//Set-up for node module react-radio-group, not working require not defined
  // getInitialState: function() {
  //   return {
  //     selectedValue: 'bar',
  //   };
  // },
  // handleChange: function(value) {
  //   this.setState({
  //     selectedValue: value,
  //   });
  // },

        // <fieldset>
        //   <legend>Chart Type</legend>
        //   <div>
        //     <RadioGroup
        //       name="chart-type"
        //       selectedValue={this.state.selectedValue}
        //       onChange={this.handleChange}>
        //       {Radio => (
        //         <div>
        //           <label>
        //             <Radio value="bar" />Bar
        //           </label>
        //           <label>
        //             <Radio value="line" />Line
        //           </label>
        //           <label>
        //             <Radio value="pie" />Pie
        //           </label>
        //         </div>
        //         )}
        //       </RadioGroup>
        //     </div>
        // </fieldset>
