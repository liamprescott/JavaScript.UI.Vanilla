
// Declare global js object
if (!this.js) { this.js = {}; }

//util.events.vanilla
( function (namespace)
  {
    'use strict';

    if (!namespace.util) { namespace.util = {}; }

    namespace.util.events = (function () {
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
      // Return object
          that = {};

      /**
       * @description Configure pointer event names for older versions of IE
       */
      function configurePointerEvents () {
				if (!window.PointerEvent) {
					event_pointer_down = event_ms_pointer_down;
					event_pointer_up = event_ms_pointer_up;
				}
        pointerEventsConfigured = true; // Set state flag
			}
      // Event types

      /**
       * @description Public Add click method
       * @param {Object} target - EventTarget DOM node (HTMLElement)
       * @param {Boolean} addClickListener - Indicates whether to add default Mouse click functionality
       * @param {Function} startHandler - 'click' start handler function
       * @param {Array} startArguments - Arguments array for the 'click' start function
       * @param {Function} endHandler - 'click' end handler function
       * @param {Array} endArguments - Arguments array for the 'click' end function
       */
      function addClick (target, addClickListener, startHandler, startArguments, endHandler, endArguments) {
				// If pointer events aren't configured then configure
				if (!pointerEventsConfigured) { configurePointerEvents(); }

        /**
         * @description Start handler
         * @param {Object} e - Event object
         */
				function handleStart (e) {
          // console.log("handleStart : 1");
					// Prevent default action (?Can this can be done when the actual handler method) // e.preventDefault();

					// Remove mouse & start events
          /*jshint validthis: true */
          this.removeEventListener(event_click, handleClick, false);// Remove any mouse click event
					this.removeEventListener(event_touch_start, handleStart, false);// Touch start event
					this.removeEventListener(event_pointer_down, handleStart, false);// Pointer start event

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
					if (startHandler) {
            addEventToArguments(e, startArguments);
					  startHandler.apply(target, startArguments);// Call the start 'click' handler with the supplied arguments
					}
        }

				/**
         * @description End handler
         * @param {Event Object} e - Event object
         */
				function handleEnd (e) {
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
					if (endHandler) { processEnd(e); }
				}

				/**
         * @description Mouse click handler
         * @param {Event Object} e - Event object
         */
				function handleClick (e) {
					if (endHandler) { processEnd(e); } // Call the end 'click' handler (if supplied)
				}

        /**
         * @description Process end of 'click' event sequence
         * @param {Event Object} e - Event object
         */
				function processEnd (e)	{
					if (!endArguments) endArguments = [];

          addEventToArguments(e, endArguments);
				  endHandler.apply(target, endArguments);	// Call the end 'click' handler with the supplied arguments
				}

				// Add event handlers
				//if (target.addEventListener) {
					target.addEventListener(event_touch_start, handleStart, false);
					target.addEventListener(event_pointer_down, handleStart, false);

					if (addClickListener) { target.addEventListener(event_click, handleClick, false); }
				//}	else if (target.attachEvent) { // ie < 9
				//	target.attachEvent(event_on_click, handleClick);
				//}
  		}

      /**
       * @description Utility method for adding the event object into an array of arguments
       * @param {Event Object} e - Event object
       * @param {Array} args - Array of handler arguments that will be passed to an .apply() call
       */
       function addEventToArguments (e, args)
       {
         // console.log("event types: e.type = " + e.type + " // arg[0].type = " + endArguments[0].type);
         // Add event object into the arguments array so that it is usable in the handler
         if (args.length > 0 && e.type === args[0].type) {
           args[0] = e; // Replace first argument in array if already an Event object of this type there
         } else { args.unshift(e); } // Push event object into the supplied arguments array
         return args;
       }


      // Assign public methods and return
      that.addClick = addClick;

      // Return that
      return that;
    })();

  }
)(this.js);
