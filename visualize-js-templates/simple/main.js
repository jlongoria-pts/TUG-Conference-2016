visualize({
  //plaintext authentication can be replaced with your own SSO-token solution.
      auth: {
          name: "jasperadmin",
          password: "jasperadmin"
        }
    },

    function (v) {

      //Visualize.js API requires a report URI and a DOM element to
      //embed a report from your JasperServer to the page.
      var report = v.report({

        //Right-click on a report in JasperServer and copy the text under 'Path.'
        //Replace the string below with the path to your report.
        resource: "/path/to/report/myReportId",
        container: "#my-report-container",

        scale: "container",
        success: function(data) { console.log("success!", data); },
        error: function(err) { console.log("error!", err); }
      });

    },


    function(err) {
      console.log(err);
    }


);
