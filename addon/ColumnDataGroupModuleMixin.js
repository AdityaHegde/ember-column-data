import Ember from "ember";

/**
 * Column Data Group for modules.
 *
 * @class EmberColumnData.ColumnDataGroupModuleMixin
 * @module ember-column-data
 */
export default Ember.Mixin.create({
  init : function() {
    this._super();
    this.set("modules", this.get("modules") || []);
    var modules = this.get("modules");
    for(var i = 0; i < modules.length; i++) {
      this.addObserver(modules[i], this, "moduleTypeDidChange");
      this.moduleTypeDidChange(this, modules[i]);
    }
    this.columnsChanged();
  },

  /**
   * The type of base module.
   *
   * @property type
   * @type String
   */
  type : "base",

  /**
   * Lookup map for the module type to component string.
   *
   * @property modules
   * @type Array
   */
  lookupMap : null,

  /**
   * Modules base module supports.
   *
   * @property modules
   * @type Array
   */
  modules : null,

  moduleTypeDidChange : function(obj, moduleType) {
    var
    lookupMap = this.get("lookupMap");
    this.set(moduleType + "Component", lookupMap[this.get(moduleType) || "base"]);
  },

  columnsChanged : Ember.observer("parentObj.columns.@each", function() {
    var columns = this.get("parentObj.columns"), modules = this.get("modules");
    if(columns) {
      for(var i = 0; i < modules.length; i++) {
        this.set(modules[i] + "ColumnData", columns.findBy(this.get("type")+".moduleType", modules[i]));
      }
    }
  }),
});
