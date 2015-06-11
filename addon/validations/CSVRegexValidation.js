import Ember from "ember";
import RegexValidation from "./RegexValidation";

/**
 * Validate on a regex on each value in a Comma Seperated Value. Pass type = 2 to get this.
 *
 * @class EmberColumnData.CSVRegexValidation
 * @extends EmberColumnData.RegexValidation
 * @module ember-column-data
 * @submodule ember-column-data-validation
 */
export default RegexValidation.extend({
  /**
   * Delimeter to use to split values in the CSV.
   *
   * @property delimeter
   * @type String
   */
  delimeter : ",",

  validateValue : function(value/*, record*/) {
    var invalid = false, negate = this.get("negate"),
        isEmpty;
    if(value && value.trim) {
      value = value.trim();
    }
    isEmpty = Ember.isEmpty(value);
    if(!isEmpty) {
      value.split(this.get("delimeter")).some(function(item) { 
        item = item.trim();
        invalid = this.get("regexObject").test(item); 
        return negate ? !invalid : invalid; 
      }, this); 
      invalid = (negate && !invalid) || (!negate && invalid);
    }
    return [invalid, this.get("invalidMessage")];
  },
});
