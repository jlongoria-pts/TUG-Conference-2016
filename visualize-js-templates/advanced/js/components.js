var React = require('react');

//Helper function
var getElement = function(elementId) {
  return document.getElementById(elementId);
}

var InputControlField = React.createClass({
  //Defines HTML input-form fields based on their type as returned by JasperServer.
  buildControl: function(control) {
    let formType = {
      "singleValueText":   "text",
      "singleValueNumber": "number",
      "singleValueDate":   "date",
      "bool":              "checkbox"
    };

    //if value-based control...
    if( formType[control.type] ) {
      return (
        <input
          id={ this.elementId() }
          type={formType[control.type]}
          defaultValue={control.state.value}
        >
        </input>
      );
    }
    //if select-based control...
    else {
      let selected = "";
      let options = control.state.options;

      let values = options.map(option => {
        if(option.selected) { selected = option.value; }

        return (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        );
      });

      //onChange property is only relevant to cascading input controls.
      return (
        <select
          id={ this.elementId() }
          defaultValue={selected}
          onChange={this.props.update}
        >
          {values}
        </select>
      );
    }

  },
  //Returns the DOM element ID for each input field.
  elementId: function() {
    return this.props.control.id + this.props.index;
  },
  componentDidMount: function() {
    console.log("Success: InputControlField");
  },
  render: function() {

    let inputField = this.buildControl( this.props.control );

    return (
      <div>
        <label htmlFor={ this.elementId() }>
          {this.props.control.label}:
        </label>

        {inputField}
      </div>
    );
  }

});

var InputControlSubmit = React.createClass({
  //Returns a unique element ID for each submit button.
  elementId: function() {
    return "submit-button" +"-"+ this.props.index;
  },
  //Watches for a click, then runs the report object with the new parameters.
  componentDidMount: function() {
    let button = getElement( this.elementId() );

    button.addEventListener("click", () => {
      let report     = this.props.report;
      let parameters = this.props.getParameters();

      report.params(parameters).run();
    });
  },
  //Defines the button element and it's ID.
  render: function() {
    return (
      <button id={ this.elementId() }>
        Submit
      </button>
    );
  }
});

/*
  module.exports contains the primary components used in main.js.
  These components call the subcomponents defined above to create
  the user interface to the report object delivered by JasperServer.
*/
module.exports = {
  InputControlPanel: React.createClass({
    //Starts tracking the state of the input fields in the UI.
    getInitialState: function() {
      return {controls: this.props.controls.data()};
    },
    //Grabs the parameters' values from the input fields.
    getParameters: function() {
      let parameters = {};
      let controls = this.state.controls;

      controls.forEach(control => {
        let selector = getElement(control.id + this.props.index);

        if( control.type == "bool" )
          parameters[control.id] = [selector.checked];
        else
          parameters[control.id] = [selector.value];
      });

      return parameters;
    },
    //Updates the values of dependent inputs in cascading input controls.
    handleChange: function() {
      let controls = this.props.controls;
      let parameters = this.getParameters();

      controls.params(parameters).run( updatedControls =>
        this.setState( {controls: updatedControls} )
      );
    },
    //Draws the input fields and submit button to the screen.
    render: function() {
      let controls = this.state.controls;

      let inputFields = controls.map( control => {
        return (
          <div key={control.label}>
            <InputControlField
              control={control}
              index={this.props.index}
              update={this.handleChange}
            />
          </div>
        );
      });

      return (
        <div className="input-controls">

          {inputFields}

          <InputControlSubmit
            report={this.props.report}
            controls={this.state.controls}
            index={this.props.index}
            getParameters={this.getParameters}
          />
        </div>
      );
    }
  }),

  ReportContainer: React.createClass({
    //Creates the DOM nodes necessary for the report and controls to render.
    render: function() {
      let index = this.props.index;

      let reportId = "my-report" +"-"+ index;
      let inputsId = "my-input-controls" +"-"+ index;

      return (
        <div className="report-wrapper">
          <div id={reportId}></div>
          <div id={inputsId}></div>
        </div>
      );
    }
  })


};
