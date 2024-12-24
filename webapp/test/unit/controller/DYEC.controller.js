/*global QUnit*/

sap.ui.define([
	"zdyec/controller/DYEC.controller"
], function (Controller) {
	"use strict";

	QUnit.module("DYEC Controller");

	QUnit.test("I should test the DYEC controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
