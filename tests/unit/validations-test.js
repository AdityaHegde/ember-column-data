import Ember from "ember";
import EmberColumnData from "ember-column-data";
import { module, test } from "qunit";
import startApp from "../helpers/start-app";

var tests = Ember.A([{
  testName : "Basic Tests",
  columnData : {
    name : "test1",
    validation : {
      validations : [
        {type : 0, invalidMessage : "Cant be empty"},
        {type : 1, regex : "^[a-z]*$", regexFlags : "i", negate : true, invalidMessage : "Failed Regex"},
      ],
    },
  },
  record : {},

  validations : Ember.A([{
    value   : null,
    result  : true,
    message : "Cant be empty",
  }, {
    value   : "",
    result  : true,
    message : "Cant be empty",
  }, {
    value   : 123,
    result  : true,
    message : "Failed Regex",
  }, {
    value   : "a.b",
    result  : true,
    message : "Failed Regex",
  }, {
    value   : "abc",
    result  : false,
    message : "",
  }, {
    value   : "ABC",
    result  : false,
    message : "",
  }]),
}]),
testNameToDataMap = {};

module("Validations", {
  beforeEach : function(assert) {
    assert.testData = testNameToDataMap[assert.test.testName];
    assert.application = startApp();
  },
  afterEach : function(assert) {
    Ember.run(assert.application, 'destroy');
  },
});

tests.forEach(function(testData) {
  testNameToDataMap[testData.testName] = testData;

  test(testData.testName, function(assert) {
    var columnData, record;
    Ember.run(function() {
      columnData = EmberColumnData.ColumnData.create(testData.columnData);
      record = Ember.Object.create(testData.record);

      if(testData.childRecords) {
        testData.childRecords.forEach(function(rec) {
          var recObj = Ember.Object.create(rec);
          record.get("records").pushObject(recObj);
          recObj.set("parentRecord", record);
        });
      }
    });

    andThen(function() {
      var valObj = columnData.get("validation");
      testData.validations.forEach(function(validation) {
        var valid = valObj.validateValue(validation.value, record);
        assert.equal(valid[0], validation.result, "Validation " + (validation.result ? "failed" : "passed") + " for " + validation.value);
        assert.equal(valid[1], validation.message);
      });
    });
  });
});
