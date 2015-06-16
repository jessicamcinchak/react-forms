var Chart = React.createClass({
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
      <div className="chart">
        <h2 className="chartAuthor">
          {data.author}
        </h2>
        <div dangerouslySetInnerHTML={{ __html: data.chart }} />
      </div>
    );
  }
});

var ChartBox = React.createClass({
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
      <div className="chartBox">
        <h1>Charts</h1>
        <ChartList data={this.state.data} />
        <ChartForm onChartSubmit={this.handleChartSubmit} />
      </div>
    );
  }
});

var ChartList = React.createClass({
  render: function() {
    var chartNodes = this.props.data.map(function(chart, index) {
      return (
        <Chart key={index}>
          {chart}
        </Chart>
      );
    });
    return (
      <div className="chartList">
        {chartNodes}
      </div>
    );
  }
});

var FormSelect = React.createClass({
  render: function() {
    var optionsList = ['Number', 'Percent (%)', 'Currency ($)', 'Year', 'Month', 'U.S. State', 'None'].map(function(value) {
      return (
        <option>
          {value}
        </option>
      );
    });
    return (
      <select id={this.props.id} name={this.props.name} value={this.value} ref={this.props.id}>
        {optionsList}
      </select>
    );
  }
});

var Input = React.createClass({
  render: function() {
    return (
      <div class="chartForm__input">
        <label for={this.props.id}>
          {this.props['data-text']}
        </label>
        <input type={this.props.type} id={this.props.id} placeholder={this.props.placeholder} ref={this.props.id} />
      </div>
    );
  }
});

var RadioButton = React.createClass({
  render: function() {
    var radioButtonList = [ 'bar', 'line', 'pie' ].map(function(value) {
      // return (
      //   {value}
      // );
    });
    return (
      <input type="radio" id={this.props.id} name={this.props.name} value={this.value} ref={this.props.id}>
        {radioButtonList}
      </input>
    );
  }
});

// var CheckBox = React.createClass({
//   render: function() {
//       return (
//         <CheckBox 
//           type="checkbox"
//           name="subtypes"
//           value={this.state.value}
//           ref="subtypesGroup"
//           onChange={this.handleChange}
//         >
//       );
//   },
//   handleChange: function() {
//     var selectedSubtypes = this.refs.subtypesGroup.getCheckedValues();
//   }
// });

var formatters = {
  'chart_data': function(data) {
    return data.split('\n').map(function(x) { return x.split('\t'); });
  }
};

var ChartForm = React.createClass({
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
  render: function() {
    return (
      <form className="chartForm" onSubmit={this.handleSubmit}>

        <Input id="author" type="text" placeholder="author name" data-text="Author" ref="author" />
        <Input id="chart_title" type="text" placeholder="chart title" data-text="Chart Title" />

        <fieldset>
          <legend>Chart Type</legend>
          <div>
            <RadioButton id="chart-type-button" name="chart-type" value="bar" ref="chart_type" />
            <label for="chart-type-button">Bar</label>  

            <RadioButton id="chart-type-button" name="chart-type" value="line" ref="chart_type" />
            <label for="chart-type-button">Line</label>

            <RadioButton id="chart-type-button" name="chart-type" value="pie" ref="chart_type" />
            <label for="chart-type-button">Pie</label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Bar Chart Subtypes</legend>
            <input type="checkbox" id="chart-subtype-button" name="chart-subtype-1" value="horizontal" ref="chart_subtype_1" />
            <label for="chart-subtype-button">Horizontal</label>

            <input type="checkbox" id="chart-subtype-button" name="chart-subtype-2" value="stacked" ref="chart_subtype_2" />
            <label for="chart-subtype-button">Stacked</label>

        </fieldset>

        <fieldset>
          <legend>Data Format</legend>
            <p><label for="data-labels-format">Chart Labels</label>
            <FormSelect id="data-labels-format" name="data-labels-format" ref="data_labels_format" /></p>
            <p><label for="data-series-format">Chart Series</label>
            <FormSelect id="data-series-format" name="data-series-format" ref="data_series_format" /></p>
        </fieldset>

        <label for="chart-data">Chart Data - Paste from Excel</label>
        <textarea id="chart-data" placeholder="chart data here" ref="chart_data" />

        <input type="submit" value="Post" />
      </form>
    );
  }
});

React.render(
  <ChartBox url="charts.json" pollInterval={120000} />,
  document.getElementById('content')
);
