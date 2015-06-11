import Ember from "ember";
import EmptyValidation from "./EmptyValidation";

/**
 * Validate number ranges. Pass type = 5 to get this.
 *
 * @class EmberColumnData.NumberRangeValidation
 * @extends EmberColumnData.EmptyValidation
 * @module ember-column-data
 * @submodule ember-column-data-validation
 */
export default EmptyValidation.extend({
  /**
   * Min value of a number.
   *
   * @property minValue
   * @type Number
   */
  minValue : 0,

  /**
   * Max value of a number.
   *
   * @property maxValue
   * @type Number
   */
  maxValue : 999999,

  validateValue : function(value/*, record*/) {
    var invalid = false, negate = this.get("negate");
    if(value && value.trim) {
      value = value.trim();
    }
    if(Ember.isEmpty(value)) {
      invalid = (this.get("canBeEmpty") && negate) || (!this.get("canBeEmpty") && !negate);
    }
    else {
      var num = Number(value);
      if(num < this.get("minValue") || num > this.get("maxValue")) {
        invalid = true;
      }
    }
    invalid = (negate && !invalid) || (!negate && invalid);
    return [invalid, this.get("invalidMessage")];
  },
});
