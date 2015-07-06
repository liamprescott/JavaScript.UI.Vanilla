// Declare global js object
if(!this.js) { this.js = {}; }

//ui.toggle
( function (namespace)
  {
    'use strict';

    namespace.toggle = function (data){

      var init = function () {
        // Assign click handler
        js.util.events.addClick({
          target: data.trigger,
          addClickListener: true,
          endHandler : toggleTarget,
          endArguments: [data]
        });
      };

      /**
       @description Click handler method
       @param {Event Object} e - Originator event object
       @param {Object} data - Instance data object
       @return {Object} data - Instance data object
       */
      var toggleTarget = function (e, data){
        data.target.classList.toggle(data.cssClassToggle);
        return data;
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
  var toggle = js.toggle({
    name: "Simple toggle example",
    trigger:document.querySelector(".js-toggle-trigger"),
    target:document.querySelector(".js-toggle-target"),
    cssClassToggle:"is-open"
  });
 });
