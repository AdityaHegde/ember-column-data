import Ember from "ember";
import EmberObjectUtis from "ember-object-utils";
import EmptyValidation from "./EmptyValidation";
import RegexValidation from "./RegexValidation";
import CSVRegexValidation from "./CSVRegexValidation";
import CSVDuplicateValidation from "./CSVDuplicateValidation";
import DuplicateAcrossRecordsValidation from "./DuplicateAcrossRecordsValidation";
import NumberRangeValidation from "./NumberRangeValidation";

var ColumnDataValidationsMap = {
  0 : EmptyValidation,
  1 : RegexValidation,
  2 : CSVRegexValidation,
  3 : CSVDuplicateValidation,
  4 : DuplicateAcrossRecordsValidation,
  5 : NumberRangeValidation,
};

/**
 * Validation class that goes as 'validation' on column data.
 *
 * @class EmberColumnData.ColumnDataValidation
 * @module ember-column-data
 * @submodule ember-column-data-validation
 */
var ColumnDataValidation = Ember.Object.extend({
  init : function() {
    this._super();
    this.canBeEmpty();
  },

  /**
   * Array of validations to run. Passed as objects while creating.
   *
   * @property validations
   * @type Array
   */
  validations : EmberObjectUtis.hasMany(ColumnDataValidationsMap, "type"),

  /**
   * @property validate
   * @type Boolean
   * @private
   */
  validate : Ember.computed.notEmpty('validations'),

  /**
   * Method to validate a value on record.
   *
   * @method validateValue
   * @param {any} value Value to validate.
   * @param {Class} record Record to validate on.
   * @param {Array} [validations] Optional override of the validations to run.
   * @returns {Array} Returns an array with 1st element as a boolean which says whether validations passed or not, 2nd element is the invalid message if it failed.
   */
  validateValue : function(value, record, validations) {
    var invalid = [false, ""];
    validations = validations || this.get("validations");
    for(var i = 0; i < validations.length; i++) {
      var inv = validations[i].validateValue(value, record);
      if(inv[0]) {
        invalid = inv;
        break;
      }
    }
    return invalid;
  },

  canBeEmpty : Ember.observer("validations.@each", function() {
    if(this.get("validations") && !Ember.A(this.get("validations").mapBy("type")).contains(0)) {
      this.set("mandatory", false);
      this.get("validations").forEach(function(item) {
        item.set('canBeEmpty', true);
      });
    }
    else {
      this.set("mandatory", true);
    }
  }),

  /**
   * Boolean to denote whether the property is mandatory or not.
   *
   * @property mandatory
   * @type Boolean
   */
  mandatory : false,
});

/**
 * Column Data Validation Types Map.
 *
 * @static
 * @property ColumnDataValidationsMap
 */
ColumnDataValidation.ColumnDataValidationsMap = ColumnDataValidationsMap;

export default ColumnDataValidation;
