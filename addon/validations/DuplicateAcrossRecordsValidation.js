import EmptyValidation from "./EmptyValidation";

/**
 * Validate duplication across siblings of the record. Pass type = 4 to get this.
 *
 * @class EmberColumnData.DuplicateAcrossRecordsValidation
 * @extends EmberColumnData.EmptyValidation
 * @module ember-column-data
 * @submodule ember-column-data-validation
 */
export default EmptyValidation.extend({
  /**
   * Path relative to record to check duplication under.
   *
   * @property duplicateCheckPath
   * @type String
   */
  duplicateCheckPath : "",

  /**
   * Key in the object to check duplicate for.
   *
   * @property duplicateCheckKey
   * @type String
   */
  duplicateCheckKey : "id",

  validateValue : function(value, record) {
    var invalid = false, negate = this.get("negate"),
        arr = record.get(this.get("duplicateCheckPath")),
        values = arr && arr.filterBy(this.get("duplicateCheckKey"), value);
    invalid = (values && values.get("length") > 1) || (values.get("length") === 1 && values[0] !== record);
    invalid = (negate && !invalid) || (!negate && invalid);
    return [invalid, this.get("invalidMessage")];
  },
});
