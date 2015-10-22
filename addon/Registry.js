import Ember from "ember";

export default Ember.Object.create({
  map : {},

  store : function(name, columnData) {
    this.get("map")[name] = columnData;
  },

  retrieve : function(name) {
    return this.get("map")[name];
  },
});
