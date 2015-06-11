import Ember from "ember";

/**
 * A mixin that is a parent of ColumnDataValueMixin that collects value changes and fires listeners on the column.
 *
 * @class EmberColumnData.ColumnDataChangeCollectorMixin
 * @module ember-column-data
 */
export default Ember.Mixin.create({
  init : function() {
    this._super();
    this.set("listenToMap", this.get("listenToMap") || {});
  },
  listenToMap : null,

  bubbleValChange : function(columnData, val, oldVal, callingView) {
    var listenToMap = this.get("listenToMap"),
        parentForm = this.get("parentForm");
    if(listenToMap[columnData.name]) {
      listenToMap[columnData.name].forEach(function(listening) {
        var listeningViews = listening.get("views");
        for(var i = 0; i < listeningViews.length; i++) {
          var view = listeningViews[i];
          if(view !== callingView) {
            view.listenedColumnChanged(columnData, val, oldVal);
          }
          if(view.get("columnData.bubbleValues") && parentForm && parentForm.bubbleValChange) {
            parentForm.bubbleValChange(columnData, val, oldVal, callingView);
          }
        }
      });
    }
    if(!Ember.isNone(oldVal) && this.get("record")) {
      this.get("record").set("tmplPropChangeHook", columnData.name);
    }
  },

  registerForValChange : function(colView, listenColName) {
    var listenToMap = this.get("listenToMap"), existing,
        callingCol = colView.get("columnData"),
        colName = callingCol.get("name"),
        parentForm = this.get("parentForm");
    listenColName = (listenColName && listenColName.get ? listenColName.get("name") : listenColName);
    if(callingCol.get("bubbleValues") && parentForm && parentForm.registerForValChange) {
      parentForm.registerForValChange(colView, listenColName);
    }
    if(!listenToMap) {
      listenToMap = {};
      this.set("listenToMap", listenToMap);
    }
    listenToMap[listenColName] = listenToMap[listenColName] || Ember.A([]);
    existing = listenToMap[listenColName].findBy("name", colName);
    if(existing) {
      existing.get("views").pushObject(colView);
    }
    else {
      listenToMap[listenColName].pushObject(Ember.Object.create({views : [colView], name : colName}));
    }
  },

  unregisterForValChange : function(colView, listenColName) {
    var listenToMap = this.get("listenToMap"), callingCol = colView.get("columnData"),
        colName = callingCol.get("name"),
        colListener = listenToMap && listenToMap[listenColName],
        existing = colListener && listenToMap[listenColName].findBy("name", colName),
        parentForm = this.get("parentForm");
    listenColName = (listenColName && listenColName.get ? listenColName.get("name") : listenColName);
    if(callingCol.get("bubbleValues") && parentForm && parentForm.unregisterForValChange) {
      parentForm.unregisterForValChange(colView, listenColName);
    }
    if(existing) {
      var existingViews = existing.get("views");
      existingViews.removeObject(colView);
      if(existingViews.length === 0) {
        colListener.removeObject(existing);
      }
      else {
        for(var i = 0; i < existingViews.length; i++) {
          existingViews[i].listenedColumnChanged(Ember.Object.create({name : listenColName, key : listenColName}), null, null);
        }
      }
    }
  },
});
