
// require("babel-core/register");
React = require("react");
ReactDOM = require("react-dom");
var request = require("superagent");

var Button = require('react-bootstrap/lib/Button');
var ButtonInput = require('react-bootstrap/lib/ButtonInput');
var ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
var Panel = require('react-bootstrap/lib/Panel');
var Input = require('react-bootstrap/lib/Input');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');

var ChartPanel = React.createClass({

  getInitialState() {
    this.data = new google.visualization.DataTable();
    this.data.addColumn(
      this.props.column1_type,
      this.props.column1_label);
    this.data.addColumn(
      this.props.column2_type,
      this.props.column2_label);
    this.options = {
      title: this.props.title,
      width: this.width,
      height: this.props.height,
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    return {
      comment: 'Chart placeholder'
    };
  },

  componentDidMount: function () {
    this.width = this.refs.panel.offsetWidth;
  },

  setData(rows) {
    this.data.addRows(rows);
  },

  drawChart(rows) {
    this.setData(rows);
    var chart = new google.visualization.LineChart(this.refs.panel);
    chart.draw(this.data, this.options);
  },

  render() {
    return (
      <div ref='panel' border="1"> {this.options['title']} </div>
    );
  }
});

var DateInput = React.createClass({

  getInitialState() {
    return {
      value: '01/1962'
    };
  },

  validationState() {
    return 'success';
  },

  handleChange() {
    this.setState({
      value: this.refs.input.getValue()
    });
  },

  render() {
    return (
      <Input
        type="text"
        value={this.state.value}
        placeholder="01/1962"
        label={this.props.label}
        help={this.props.help}
        bsStyle={this.validationState()}
        bsSize="small"
        hasFeedback
        ref="input"
        groupClassName="group-class"
        labelClassName="label-class"
        onChange={this.handleChange} />
    );
  }
});


var Filter = React.createClass({

  handleClick() {
    if (this.props.onClick != null) {
      this.props.onClick();
    }
  },

  render() {
    return (
      <Panel header="Filter" bsStyle="primary">
        <Row>
          <Col xs={3}>
            <DateInput
              label="From date"
              name="from_date" />
          </Col>
          <Col xs={3}>
            <DateInput
              label="To date"
              name="to_date" />
          </Col>
          <Col xs={3}>
            <Input type="select"
                 bsStyle="success"
                 bsSize="small"
                 label="Parameter"
                 placeholder="select">
              <option value="temperature">Temperature, C</option>
              <option value="wind_speed">Wind speed, m/s</option>
            </Input>
          </Col>
          <Col xs={3}>
            <ButtonInput type="submit" onClick={this.handleClick}>Show</ButtonInput>
          </Col>
        </Row>
      </Panel>
    );}
});

var DataPanel = React.createClass({

  handleData(error, query_result) {
    if (error) {
      console.error(error);
    }
    rows = query_result.body
    this.refs.chart.drawChart(
      rows.map(function(value) {
        return [new Date(value[0]), value[1]];
      }));
  },

  executeFilter() {
    request('GET', '/icoads/temperature')
      .accept('application/json')
      .query({from_date: '1662-01-01'})
      .query({to_date: '1661-02-01'})
      .end(this.handleData);
  },

  render() {
    return (
      <Panel>
        <Filter onClick={this.executeFilter}/>
        <ChartPanel title="Meteo chart"
          ref="chart"
          height="400"
          column1_type="datetime"
          column1_label="Time"
          column2_type="number"
          column2_label="Value"/>
      </Panel>
    );}
});

App = React.createClass({
  render() {
    return (
      <Panel>
        <Row>
          <Col xs={6}>
            <DataPanel />
          </Col>
          <Col xs={6}>
            <DataPanel />
          </Col>
        </Row>
      </Panel>
    );}
});

