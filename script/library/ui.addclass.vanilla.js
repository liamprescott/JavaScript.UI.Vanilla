// Declare glovbal js object
if(!this.js) { this.js = {}; }

//ui.addclass
( function (namespace)
  {
    'use strict';

    namespace.addclass = function (data)
    {
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
          endHandler: addClassname,
          endArguments: [data]
        });
      };

      /**
        @description Click handler method
        @param {Event Object} e - Originator event object
        @param {Object} data - Instance data object with the following props:
                               data.trigger {Element} - DOM Element trigger
                               data.targets {NodeList} - NodeList of DOM Element targets
                               data.cssClassAdd {String} - Classname to add to each target
                               data.cssClassesRemove {Array} - An array of classname strings to remove from the target when class added
        @return {Object} data - Instance data object
        */
      var addClassname = function (e, data){
        if (data && data.targets) {
          var l = data.targets.length,
              i;
          for (i=l-1; i>=0; i--) {
            var t = data.targets[i]; // Get target
            if (data.cssClassesRemove) { // Remove additional associated classes
              data.cssClassesRemove.forEach(function (classname, index, classes){
                t.classList.remove(classname);
              });
            }
            t.classList.add(data.cssClassAdd); // Add classname
          }
          return data;
        } else { return false; }
      };

      // Run initialisation
      init();

      var that = that;
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
  var addClass = js.addclass({
    name: "Simple add class example which removes some additional classes at the same time",
    trigger:document.querySelector(".js-addclass-trigger"),
    targets:document.querySelectorAll(".js-addclass-target"),
    cssClassAdd:"added-class",
    cssClassesRemove: ["is-red", "is-blue", "is-another-classname-to-remove-when-adding"]
  });
 });
