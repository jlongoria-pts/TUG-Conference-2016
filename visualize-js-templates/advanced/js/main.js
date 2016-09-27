var React = require('react');
var ReactDOM = require('react-dom');
var Jasper = require('./modules.js');
var Component = require('./components.js');

/*
  Fill this array with the paths to your reports as defined on JasperServer.
  Currently, ad-hoc views cannot be embedded into a page with Visualize.js.
  For this implementation, only content defined as a 'Report' on JasperServer
  can be embedded into your page.
*/
const reportURIs = ["/path/to/report/myFirstReportId",
                   "/path/to/report/mySecondReportId",
                   "/path/to/report/myThirdReportId"];

visualize({
  //plaintext authentication can be replaced with your own SSO-token solution.
      auth: {
          name: "jasperadmin",
          password: "jasperadmin"
        }
    },

    function (v) {
      //Generates each report/input-controls listed in 'reportURIs.'
      reportURIs.forEach( reportURI => {
        Jasper.Report.build(v, reportURI);
        Jasper.InputControl.build(v, reportURI);
      });

    },


    function(err) {
      console.log(err);
    }


);

/* Render module:
    This module defines the methods used in drawing the reports and
    their input-controls to the page. It is prefixed with the 'window'
    qualifier so that it's methods can called from modules.js upon the
    successful return of a report/input-control object.
*/
window.Render = function() {

  //DOM selector containing the pre-defined div in index.html
  const contentWrapper = document.getElementById("my-reports");

  return {

    //Used in Report module to define a unique container each report.
    newContainer: function() {
      let index = Jasper.Report.count();
      let container = document.createElement("div");

      //Element ID of Div that will encompass the report and controls.
      container.id = "report" +"-"+ index;

      contentWrapper.appendChild(container);

      ReactDOM.render(
        <Component.ReportContainer index={index} />,
        document.getElementById(container.id)
      );

      //Element ID that the report itself will render to.
      return "my-report" +"-"+ index;
    },

    //Uses 'this' context from InputControl module to find the appropriate
    //report and append its container with input fields and a submit button.
    controlPanel: function(controls) {
      let index = Jasper.Report.index( this.resource() );

      let container = "my-input-controls" +"-"+ index;

      ReactDOM.render(
        <Component.InputControlPanel
          report={ Jasper.Report.instance( index ) }
          controls={ Jasper.InputControl.instance( index ) }
          index={index}
        />,
        document.getElementById(container)
      );
    }


  };

}();
