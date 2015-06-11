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
        childColName : "vara1",
        childColGroupName : "test1",
      }, {
        name : "vare",
        childCol : {
          name : "varf",
        },
        childColGroup : {
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
  assert.ok(columnDataGroup.get("columns.2.childCol") instanceof EmberColumnData.ColumnData, "Child col was created when referenced with 'childColName'");
  assert.equal(columnDataGroup.get("columns.2.childCol.name"), "vara1");
  assert.ok(columnDataGroup.get("columns.2.childColGroup") instanceof EmberColumnData.ColumnDataGroup, "Child col group was created when referenced with 'childColGroupName'");
  assert.equal(columnDataGroup.get("columns.2.childColGroup.name"), "test1");
  assert.deepEqual(columnDataGroup.get("columns.2.childColGroup.columns").mapBy("name"), ["vara1", "varb1"], "Child col group has the right names for columns");
  assert.ok(columnDataGroup.get("columns.3.childCol") instanceof EmberColumnData.ColumnData, "Child col was created when an object was passed to 'childCol'");
  assert.equal(columnDataGroup.get("columns.3.childCol.name"), "varf");
  assert.ok(columnDataGroup.get("columns.3.childColGroup") instanceof EmberColumnData.ColumnDataGroup, "Child col group was created when an object was passed to 'childColGroup'");
  assert.equal(columnDataGroup.get("columns.3.childColGroup.name"), "test2");
  assert.deepEqual(columnDataGroup.get("columns.3.childColGroup.columns").mapBy("name"), ["vara2", "varb2"], "Child col group has the right names for columns");
});
