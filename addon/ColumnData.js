import Ember from "ember";
import Registry from "./Registry";
import ColumnDataValidation from "./validations/ColumnDataValidation";
import ColumnListenerEntry from "./ColumnListenerEntry";
import EmberObjectUtils from "ember-object-utils";

/**
 * Class for meta data for a property on a record.
 *
 * @class EmberColumnData.ColumnData
 */
export default Ember.Object.extend({
  init : function () {
    this._super();
    Registry.store(this.get("name"), "columnData", this);
  },

  /**
   * A name to uniquely identify column data.
   *
   * @property name
   * @type String
   */
  name : "",

  /**
   * Key name of the attribute in the record. If not provided, 'name' is used a key.
   *
   * @property keyName
   * @type String
   */
  keyName : "",

  /**
   * Key of the attribute based on keyName or name if keyName is not provided.
   *
   * @property key
   * @type String
   * @private
   */
  key : Ember.computed("keyName", "name", {
    get : function() {
      return this.get("keyName") || this.get("name");
    },
  }),

  /**
   * Meta data for the validation of the attribute on the record. Passed as an object while creating.
   *
   * @property validation
   * @type Class
   */
  validation : EmberObjectUtils.belongsTo(ColumnDataValidation),

  /**
   * A suitable label for the attribute used in displaying in certain places.
   *
   * @property label
   * @type String
   */
  label : null,

  /**
   * A nested child column data.
   *
   * @property childColumnData
   * @type Class
   * @private
   */
  childColumnData : EmberObjectUtils.belongsTo("EmberColumnData.ColumnData"),

  /**
   * A name for the nesting of a column data.
   *
   * @property childColumnDataName
   * @type String
   */
  childColumnDataName : Ember.computed({
    set : function(key, value) {
      if(value) {
        this.set("childColumnData", Registry.retrieve(value, "columnData"));
      }
      return value;
    },
  }),

  /**
   * A nested child column data group.
   *
   * @property childColumnDataGroup
   * @type Class
   * @private
   */
  childColumnDataGroup : EmberObjectUtils.belongsTo("EmberColumnData.ColumnDataGroup"),

  /**
   * A name for the nesting of a column data group.
   *
   * @property childColumnDataGroupName
   * @type String
   * @private
   */
  childColumnDataGroupName : Ember.computed({
    set : function(key, value) {
      if(value) {
        this.set("childColumnDataGroup", Registry.retrieve(value, "columnDataGroup"));
      }
      return value;
    },
  }),

  columnListenerEntries : EmberObjectUtils.hasMany(ColumnListenerEntry),
});
