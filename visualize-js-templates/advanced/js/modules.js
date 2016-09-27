/* Module class:
    This is a class that provides generic methods used by both the
    Report and InputControl modules. The B.I. components produced by
    these modules can then be easily tracked and referenced throughout
    the script when rendering the them to the screen.
 */
var Module = function(objects, build) {
  this.interface = {
    build: build,
    count: function() { return objects.length; },
    instance: function(i) { return objects[i]; },
    index: function(d) {
      let index = -1;

      objects.forEach( object => {
        if (object.resource() == d)
          index = objects.indexOf(object);
      });

      return index;
    }
  };
}

/*
  Each of the B.I. component modules in modules.exports defines a
  storage array for holding the instances of the generated components
  as well as a function for building it given a particular report URI.
  This function completes the interface defined in the generic Module class.
*/
module.exports = {

/* Reports module */
Report: function() {

  let objects = [];

  let module = new Module(objects, function(v, resource) {

      let index = objects.length;

      let container = "#" + Render.newContainer();

      let properties = {
        resource: resource,
        container: container,
        scale: "container",
        success: function(data) { console.log(data); },
        error: function(err) { console.log(err); }
      };

      objects.push( v.report(properties) );
  });

  return module.interface;
}(),



/* Input Controls module */
InputControl: function() {

  let objects = [];

  let module = new Module(objects, function(v, resource) {
      let properties = {
        resource: resource,
        success: Render.controlPanel, //function(data) { console.log(data); },
        error: function(err) { console.log(err); }
      };

      objects.push( v.inputControls(properties) );
  });

  return module.interface;
}(),

};
