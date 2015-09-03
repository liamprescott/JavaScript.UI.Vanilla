// Declare global js object
if(!this.js) { this.js = {}; }

//ui.toggle
( function (namespace)
  {
    'use strict';

    namespace.toggleclass = function (data){

      /**
       @description Initialisation method
       @return {function} - The 'removeClick' function returned from js.util.events.addClick()
       */
      var init = function () {
        // Escape if no trigger
        if (!data.trigger) { return false; }
        // Assign click handler
        return js.util.events.addClick({
          target: data.trigger,
          addClickListener: true,
          endHandler : toggleClassname,
          endArguments: [data]
        });
      };

      /**
       @description Click handler method
       @param {Event Object} e - Originator event object
       @param {Object} data - Instance data object with the following props:
                              data.trigger {Element} - DOM Element trigger
                              data.target {NodeList} - NodeList of DOM Element targets
                              data.cssClassToggle {String} - Classname to add to each target
       @return {Object} data - Instance data object
       */
      var toggleClassname = function (e, data){
        if (data && data.target) {
          data.target.classList.toggle(data.cssClassToggle); // Toggle classname
          return data;
        } else { return false; }
      };

      // Run initialisation
      init();

      var that = {};
      return that;
    };
  }
)(this.js);


/*
 ----------------------------------------------------------------
 * Initialisation example
  ----------------------------------------------------------------
 */
 document.addEventListener('DOMContentLoaded', function ()
 {
  var toggle = js.toggleclass({
    name: "Simple toggle example",
    trigger:document.querySelector(".js-toggleclass-trigger"),
    target:document.querySelector(".js-toggleclass-target"),
    cssClassToggle:"is-open"
  });
 });
