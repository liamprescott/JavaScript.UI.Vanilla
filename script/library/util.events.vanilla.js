
// Declare global js object
if (!this.js) { this.js = {}; }

//util.events.vanilla
( function (namespace)
  {
    'use strict';

    if (!namespace.util) { namespace.util = {}; }

    namespace.util.events = (function () {
			// Event types
      var event_click = "click",
          event_on_click = "onclick",
          event_on_mousedown = "onmousedown",
          event_on_mouseup = "onmouseup",
          event_pointer_down = "pointerdown",
          event_pointer_up = "pointerup",
          event_ms_pointer_down = "MSPointerDown",
          event_ms_pointer_up = "MSPointerUp",
          event_touch_start = "touchstart",
          event_touch_end = "touchend",
      // State flags
          pointerEventsConfigured = false,
      // Event handler method references
          clickHandler = null,
          startHandler = null,
      // Return object
          that = {};

      /**
       * @description Configure pointer event names for older versions of IE
       */
      var configurePointerEvents = function () {
        if (!window.PointerEvent) {
          event_pointer_down = event_ms_pointer_down;
          event_pointer_up = event_ms_pointer_up;
        }
        pointerEventsConfigured = true; // Set state flag
      };

      /**
       @description Public Add click method
       @param {Object} data - data object with the following props:
                              data.target {Object} - EventTarget DOM node (HTMLElement)
                              data.addClickListener {Boolean} - Indicates whether to add default Mouse click functionality
                              data.startHandler {Function} - 'click' start handler function
                              data.startArguments {Array} - Arguments array for the 'click' start function
                              data.endHandler {Function} - 'click' end handler function
                              data.endArguments {Array} - Arguments array for the 'click' end function
        @return {function} - A 'removeClick' function that allows safe removal of click events
       */
      var addClick = function (data) {
				// If pointer events aren't configured then configure
				if (!pointerEventsConfigured) { configurePointerEvents(); }

        /**
         * @description Start handler
         * @param {Object} e - Event object
         */
        var handleStart = function (e) {
          // console.log("handleStart : 1");
          // Prevent default action (?Can this can be done when the actual handler method) // e.preventDefault();

          // Remove mouse & start events
          /*jshint validthis: true */
          this.removeEventListener(event_click, handleClick, false);// Remove any mouse click event
          this.removeEventListener(event_touch_start, handleStart, false);// Remove Touch start event
          this.removeEventListener(event_pointer_down, handleStart, false);// Remove Pointer start event

          // Add end event listener
          switch (e.type) {
            case event_touch_start:
              this.addEventListener(event_touch_end, handleEnd, false);
              break;
            case event_pointer_down:
              this.addEventListener(event_pointer_up, handleEnd, false);
              break;
          }

          // Call start 'click' handler (If defined)
          if (data.startHandler) {
            addEventToArguments(e, data.startArguments);
            data.startHandler.apply(data.target, data.startArguments);// Call the start 'click' handler with the supplied arguments
          }
        };

        /**
         * @description End handler
         * @param {Event Object} e - Event object
         */
        var handleEnd = function (e) {
          // console.log("handleEnd : ");
          // Prevent default // e.preventDefault();

          /*jshint validthis: true */

          // Toggle event listeners from 'end' to 'start'
          switch (e.type) {
            case event_touch_end:
              //console.log("handleEnd : 'evTouchEnd'");
              this.removeEventListener(event_touch_end, handleEnd, false);
              this.addEventListener(event_touch_start, handleStart, false);
              break;

            case event_pointer_up:
              //console.log("handleEnd : 'evPointerUp'");
              this.removeEventListener(event_pointer_up, handleEnd, false);
              this.addEventListener(event_pointer_down, handleStart, false);
              break;
          }

          // Call the end 'click' handler (if supplied)
          if (data.endHandler) { processEnd(e); }
        };

        /**
         * @description Mouse click handler
         * @param {Event Object} e - Event object
         */
        var handleClick = function (e) {
          if (data.endHandler) { processEnd(e); } // Call the end 'click' handler (if supplied)
        };

        /**
         * @description Process end of 'click' event sequence
         * @param {Event Object} e - Event object
         */
        var processEnd = function (e)	{
          if (!data.endArguments) data.endArguments = [];

          addEventToArguments(e, data.endArguments);
          data.endHandler.apply(data.target, data.endArguments);	// Call the end 'click' handler with the supplied arguments
        };

        /**
         @description Remove event handlers
         @return {Object} - Instance data object
         */
        var removeClick = function () {
          // Escape if pointer events haven't been configured (as this means that no click events have been added)
          if (!pointerEventsConfigured) { return false; }
          // Remove event listeners
          data.target.removeEventListener(event_touch_start, handleStart, false);
          data.target.removeEventListener(event_pointer_down, handleStart, false);
          data.target.removeEventListener(event_click, handleClick, false);
          return data;
        };

				data.target.addEventListener(event_touch_start, handleStart, false);
				data.target.addEventListener(event_pointer_down, handleStart, false);
				if (data.addClickListener) { data.target.addEventListener(event_click, handleClick, false); }

        // Return remove click utility method
        return removeClick;
  		};

      /**
       * @description Utility method for adding the event object into an array of arguments
       * @param {Event Object} e - Event object
       * @param {Array} args - Array of handler arguments that will be passed to an .apply() call
       */
      var addEventToArguments = function (e, args) {
        // console.log("event types: e.type = " + e.type + " // arg[0].type = " + endArguments[0].type);
        // Add event object into the arguments array so that it is usable in the handler
        if (args.length > 0 && e.type === args[0].type) {
          args[0] = e; // Replace first argument in array if already an Event object of this type there
        } else { args.unshift(e); } // Push event object into the supplied arguments array
        return args;
      };

      // Assign public methods and return
      that.addClick = addClick;

      // Return that
      return that;
    })();

  }
)(this.js);
