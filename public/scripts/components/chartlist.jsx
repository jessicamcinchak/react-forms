/** 
* @jsx React.DOM
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

ChartList.Chart = React.createClass({
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