/** 
* @jsx React.DOM
*/

/* 
* Child component of ChartBox, parent component of Chart
* Dynamically renders list to display title, author, and charts after form submit
*/
var ChartList = React.createClass({
  render: function() {
    var chartNodes = this.props.data.map(function(chart, index) {
      return (
        <ChartList.Chart key={index}>
          {chart}
        </ChartList.Chart>
      );
    });
    return (
      <div className="chartList">
        {chartNodes}
      </div>
    );
  }
});

/*
* Chart is a subcomponent of ChartList that depends on data passed in from Chartlist (props)
*/
ChartList.Chart = React.createClass({
  componentDidMount: function() {
    var $el = $(this.getDOMNode()), $chart,
        search = $el.find('.cts'),
        cm;
    if (search.length > 0) {
      $chart = $(search);
      ChartistHtml.config.baseClass = 'cts';
      cm = new ChartistHtml.ChartManager($chart); //use ChartistHtml lib to draw charts
      cm.setData();
      cm.render();
    }
    $('h2').hallo({ //h2 is in the DOM within this method, not before it
      editable: true
    });
  },
  render: function() {
    var data = this.props.children;
    data.chart = data.chart || '<p></p>';
    return (
      <div className="chart">
        <h2 className="chartTitle">
          {data.title}
        </h2>
        <h3 className="chartAuthor">
          {data.author}
        </h3>
        <div dangerouslySetInnerHTML={{ __html: data.chart }} />
      </div>
    );
  }
});