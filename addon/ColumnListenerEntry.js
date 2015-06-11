import Ember from "ember";

/**
 * Entry for column listeners.
 *
 * @class EmberColumnData.ColumnListenerEntry
 */
export default Ember.Object.extend({
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
  key : Ember.computed("keyName", "name", function() {
    return this.get("keyName") || this.get("name");
  }),
});
