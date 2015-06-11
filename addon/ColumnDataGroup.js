import Ember from "ember";
import Registry from "./Registry";
import ColumnData from "./ColumnData";
import EmberObjectUtils from "ember-object-utils";

/**
 * Class with meta data of a record type.
 *
 * @class EmberColumnData.ColumnDataGroup
 */
export default Ember.Object.extend({
  init : function (){
    this._super();
    this.set("columns", this.get("columns") || []);
    Registry.store(this.get("name"), "columnDataGroup", this);
  },

  /**
   * A name to uniquely identify the column data group.
   *
   * @property name
   * @type String
   */
  name : "",

  /**
   * Array of columns. Each element is an object which will be passed to ColumnData.create.
   *
   * @property columns
   * @type Array
   */
  columns : EmberObjectUtils.hasMany(ColumnData),
});
