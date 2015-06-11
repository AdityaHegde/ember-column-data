import Ember from "ember";

/**
 * Not empty validation class. Pass type = 0 to get this.
 *
 * @class EmberColumnData.EmptyValidation
 * @module ember-column-data
 * @submodule ember-column-data-validation
 */
export default Ember.Object.extend({
  /**
   * Message to show when the validation fails.
   *
   * @property invalidMessage
   * @type String
   */
  invalidMessage : "",

  /**
   * Boolean that says whether to negate the result or not.
   *
   * @property negate
   * @type Boolean
   */
  negate : false,

  validateValue : function(value/*, record*/) {
    var invalid = Ember.isEmpty(value) || /^\s*$/.test(value),
        negate = this.get("negate");
    invalid = (negate && !invalid) || (!negate && invalid);
    return [invalid, this.get("invalidMessage")];
  },

  canBeEmpty : false,
});
