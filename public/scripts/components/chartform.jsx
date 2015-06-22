/** 
* @jsx React.DOM
*/

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

        <ChartForm.Input id="author" type="text" placeholder="author name" data-text="Author" ref="author" />
        <ChartForm.Input id="chart_title" type="text" placeholder="chart title" data-text="Chart Title" ref="chart_title" />

        <fieldset>
          <legend>Chart Type</legend>
      { /* <ChartForm.RadioGroup id="chart-type-button" name="chart-type" values="['bar','line', 'pie']" ref="chart_type" /> */ }
            <div>
              <ChartForm.RadioButton id="chart-type-button" name="chart-type" value="bar" ref="chart_type" />
              <label for="chart-type-button">Bar</label>
              
              <ChartForm.RadioButton id="chart-type-button" name="chart-type" value="line" ref="chart_type" />
              <label for="chart-type-button">Line</label>
              
              <ChartForm.RadioButton id="chart-type-button" name="chart-type" value="pie" ref="chart_type" />
              <label for="chart-type-button">Pie</label>
            </div>
        </fieldset>

        <fieldset>
          <legend>Bar Chart Subtypes</legend>
            <div>
              <ChartForm.CheckBox values="horizontal,stacked" id="chart-subtype-button" ref="chart_subtypes"/>
            </div>
        </fieldset>

        <fieldset>
          <legend>Data Format</legend>
            <p><label for="data-labels-format">Chart Labels</label>
            <ChartForm.SelectDropdown id="data-labels-format" name="data-labels-format" ref="data_labels_format" /></p>
            <p><label for="data-series-format">Chart Series</label>
            <ChartForm.SelectDropdown id="data-series-format" name="data-series-format" ref="data_series_format" /></p>
        </fieldset>

        <label for="chart-data">Chart Data - Paste from Excel</label>
        <textarea id="chart-data" placeholder="chart data here" ref="chart_data" />

        <input type="submit" value="Post" />
      </form>
    );
  }
});

ChartForm.Input = React.createClass({
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

ChartForm.RadioButton = React.createClass({
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

ChartForm.CheckBox = React.createClass({
  render: function() {
    var id = this.props.id,
      list = this.props.values.split(',').map(function(value) {
      return (
        <div>
          <label>{value}</label>
          <input type="checkbox" name={id} id={id} value={value}/>
        </div>
      );
    });
    return (
      <div>
        {list}
      </div>
    );
  }
});

ChartForm.SelectDropdown = React.createClass({
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

var formatters = {
  'chart_data': function(data) {
    return data.split('\n').map(function(x) { return x.split('\t'); });
  }
};