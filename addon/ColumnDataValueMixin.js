import Ember from "ember";
import EmberTimerUtils from "ember-timer-utils";
import getEmberId from "./getEmberId";
import hashHasKeys from "./hashHasKeys";

/**
 * A mixin that aliases the value of the attribute given by 'columnData' in 'record' to 'value'.
 *
 * @class EmberColumnData.ColumnDataValueMixin
 * @module ember-column-data
 */
export default Ember.Mixin.create({
  init : function() {
    this._super();
    this.recordDidChange();
    this.registerForValChangeChild();
  },

  /**
   * Column data instance to be used to extract value.
   *
   * @property columnData
   * @type Class
   */
  columnData : null,

  /**
   * Record to extract the value from.
   *
   * @property record
   * @type Class
   */
  record : null,

  listenedColumnChanged : function(changedColumnData, changedValue, oldValue) {
    this.listenedColumnChangedHook(changedColumnData, changedValue, oldValue);
    if(changedColumnData.get("name") === this.get("columnData.name")) {
      var that = this;
      //The delay is added cos destroy on the view of removed record is called before it is actually removed from array
      //TODO : find a better way to do this check
      EmberTimerUtils.addToQue("duplicateCheck-" + getEmberId(this), 100).then(function() {
        if(!that.get("isDestroyed")) {
          that.validateValue(that.get("val"));
        }
      });
    }
  },

  /**
   * Callback callled when the column listened on changes.
   *
   * @method listenedColumnChangedHook
   * @param {ColumnData} changedColumnData ColumnData instance of the changed column.
   * @param {any} changedValue
   * @param {any} oldValue
   */
  listenedColumnChangedHook : function(/*changedColumnData, changedValue, oldValue*/) {
  },

  disableValidation : false,
  validateValue : function(value, validationOverride) {
    var columnData = this.get("columnData"), record = this.get("record"),
        validation = validationOverride || columnData.get("validation");
    if(validation && !this.get("disableValidation")) {
      var validVal = validation.validateValue(value, record);
      if(validVal[0]) {
        record._validation[columnData.name] = 1;
      }
      else {
        delete record._validation[columnData.name];
      }
      this.set("invalid", validVal[0]);
      this.set("invalidReason", !Ember.isEmpty(validVal[1]) && validVal[1]);
    }
    else {
      delete record._validation[columnData.name];
    }
    record.set("validationFailed", hashHasKeys(record._validation));
  },

  /**
   * An alias to the value in attribute. It undergoes validations and the change will be bubbled.
   *
   * @property value
   */
  value : Ember.computed("columnData.key", "view.columnData.key", "disableValidation", "view.disableValidation", {
    get : function() {
      var columnData = this.get("columnData"), record = this.get("record"),
          parentForBubbling = this.get("parentForBubbling"), val;
      if(!record || !columnData) {
        return val;
      }
      record._validation = record._validation || {};

      val = record.get(columnData.get("key"));
      this.validateValue(val);
      if(parentForBubbling && parentForBubbling.bubbleValChange) {
        parentForBubbling.bubbleValChange(columnData, val, null, this); 
      }
      return val;
    },

    set : function(key, val) {
      var columnData = this.get("columnData"), record = this.get("record"),
          parentForBubbling = this.get("parentForBubbling");
      if(!record || !columnData) {
        return val;
      }
      record._validation = record._validation || {};

      if(!record.currentState || (record.currentState && !record.currentState.stateName.match("deleted"))) {
        var oldVal = record.get(columnData.get("key"));
        this.validateValue(val);
        //TODO : find a better way to fix value becoming null when selection changes
        //if(val || !columnData.get("cantBeNull")) {
          record.set(columnData.get("key"), val);
          this.valueChangeHook(val);
          if(parentForBubbling && parentForBubbling.bubbleValChange) {
            parentForBubbling.bubbleValChange(columnData, val, oldVal, this); 
          }
        //}
      }
      return val;
    },
  }),

  /**
   * Callback called when the value changes.
   *
   * @method valueChangeHook
   * @param {any} val
   */
  valueChangeHook : function(/*val*/) {
  },

  prevRecord : null,
  recordDidChange : Ember.observer("record", "view.record", function() {
    var record = this.get("record"), prevRecord = this.get("prevRecord"),
        columnData = this.get("columnData");
    if(prevRecord) {
      Ember.removeObserver(prevRecord, columnData.get("key"), this, "notifyValChange");
    }
    if(record) {
      this.recordChangeHook();
      Ember.addObserver(record, columnData.get("key"), this, "notifyValChange");
      this.set("prevRecord", record);
    }
    else if(prevRecord) {
      this.recordRemovedHook();
    }
    this.notifyPropertyChange("value");
  }),

  /**
   * Callback called when record changes.
   *
   * @method recordChangeHook
   */
  recordChangeHook : function() {
  },

  /**
   * Callback called when record is removed (set to null).
   *
   * @method recordRemovedHook
   */
  recordRemovedHook : function(){
  },

  notifyValChange : function(/*obj, key*/) {
    this.notifyPropertyChange("value");
    this.valueChangeHook(this.get("value"));
  },

  registerForValChangeChild : Ember.observer("columnData", "view.columnData", function() {
    var columnData = this.get("columnData"), parentForBubbling = this.get("parentForBubbling");
    if(columnData && columnData.get("columnListenerEntries")) {
      columnData.get("columnListenerEntries").forEach(function(listenCol) {
        if(parentForBubbling && parentForBubbling.registerForValChange) {
          parentForBubbling.registerForValChange(this, listenCol);
        }
      }, this);
    }
  }),

  unregisterForValChangeChild : function() {
    var columnData = this.get("columnData"), parentForBubbling = this.get("parentForBubbling");
    if(columnData.get("columnListenerEntries")) {
      columnData.get("columnListenerEntries").forEach(function(listenCol) {
        if(parentForBubbling && parentForBubbling.unregisterForValChange) {
          parentForBubbling.unregisterForValChange(this, listenCol);
        }
      }, this);
    }
  },

  /**
   * Parent object with mixin EmberColumnData.ColumnDataChangeCollectorMixin to bubble to.
   *
   * @property parentForBubbling
   * @type Instance
   */
  parentForBubbling : null,

  destroy : function() {
    this._super();
    this.unregisterForValChangeChild();
  },
});
