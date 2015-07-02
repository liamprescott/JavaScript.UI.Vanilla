
// Declare global js
if (!this.js) { this.js = {}; }

//ui.modal
( function (namespace) {
  'use strict';

  namespace.modal = function (data)
  {
    var eventUtil = js.util.events;

    /**
     @description Open / close a modal window
     @param {Event} e - Originator Event Object
     @param {Object} data - Module data object
     @param {isOpen} Boolean - Indicates if the display call is open or close
     */
    var display = function (e, data, isOpen) {
      // Find target
      var target,
          trigger = (e.target)? e.currentTarget : e.srcElement; // IE 8 nastiness!!

      if (isOpen) {
        target = data.currentDisplay = document.getElementById(trigger.getAttribute(data.dataAttributeTargetID));
      } else {
        target = data.currentDisplay;
      }

      // Find all close links
      var closeLinks = target.querySelectorAll(data.qsClose),
          currentlyOpen = target.classList.contains(data.cssClassOpen),
          l = closeLinks.length,
          i;

      // Attach close handler
      if (isOpen && !currentlyOpen) { // If open request and !currently open
        data.listenerRemovalMethods = []; // Create a new array
        for (i=0; i<l; i++){
          data.listenerRemovalMethods.push (
            eventUtil.addClick({
              target: closeLinks[i],
              addClickListener: true,
              startHandler : null,
              startArguments: null,
              endHandler: display,
              endArguments: [data, false]
            })
          );
        }
      } else if (!isOpen && currentlyOpen) { // If close request and currently open clear event listeners
        data.listenerRemovalMethods.forEach(function(removeMethod, index, array){
          removeMethod();
        });
      }

      // Toggle open class on modal
      if (isOpen){
        target.classList.add(data.cssClassOpen);
      } else {
        target.classList.remove(data.cssClassOpen);
      }
    };

    /**
     @description initialisation
     */
    var init = function ()
    {
      var l = data.triggers.length,
          i;
      // Assign click handler to links
      for (i=0; i<l; i++)
      {
        // Don't need a closure as don't need to capture i!
        eventUtil.addClick({
          target: data.triggers[i],
          addClickListener: true,
          startHandler: null,
          startArguments: null,
          endHandler: display,
          endArguments: [data, true]
        });
      }
    };

    // Create return object
    var that = {};
    // Run initialisation
    init();
    // Return object
    return that;
  };

})(this.js);



/*
 ----------------------------------------------------------------
 * Initialisation example
  ----------------------------------------------------------------
 */
var props_modal = {
  triggers : document.querySelectorAll('.modal-trigger'),
  name : 'Modal Popup Example 1',
  // QuerySelector / QuerySelectorAll targeting strings
  qsClose: '.js-modal__close',
  // Classnames
  cssClassOpen: "is-open",
  // DataAttributes
  dataAttributeTargetID : 'data-target-id',
  // Runtime properties
  currentDisplay : null,
  listenerRemovalMethods : null
};

if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', function ()
  {
    var modal = js.modal(props_modal);
  });
}
else if (document.attachEvent) {
  document.attachEvent("onreadystatechange", function () { var modal = js.modal(props_modal); });
}
