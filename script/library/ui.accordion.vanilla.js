// Declare global js object
if (!this.js) { this.js = {}; }



// ui.accordion
( function(namespace) {
    'use strict';

    namespace.accordion = function (data) {
      // Initialisation
      var init = function () {
        //Assign event handler
        var target = data.module,
            items = data.items = target.querySelectorAll(data.qsItem), // NodeList
            links = data.itemLinks = [],
            qsTrigger = data.qsItemTrigger,
            eventUtil = js.util.events;

        // Find all items within each state, store and assign click handler
        var l = items.length,
            i;

        for (i=0; i<l; i++) {
          var item = items[i]; // HTMLElement
          // Closure call to capture value of i for event handler
          (function(index) {
            var itemLinks = links[i] = item.querySelectorAll(qsTrigger),
                a,
                b = itemLinks.length;
            for (a = 0; a < b; a++){
              eventUtil.addClick({
                  target: itemLinks[a],
                  addClickListener: true,
                  startHandler: null,
                  startArguments: null,
                  endHandler: handleChangeState,
                  endArguments: [data, item, i]
                });
            }
          })(i);
        }

        // Set initial state
        setInitialState(data);
      };


      // Event Handlers
      /**
       @param {Event} e - Originator Event object
       @param {Object} data - Module data object
       @param {HTMLElement} item - Accordion state / item that click relates to
       @param {Number} id - Accordion state / item Id
       */
      var handleChangeState = function (e, data, item, id) {
        updateState(data, id, !item.classList.contains(data.cssClassItemVisible));
      };

      /**
       @param {Object} data - Module data object
       @param {Number} id - Target accordion state / item Id
       @param {Boolean} show - Whether to show or hide the target state / item
       */
      var updateState = function (data, id, show) {
        // Validate Id
        if (id >= 0 && id < data.items.length) {
          // If configured to do so close all other states
          if(data.modeSingular){ closeAllItems(data); }

          // Set state
          setState(data, id, show);
        }
        else { return false; }
      };

      /**
       @description - Set item state
       @param {Object} data - Module data
       @param {Integer} itemId - Item id
       @param {Boolean} show - whether to show or hide item
       */
      var setState = function (data, itemId, show) {
        // Configure item and link
        displayItem(data.items[itemId], show, data.cssClassItemVisible);
        configureLinks(data.itemLinks[itemId], show, data.cssClassTriggerVisible);
      };


      // Utility methods
      /**
       @description - Set initial module state
       @param {Object} data - Module data
       */
      var setInitialState = function (data)
      {
        // Look at data property on module
        // Look at property in data
        // Data trumps property!!
        if (data.initialState) { setState(data, data.initialState, true); }
        else {
          var id = data.module.getAttribute(data.dpInitialStateId);
          if (id) { setState(data, id, true); }
        }
      };

      /**
       @description - Show or hide a specific state
       @param {HTMLElement} item - Target item
       @param {Boolean} show - whether to show or hide item
       @param {String} cssClass - Class name that is added / removed based on state visibility
       */
      var displayItem = function (item, show, cssClass) {
        if (show) {
          item.classList.add(cssClass);
        } else {
          item.classList.remove(cssClass);
        }
      };

      /**
       @description - Configure a collection of links
       @param {NodeList} links - Item's show / hide links
       @param {Boolean} show - whether to show or hide item
       @param {String} cssClass - Class name that is added / removed based on state visibility
       */
      var configureLinks = function (links, show, cssClass) {
        var i,
            l = links.length-1;
        for (i = l; i >= 0; i--) {
          if (show) {
            links[i].classList.add(cssClass);
          } else {
            links[i].classList.remove(cssClass);
          }
        }
      };

      /**
       @description - Close all items / states
       @param {Object} data - Module data object
       */
      var closeAllItems = function (data) {
        var i,
            l = data.items.length-1;
        for (i = l; i >= 0; i--) {
          setState(data, i, false);
        }
      };

      // Create return object
      var that = {};

      // Run initialisation
      init();

      // Return object
      return that;
    };
  }
)(this.js);



/*
 ----------------------------------------------------------------
 * Initialisation example
  ----------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', function()
{
  var accordion = js.accordion({
      name : 'Accordion Example 1', //
      module : document.querySelector('.js-example-acc'), // Module target

      // QuerySelector / QuerySelectorAll targeting strings
      qsItem : '.js-acc__item',
      qsItemTrigger : '.js-acc__link',
      qsItemBody : '.js-acc__body',

      // Classnames
      cssClassItemVisible : "acc__item--is-open",
      cssClassTriggerVisible : "acc__item__link--is-active",

      // Data source properties
      dpInitialStateId : "data-acc-initstateid",

      // Feature configuration
      modeSingular : false,
      initialState : null,

      // Created internally
      items : null,
      itemLinks : null
    }
  );

});
