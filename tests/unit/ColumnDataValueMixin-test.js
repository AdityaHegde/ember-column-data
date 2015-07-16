import Ember from "ember";
import EmberColumnData from "ember-column-data";
import { module, test } from "qunit";
import startApp from "../helpers/start-app";

var ClassWithValue = Ember.Object.extend(EmberColumnData.ColumnDataValueMixin, {
  valueChangeHook : function(val) {
    this.set("lastValueChanged", val);
  },

  recordChangeHook : function() {
    this.set("recordChanged", true);
  },

  recordRemovedHook : function() {
    this.set("recordRemoved", true);
  },
});

module("ColumnDataValueMixin", {
  beforeEach : function(assert) {
    assert.application = startApp();
  },
  afterEach : function(assert) {
    Ember.run(assert.application, 'destroy');
  },
});

test("Sanity Tests", function(assert) {
  var objWithValue;
  Ember.run(function() {
    objWithValue = ClassWithValue.create({
      columnData : EmberColumnData.ColumnData.create({
        name : "vara",
        validation : {
          validations : [
            {type : 0}, {type : 1, regex : "^[a-z]*$", regexFlags : "i", negate : true, invalidMessage : "Failed Regex"},
          ],
        },
      }),
      record : Ember.Object.create({vara : ""}),
    });
  });
  
  andThen(function() {
    assert.equal(objWithValue.get("value"), "", "value is not assigned");
    assert.equal(objWithValue.get("record.validationFailed"), true, "validation failed");

    Ember.run(function() {
      objWithValue.set("record.vara", "123");
    });
  });

  andThen(function() {
    assert.equal(objWithValue.get("value"), "123", "value has '123'");
    assert.equal(objWithValue.get("record.validationFailed"), true, "validation still failed");
    assert.equal(objWithValue.get("lastValueChanged"), "123", "Last changed value is '123'");

    Ember.run(function() {
      objWithValue.set("record.vara", "abc");
    });
  });

  andThen(function() {
    assert.equal(objWithValue.get("value"), "abc", "value has 'abc'");
    assert.equal(objWithValue.get("record.validationFailed"), false, "validation passed");
    assert.equal(objWithValue.get("lastValueChanged"), "abc", "Last changed value is 'abc'");
  });
});

test("Record change hooks", function(assert) {
  var objWithValue;
  Ember.run(function() {
    objWithValue = ClassWithValue.create({
      columnData : EmberColumnData.ColumnData.create({
        name : "vara",
      }),
      record : Ember.Object.create({vara : "vara1"}),
    });
  });
  
  andThen(function() {
    assert.equal(objWithValue.get("recordChanged"), true, "Record changed fired");
    assert.equal(objWithValue.get("value"), "vara1", "value 'vara2' is assigned");

    Ember.run(function() {
      objWithValue.set("recordChanged", false);
      objWithValue.set("record", Ember.Object.create({vara : "vara2"}));
    });
  });
  
  andThen(function() {
    assert.equal(objWithValue.get("recordChanged"), true, "Record changed fired");
    assert.equal(objWithValue.get("value"), "vara2", "value 'vara2' is assigned");

    Ember.run(function() {
      objWithValue.set("recordChanged", false);
      objWithValue.set("record", null);
    });
  });
  
  andThen(function() {
    assert.equal(objWithValue.get("recordChanged"), false, "Record changed not fired");
    assert.equal(objWithValue.get("recordRemoved"), true, "Record removed fired");
    assert.equal(objWithValue.get("value"), null, "value is not assigned");
  });
});

test("disableValidation", function(assert) {
  var objWithValue;
  Ember.run(function() {
    objWithValue = ClassWithValue.create({
      columnData : EmberColumnData.ColumnData.create({
        name : "vara",
        validation : {
          validations : [
            {type : 0}, {type : 1, regex : "^[a-z]*$", regexFlags : "i", negate : true, invalidMessage : "Failed Regex"},
          ],
        },
      }),
      record : Ember.Object.create({vara : "123"}),
    });
  });

  andThen(function() {
    assert.equal(objWithValue.get("value"), "123", "value has '123'");
    assert.equal(objWithValue.get("record.validationFailed"), true, "validation still failed");

    Ember.run(function() {
      objWithValue.set("disableValidation", true);
    });
  });

  andThen(function() {
    //to trigger getter
    objWithValue.get("value");
    assert.equal(objWithValue.get("record.validationFailed"), false, "validation passed");
  });
});
