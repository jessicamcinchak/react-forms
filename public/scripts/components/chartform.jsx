/** 
* @jsx React.DOM
*/

var ChartForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var key, component, value, obj = {};
    for (key in this.refs) {
      component = this.refs[key];
      value = (component.state != null) ? component.state.value : undefined;
      obj[key] = value;
      React.findDOMNode(component).value = '';
    }
    console.log(obj);
    // this.props.onChartSubmit(obj);
  },
  render: function() {
    return (
      <form className="chartForm" onSubmit={this.handleSubmit}>

        <ChartForm.Input id="author" type="text" placeholder="author name" data-text="Author" ref="author" />
        <ChartForm.Input id="title" type="text" placeholder="chart title" data-text="Chart Title" ref="title" />

        <fieldset>
          <legend>Chart Type</legend>
          <ChartForm.RadioGroup values="Bar,Line,Pie" id="chart-type-button" name="chart-type" ref="chart_type" />
        </fieldset>

        <fieldset>
          <legend>Bar Chart Subtypes</legend>
          <ChartForm.CheckboxGroup values="Horizontal,Stacked" id="chart-subtype-button" name="chart-subtype" ref="chart_subtypes"/>
        </fieldset>

        <fieldset>
          <legend>Data Format</legend>
          <ChartForm.DropdownSelect values="---,Year,Month,U.S. State" data-text="Chart Labels" id="data-labels-format" name="data-labels-format" ref="data_labels_format" />
          <ChartForm.DropdownSelect values="---,Number,Percent (%),Currency ($)" data-text="Chart Series" id="data-series-format" name="data-series-format" ref="data_series_format" />
        </fieldset>

        <ChartForm.CsvArea id="chart-data" placeholder="chart data here" data-text="Chart Data - Paste from Excel" ref="chart_data" />

        <input type="submit" value="Post" />

      </form>
    );
  }
});

ChartForm.Input = React.createClass({
  getInitialState: function() {
    return { value: '' };
  },
  onChange: function(e) {
    this.setState({ value: e.target.value });
    console.log(this.state.value);
  },
  render: function() {
    return (
      <div>
        <label for={this.props.id}>
          {this.props['data-text']}
        </label>
        <input onChange={this.onChange} type={this.props.type} id={this.props.id} placeholder={this.props.placeholder} />
      </div>
    );
  } 
});

ChartForm.RadioGroup = React.createClass({
  getInitialState: function() {
    return { value: '' };
  },
  onChange: function(e) {
    this.setState({ value: e.target.value });
  },
  render: function() {
    var id = this.props.id,
    self = this,
    list = this.props.values.split(',').map(function(value) {
      return (
        <div>
          <label>{value}</label>
          <input onChange={self.onChange} type="radio" id={id} name={id} value={value} />
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

ChartForm.CheckboxGroup = React.createClass({
  getInitialState: function() {
    return { value: [] };
  },
  onChange: function(e) {
    var value = e.target.value;
    if(this.state.value.indexOf(value) === -1) { 
      this.state.value.push(value); 
    } else {
      this.state.value.splice((this.state.value.indexOf(value)), 1);
    }
  },
  render: function() {
    var id = this.props.id,
      self = this,
      list = this.props.values.split(',').map(function(value) {
      return (
        <div>
          <label>{value}</label>
          <input onChange={self.onChange} type="checkbox" id={id} name={id} value={value} />
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

ChartForm.DropdownSelect = React.createClass({
  getInitialState: function() {
    return { value: '' };
  },
  onChange: function(e) {
    this.setState({ value: e.target.value });
  },
  render: function() {
    var id = this.props.id,
        self = this, 
        list = this.props.values.split(',').map(function(value) {
      return (
        <option>
          {value}
        </option>
      );
    });
    return (
      <div>
        <label for={this.props.id}>{this.props['data-text']}</label>
        <select onChange={self.onChange} id={this.props.id} name={this.props.name} value={this.value}>
          {list}
        </select>
      </div>
    );
  }
});

ChartForm.CsvArea = React.createClass({
  getInitialState: function() {
    return { value: '' };
  },
  onChange: function(e) {
    this.setState({ value: e.target.value });
    console.log(this.state.value);
  },
  render: function() {
    return (
      <div>
        <label for={this.props.id}>
          {this.props['data-text']}
        </label>
        <textarea onChange={this.onChange} id={this.props.id} placeholder={this.props.placeholder} />
      </div>
    );
  }
});

var formatters = {
  'chart-data': function(data) {
    return data.split('\n').map(function(x) { return x.split('\t'); });
  }
};