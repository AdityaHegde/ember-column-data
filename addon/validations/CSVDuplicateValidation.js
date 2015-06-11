import Ember from "ember";
import CSVRegexValidation from "./CSVRegexValidation";

/**
 * Validate duplication in a CSV. Pass type = 3 to get this.
 *
 * @class EmberColumnData.CSVDuplicateValidation
 * @extends EmberColumnData.CSVRegexValidation
 * @module ember-column-data
 * @submodule ember-column-data-validation
 */
export default CSVRegexValidation.extend({
  validateValue : function(value/*, record*/) {
    var invalid = false, negate = this.get("negate"),
        isEmpty, valuesMap = {};
    if(value && value.trim) {
      value = value.trim();
    }
    isEmpty = Ember.isEmpty(value);
    if(!isEmpty) {
      value.split(this.get("delimeter")).some(function(item) { 
        item = item.trim();
        if(valuesMap[item]) {
          invalid = true;
        }
        else {
          valuesMap[item] = 1;
        }
        return negate ? !invalid : invalid; 
      }, this); 
      invalid = (negate && !invalid) || (!negate && invalid);
    }
    return [invalid, this.get("invalidMessage")];
  },
});
