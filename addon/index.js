/**
 * Module for meta data of a record type and its properties.
 *
 * @module column-data
 */
import Ember from "ember";
import ColumnDataGroup from "./ColumnDataGroup";
import ColumnData from "./ColumnData";
import ColumnDataChangeCollectorMixin from "./ColumnDataChangeCollectorMixin";
import ColumnDataValueMixin from "./ColumnDataValueMixin";
import ColumnDataValidation from  "./validations/ColumnDataValidation";
import Registry from "./Registry";

var EmberColumnData = Ember.Namespace.create();
window.EmberColumnData = EmberColumnData;

EmberColumnData.ColumnDataGroup = ColumnDataGroup;
EmberColumnData.ColumnData = ColumnData;
EmberColumnData.ColumnDataChangeCollectorMixin = ColumnDataChangeCollectorMixin;
EmberColumnData.ColumnDataValueMixin = ColumnDataValueMixin;
EmberColumnData.ColumnDataValidation = ColumnDataValidation;
EmberColumnData.Registry = Registry;

EmberColumnData.initializer = function(app) {
  if(app.ColumnData) {
    for(var i = 0; i < app.ColumnData.length; i++) {
      EmberColumnData.ColumnDataGroup.create(app.ColumnData[i]);
    }
  }
};

export default EmberColumnData;
