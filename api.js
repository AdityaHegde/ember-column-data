YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "EmberColumnData.CSVDuplicateValidation",
        "EmberColumnData.CSVRegexValidation",
        "EmberColumnData.ColumnData",
        "EmberColumnData.ColumnDataChangeCollectorMixin",
        "EmberColumnData.ColumnDataGroup",
        "EmberColumnData.ColumnDataValidation",
        "EmberColumnData.ColumnDataValueMixin",
        "EmberColumnData.ColumnListenerEntry",
        "EmberColumnData.DuplicateAcrossRecordsValidation",
        "EmberColumnData.EmptyValidation",
        "EmberColumnData.NumberRangeValidation",
        "EmberColumnData.RegexValidation"
    ],
    "modules": [
        "column-data",
        "ember-column-data",
        "ember-column-data-validation"
    ],
    "allModules": [
        {
            "displayName": "column-data",
            "name": "column-data",
            "description": "Module for meta data of a record type and its properties."
        },
        {
            "displayName": "ember-column-data",
            "name": "ember-column-data",
            "description": "A mixin that is a parent of ColumnDataValueMixin that collects value changes and fires listeners on the column."
        },
        {
            "displayName": "ember-column-data-validation",
            "name": "ember-column-data-validation",
            "description": "Validate duplication in a CSV. Pass type = 3 to get this."
        }
    ]
} };
});