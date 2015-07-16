import Ember from "ember";
import EmberColumnData from "ember-column-data";
import { module, test } from "qunit";

module("ColumnData");

test("Sanity Test", function(assert) {
  var columnDataGroup;
  Ember.run(function() {
    EmberColumnData.ColumnDataGroup.create({
      name : "test1",
      columns : [{
        name : "vara1",
      }, {
        name : "varb1",
      }],
    });
    columnDataGroup = EmberColumnData.ColumnDataGroup.create({
      name : "test",
      columns : [{
        name : "vara",
        label : "VarA",
      }, {
        name : "varb",
        keyName : "varc",
        label : "VarB",
      }, {
        name : "vard",
        childColumnDataName : "vara1",
        childColumnDataGroupName : "test1",
      }, {
        name : "vare",
        childColumnData : {
          name : "varf",
        },
        childColumnDataGroup : {
          name : "test2",
          columns : [{
            name : "vara2",
          }, {
            name : "varb2",
          }],
        },
      }],
    });
  });
  
  assert.ok(columnDataGroup.get("columns.0") instanceof EmberColumnData.ColumnData, "Instance of ColumnDataMod.ColumnData was created for columns");
  assert.deepEqual(columnDataGroup.get("columns").mapBy("name"), ["vara", "varb", "vard", "vare"], "'name' of all columns are as expected");
  assert.deepEqual(columnDataGroup.get("columns").mapBy("key"),  ["vara", "varc", "vard", "vare"], "'key' of all columns are as expected");
  assert.ok(columnDataGroup.get("columns.2.childColumnData") instanceof EmberColumnData.ColumnData, "Child col was created when referenced with 'childColumnDataName'");
  assert.equal(columnDataGroup.get("columns.2.childColumnData.name"), "vara1");
  assert.ok(columnDataGroup.get("columns.2.childColumnDataGroup") instanceof EmberColumnData.ColumnDataGroup, "Child col group was created when referenced with 'childColumnDataGroupName'");
  assert.equal(columnDataGroup.get("columns.2.childColumnDataGroup.name"), "test1");
  assert.deepEqual(columnDataGroup.get("columns.2.childColumnDataGroup.columns").mapBy("name"), ["vara1", "varb1"], "Child col group has the right names for columns");
  assert.ok(columnDataGroup.get("columns.3.childColumnData") instanceof EmberColumnData.ColumnData, "Child col was created when an object was passed to 'childColumnData'");
  assert.equal(columnDataGroup.get("columns.3.childColumnData.name"), "varf");
  assert.ok(columnDataGroup.get("columns.3.childColumnDataGroup") instanceof EmberColumnData.ColumnDataGroup, "Child col group was created when an object was passed to 'childColumnDataGroup'");
  assert.equal(columnDataGroup.get("columns.3.childColumnDataGroup.name"), "test2");
  assert.deepEqual(columnDataGroup.get("columns.3.childColumnDataGroup.columns").mapBy("name"), ["vara2", "varb2"], "Child col group has the right names for columns");
});
