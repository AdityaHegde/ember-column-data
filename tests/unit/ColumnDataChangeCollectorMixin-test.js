import Ember from "ember";
import EmberColumnData from "ember-column-data";
import EmberObjectUtils from "ember-object-utils";
import { module, test } from "qunit";
import startApp from "../helpers/start-app";

var
ClassWithValue = Ember.Object.extend(EmberColumnData.ColumnDataValueMixin, {
  listenedColumnChangedHook : function(changedColumnData, changedValue, oldValue) {
    this.set("test_changedColumnData", changedColumnData);
    this.set("test_changedValue", changedValue);
    this.set("test_oldValue", oldValue);
  },

  parentForBubbling : Ember.computed.alias("parentObj"),
}),
ParentClassForValue = Ember.Object.extend(EmberColumnData.ColumnDataChangeCollectorMixin, {
  children : EmberObjectUtils.hasMany(ClassWithValue),
});

module("ColumnDataChangeCollectorMixin", {
  beforeEach : function(assert) {
    assert.application = startApp();
  },
  afterEach : function(assert) {
    Ember.run(assert.application, 'destroy');
  },
});

test("Sanity Test", function(assert) {
  var objParentForValue;
  Ember.run(function() {
    objParentForValue = ParentClassForValue.create({
      children : [{}, {}, {}],
    });
    objParentForValue.set("children.0.columnData", EmberColumnData.ColumnData.create({
      name : "vara",
      columnListenerEntries : [{name : "varb"}],
    }));
    objParentForValue.set("children.0.record", Ember.Object.create({
      vara : "a1",
      varb : "b1",
      varc : "c1",
    }));
    objParentForValue.set("children.1.columnData", EmberColumnData.ColumnData.create({
      name : "varb",
      columnListenerEntries : [{name : "varb"}, {name : "vara"}],
    }));
    objParentForValue.set("children.1.record", Ember.Object.create({
      vara : "a2",
      varb : "b2",
      varc : "c2",
    }));
    objParentForValue.set("children.2.columnData", EmberColumnData.ColumnData.create({
      name : "varc",
      columnListenerEntries : [{name : "vara"}],
    }));
    objParentForValue.set("children.2.record", Ember.Object.create({
      vara : "a3",
      varb : "b3",
      varc : "c3",
    }));
  });

  andThen(function() {
    Ember.run(function() {
      objParentForValue.set("children.0.value", "ac1");
      objParentForValue.set("children.1.value", "bc1");
    });
  });

  andThen(function() {
    assert.equal(objParentForValue.get("children.0.test_changedColumnData.name"), "varb");
    assert.equal(objParentForValue.get("children.0.test_changedValue"),           "bc1");
    assert.equal(objParentForValue.get("children.0.test_oldValue"),               "b2");
    assert.equal(objParentForValue.get("children.1.test_changedColumnData.name"), "vara");
    assert.equal(objParentForValue.get("children.1.test_changedValue"),           "ac1");
    assert.equal(objParentForValue.get("children.1.test_oldValue"),               "a1");
    assert.equal(objParentForValue.get("children.2.test_changedColumnData.name"), "vara");
    assert.equal(objParentForValue.get("children.2.test_changedValue"),           "ac1");
    assert.equal(objParentForValue.get("children.2.test_oldValue"),               "a1");
  });
});
