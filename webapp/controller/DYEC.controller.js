sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/Sorter',
    'sap/m/MessageToast',
    'sap/m/MenuItem',
    'sap/ui/core/util/MockServer',
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet',
    'sap/ui/model/odata/v2/ODataModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, MessageBox, JSONModel, Filter, FilterOperator, Sorter, MessageToast, MenuItem, MockServer, exportLibrary, Spreadsheet, ODataModel) {
        "use strict";

        return Controller.extend("zdyec.controller.DYEC", {
            onInit: function () {
                var dt = new Date();
                var dt1 = dt.getFullYear() + '-' + Number(dt.getMonth() + 1) + '-' + dt.getDate();
                var dt2 = dt1.split("-")

                if (dt2[1].length != 2) {
                    var dt3 = dt2[0] + "-" + 0 + dt2[1] + "-" + dt2[2]
                } else {
                    dt3 = dt2
                }
                var oPayloadObject = {
                    "PostingDate": dt3
                }
                this.getView().setModel(new sap.ui.model.json.JSONModel(oPayloadObject), "oPayloadData");
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
                this.getView().getModel("oTableDataModel").setProperty("/aTableData", []);

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPP_DYEC_BIN");
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oBatchData");


                oModel.read("/ConsStockQty", {
                    urlParameters: { "$top": "100000" },
                    success: function (oresponse) {
                        this.getView().getModel("oBatchData").setProperty("/aData", oresponse.results)
                    }.bind(this)
                })
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oStockQtyModel");
                this.getView().getModel("oStockQtyModel").setProperty("/aStockQtyData", []);
                // this.consqtyvarFunction();





            },
            onsetnumber: function () {
                ////////////////////Anshul Chechani
                var oModel = this.getView().getModel();
                var SetNum = this.getView().byId("SetNumber").getValue();
                var oInput1 = this.getView().byId("dysort");
                var oInput = this.getView().byId("orderno");
                var oFilter1 = new sap.ui.model.Filter("SetNumber", "EQ", SetNum);
                if (SetNum === "") {
                    MessageBox.error("Please Enter the Set Number",
                        {
                            title: "Warning",
                            icon: MessageBox.Icon.ERROR
                        });

                }
                else {
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();
                    oModel.read("/ordermat", {
                        filters: [oFilter1],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Please Enter the Set No. ",
                                    {
                                        title: "Warning",
                                        icon: MessageBox.Icon.ERROR
                                    });
                            }
                            else {
                                var dysort = oresponse.results[0].dyeingsort;
                                var orderno = oresponse.results[0].OrderID;
                                oInput1.setValue(dysort);
                                oInput.setValue(orderno);
                                oBusyDialog.close();
                                this.onrecipenumber();

                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })
                }

            },
            onrecipenumber: function () {
                ////////////////////Anshul Chechani
                var oModel = this.getView().getModel();
                var orderno = this.getView().byId("orderno").getValue();
                var oInput = this.getView().byId("recipe");
                var oInput1 = this.getView().byId("dysort");
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "modelname");
                this.getView().getModel("modelname").setProperty("/odataelementlist", []);
                var oFilter = new sap.ui.model.Filter("OrderID", "EQ", orderno);
                if (orderno === "") {
                    MessageBox.error("Please enter the Order No. ",
                        {
                            title: "Warning",
                            icon: MessageBox.Icon.ERROR
                        });

                }
                else {
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();
                    oModel.read("/ZDYEC_RECIPE_NO_F4", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Please Enter the Set No. ", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                this.getView().getModel("modelname").setProperty("/odataelementlist", oresponse.results)
                                var dysort = oresponse.results[0].dyeingsort;
                                var orderno = oresponse.results[0].SortField;
                                oInput.setValue(orderno);
                                oInput1.setValue(dysort);
                                oBusyDialog.close();

                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })
                }

            },
            CallBackendData11: function () {
                var oModel = this.getView().getModel();
                var SetNum = this.getView().byId("SetNumber").getValue();
                var recipeno = this.getView().byId("recipe").getValue();
                var orderno = this.getView().byId("orderno").getValue();
                var oInput1 = this.getView().byId("Plant");
                var oInput = this.getView().byId("orderno");

                if (recipeno === "") {
                    MessageBox.error("Please Select the Recipe No.", {
                        title: "Warning",
                        icon: MessageBox.Icon.ERROR
                    });

                }
                else if (SetNum === "") {
                    MessageBox.error("Please Enter the Set No.",
                        {
                            title: "Warning",
                            icon: MessageBox.Icon.ERROR
                        });
                }
                else {
                    var aTablearr2 = [];
                    var oFilter = new sap.ui.model.Filter("SetNumber", "EQ", SetNum);
                    var oFilter1 = new sap.ui.model.Filter("SortField", "EQ", recipeno);
                    var oFilter2 = new sap.ui.model.Filter("OrderID", "EQ", orderno);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZDYEC_SET_COMPONENT", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter, oFilter1, oFilter2],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Please Enter the Set No ,Recipe No  and Order No.", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                var plant = oresponse.results[0].Plant;
                                var orderno = oresponse.results[0].OrderID;
                                oInput1.setValue(plant);
                                oInput.setValue(orderno);
                                var TableModel2 = this.getView().getModel("oTableDataModel");
                                var aTablearr2 = TableModel2.getProperty("/aTableData")
                                oresponse.results.map(function (items) {
                                    var consqtyvar = items.ConsQty;
                                    var AlreadyConsvar = items.ResvnItmWithdrawnQtyInBaseUnit;
                                    var obj = {
                                        "recipedesc": items.SortField,
                                        "Product": items.Product,
                                        "ProductDescription": items.ProductDescription,
                                        "ResvnItmRequiredQtyInBaseUnit": items.ResvnItmRequiredQtyInBaseUnit,
                                        "ProdGPL": "",
                                        "LastUsedQty": items.LastUsedQty,
                                        "Feed_LTR": items.Feed_LTR,
                                        "BaseUnit": items.BaseUnit,
                                        "ResvnItmWithdrawnQtyInBaseUnit": items.AlreadyQty,
                                        "StockQty": items.StockQty,
                                        "ConsQty": items.ConsQty,
                                        "Batch": "",
                                        "StorageLocation": "DY01",
                                        "bathadjustment": "",
                                        "costing": items.MvgAveragePriceInPreviousYear,
                                        "setlength": items.SetLength,
                                        "costpermtr": ""
                                    }
                                    aTablearr2.push(obj);

                                })
                                TableModel2.setProperty("/aTableData", aTablearr2)
                                // this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                                oBusyDialog.close();
                                // this.consqtyvarFunction();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })



                }

            },
            consqtyvarFunction: function (oEvent) {
                var omodel = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
                var Avl_Stock_Var = omodel.StockQty;
                var Cons_Qty_Var = omodel.ConsQty;
                var Avl_Stock_Var1 = parseInt(Avl_Stock_Var);
                var Cons_Qty_Var1 = parseInt(Cons_Qty_Var);

                if (Cons_Qty_Var1 > Avl_Stock_Var1) {
                    oEvent.getSource().setValueState('Error');
                    oEvent.getSource().setValueStateText("Consumption Quantity Cannot Exceed Available Stock.");
                }
                else if (Cons_Qty_Var1 === Avl_Stock_Var1) {
                    oEvent.getSource().setValueState('Error');
                    oEvent.getSource().setValueStateText('Consumption Quantity Cannot Equal Available Stock.');
                }
                else {
                    oEvent.getSource().setValueState('None');
                }

            },
            TableDataSave: function () {
                // alert("Devendra Singh Rathor");
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                var PostDate = this.getView().byId("PostingDate").getValue();
                var SetNum = this.getView().byId("SetNumber").getValue();
                var Plant = this.getView().byId("Plant").getValue();
                var orderno = this.getView().byId("orderno").getValue();
                var recipeno = this.getView().byId("recipe").getValue();
                var dysort = this.getView().byId("dysort").getValue();
                var tot = this.getView().byId("tot").getValue();

                if (SetNum === "") {
                    MessageBox.error("Please Enter the Set No.", {
                        title: "Warning",
                        icon: MessageBox.Icon.ERROR
                    });
                }
                else if (tot === "") {
                    MessageBox.error("Please Enter the Set No.", {
                        title: "Warning",
                        icon: MessageBox.Icon.ERROR
                    });
                }
                else {
                    if (PostDate.length === 10) {
                        var yyyy = PostDate.slice(0, 4);
                        var mm = PostDate.slice(5, 7);
                        var dd = PostDate.slice(8, 10);
                        var dte = yyyy + mm + dd;
                    }
                    else if (PostDate.length === 9) {
                        var yyyy = PostDate.slice(0, 4);
                        var mm = PostDate.slice(5, 7);
                        var dd = PostDate.slice(8, 9);
                        dd = "0" + dd;
                        var dte = yyyy + mm + dd;
                    }
                    var Dyectable = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                    var TableDataArray = [];
                    Dyectable.map(function (items) {
                        var oTableData = {
                            Plant: Plant,
                            PostDate: dte,
                            OrderID: orderno,
                            SetNumber: SetNum,
                            recipe: recipeno,
                            recipedes: items.recipedesc,
                            Product: items.Product,
                            ProductDescription: items.ProductDescription,
                            ResvnItmRequiredQtyInBaseUnit: items.ResvnItmRequiredQtyInBaseUnit,
                            ProdGPL: items.ProdGPL,
                            LastUsedQty: items.LastUsedQty,
                            Last_Use_Gpl: items.Last_Use_Gpl,
                            Feed_LTR: items.Feed_LTR,
                            BaseUnit: items.BaseUnit,
                            ResvnItmWithdrawnQtyInBaseUnit: items.ResvnItmWithdrawnQtyInBaseUnit,
                            StockQty: items.StockQty,
                            ConsQty: items.ConsQty,
                            Batch: items.Batch,
                            StorageLocation: items.StorageLocation,
                            bathadjustment: items.bathadjustment,
                            costing: items.costing,
                            setlength: items.setlength,
                            costpermtr: items.costpermtr,
                            stdgpl: items.stdgpl
                        }
                        TableDataArray.push(oTableData);
                    }.bind(this))


                    var Dyectable1 = this.getView().getModel("oTableDataModel2").getProperty("/aTableData2");
                    var TableDataArray3 = [];
                    Dyectable1.map(function (items) {
                        var oTableData = {
                            recipe: items.recipe,
                            recipecostmtr: items.recipecostmtr
                        }
                        TableDataArray3.push(oTableData);
                    }.bind(this))

                    var url = "/sap/bc/http/sap/zpp_dyec_http?sap-client=080";
                    var date = dte;
                    $.ajax({
                        type: "post",
                        url: url,
                        data: JSON.stringify({
                            tot,
                            date,
                            SetNum,
                            Plant,
                            dysort,
                            orderno,
                            recipeno,
                            tabledata: TableDataArray,
                            TableDataArray3
                        }),
                        contentType: "application/json; charset=utf-8",
                        traditional: true,
                        success: function (data) {
                            oBusyDialog.close();
                            var meta = data.slice(0, 5);
                            var message = data.slice(5, 200);
                            if (meta === "ERROR") {
                                MessageBox.error(message, {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                MessageBox.success(data, {
                                    title: "Data Saved Succesfully",
                                    icon: MessageBox.Icon.success,
                                    onClose: function (oAction) {
                                        if (oAction === MessageBox.Action.OK) {
                                            window.location.reload();
                                        }
                                    }
                                });
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show(error, {
                                title: "Warning",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    });

                }

            },
            DeletaTableData_old: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Deleting Data",
                    text: "Please wait",
                });
                oBusyDialog.open();
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oTableDataModel");
                var aTableArr = oTableModel.getProperty("/aTableData");
                var aNewArr = [];

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    aNewArr.push(aTableArr[aSelectedIndex[i]])
                }

                aNewArr.map(function (item) {
                    var orderno = item.StockQty;
                    var iIndex = "";
                    aTableArr.map(function (items, index) {
                        if (orderno === items.StockQty) {
                            iIndex = index
                        }
                    })
                    aTableArr.splice(iIndex, 1);
                })
                oTableModel.setProperty("/aTableData1", aTableArr)
                oBusyDialog.close();
            },
            CalculateTotalConsQuantity: function (oEvent) {
                var VarFor_ProdGPL = Number(oEvent.getSource().getBindingContext("oTableDataModel").getObject().ProdGPL);
                var VarFor_Feed_LTR = Number(oEvent.getSource().getBindingContext("oTableDataModel").getObject().Feed_LTR);
                var reqqty = Number(oEvent.getSource().getBindingContext("oTableDataModel").getObject().ResvnItmRequiredQtyInBaseUnit);
                var price = Number(oEvent.getSource().getBindingContext("oTableDataModel").getObject().costing);
                var setlength = Number(oEvent.getSource().getBindingContext("oTableDataModel").getObject().setlength);
                var Total_ConsQty = (VarFor_ProdGPL * VarFor_Feed_LTR) / 1000;
                var Total_ConsQty1 = Total_ConsQty;


                Total_ConsQty1 = parseFloat(Total_ConsQty1).toFixed(3)

                var b = price * Total_ConsQty1;
                var c = b / setlength;

                c = parseFloat(c).toFixed(3)
                var a = (reqqty / VarFor_Feed_LTR) * 1000;

                a = parseFloat(a).toFixed(3);
                oEvent.getSource().getBindingContext("oTableDataModel").getObject().costpermtr = c;
                oEvent.getSource().getBindingContext("oTableDataModel").getObject().stdgpl = a;
                oEvent.getSource().getBindingContext("oTableDataModel").getObject().ConsQty = Total_ConsQty1;

            },
            CallDataAccordingConsBatch1: function (oEvent) {
                var VarFor_Batch = oEvent.getSource().getBindingContext("oTableDataModel").getObject().Batch;
                var VarFor_Product = oEvent.getSource().getBindingContext("oTableDataModel").getObject().Product;
                var VarFor_Plant = this.getView().byId("Plant").getValue();
                var data = this.getView().getModel("oBatchData").getProperty("/aData")
                var aNewArr = [];
                data.map(function (items) {
                    if (items.Material === VarFor_Product && items.Plant === VarFor_Plant && items.Batch === VarFor_Batch) {
                        aNewArr.push(items);
                    }
                })
                var Qty = aNewArr[0].StockQty;
                oEvent.getSource().getBindingContext("oTableDataModel").getObject().StockQty = aNewArr[0].StockQty;

            },

            CallDataAccordingConsBatch: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait",
                });
                oBusyDialog.open();
                var oModel = this.getView().getModel();
                var VarFor_Batch = oEvent.mParameters.value;
                // var oSelectedItem = oEvent.getParameter("selectedItem");
                this.sPath = oEvent.getSource().getBindingContext('oTableDataModel').getPath();
                // var VarFor_Batch = oEvent.getSource().getBindingContext("oTableDataModel").getObject().Batch;
                var VarFor_Product = oEvent.getSource().getBindingContext("oTableDataModel").getObject().Product;
                var VarFor_Plant = this.getView().byId("Plant").getValue();
                var data = this.getView().getModel("oBatchData").getProperty("/aData");
                var aNewArr = [];
                var oFilter = new sap.ui.model.Filter("Material", "EQ", VarFor_Product);
                var oFilter1 = new sap.ui.model.Filter("Plant", "EQ", VarFor_Plant);
                var oFilter2 = new sap.ui.model.Filter("Batch", "EQ", VarFor_Batch);
                var aNewArr1 = []
                // data.map(function (items) {
                //     if (items.Material === VarFor_Product && items.Plant === VarFor_Plant && items.Batch === VarFor_Batch) {
                //         aNewArr1.push(items)
                //     }
                // })

                // aNewArr1.map(function (items) {
                //     if (items.Material === VarFor_Product && items.Plant === VarFor_Plant && items.Batch === VarFor_Batch) {
                //         aNewArr.push(items);
                //     }
                // })

                // oEvent.getSource().getBindingContext("oTableDataModel").getObject().StockQty = aNewArr[0].StockQty;
                // function myFunction(extraArg) {
                oModel.read("/ConsStockQty", {
                    urlParameters: { "$top": "50000" },
                    filters: [oFilter, oFilter1, oFilter2],
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            if (items.Material === VarFor_Product && items.Plant === VarFor_Plant && items.Batch === VarFor_Batch) {
                                aNewArr.push(items);
                            }
                        })
                        // var sPath = aNewArr[0].StockQty;
                        // oEvent.getSource().getBindingContext("oTableDataModel").getObject().StockQty = aNewArr[0].StockQty;
                        this.getView().getModel('oTableDataModel').getProperty(this.sPath).StockQty = aNewArr[0].StockQty;
                        this.getView().getModel('oTableDataModel').setProperty(this.sPath, this.getView().getModel('oTableDataModel').getProperty(this.sPath));
                        // this.oSource.setValue(oSelectedItem.getDescription())
                        oBusyDialog.close();


                    }.bind(this),
                })
                //  } 

            },









            Checking: function () {
                var oTable = this.getView().getModel("oTableDataModel").getProperty("/aTableData");

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel2");
                this.getView().getModel("oTableDataModel2").setProperty("/aTableData2", []);

                var TableModel2 = this.getView().getModel("oTableDataModel2");
                var aTablearr2 = TableModel2.getProperty("/aTableData2")

                for (var i = 0; i < oTable.length; i++) {

                    var recipedesc = oTable[i].recipedesc;
                    var tot = 0;

                    for (var j = 0; j < oTable.length; j++) {
                        if (recipedesc === oTable[j].recipedesc) {
                            tot = Number(oTable[j].costpermtr) + tot;
                        }
                    }
                    tot = parseFloat(tot).toFixed(3)

                    if (aTablearr2.length === 1) {
                        if (recipedesc !== aTablearr2[0].recipe) {
                            var obj = {
                                "recipe": recipedesc,
                                "recipecostmtr": tot

                            }
                            aTablearr2.push(obj);
                            TableModel2.setProperty("/aTableData2", aTablearr2);

                        }
                    }
                    else if (aTablearr2.length === 2) {
                        if (recipedesc !== aTablearr2[1].recipe && recipedesc !== aTablearr2[0].recipe) {
                            var obj = {
                                "recipe": recipedesc,
                                "recipecostmtr": tot

                            }
                            aTablearr2.push(obj);
                            TableModel2.setProperty("/aTableData2", aTablearr2);

                        }
                    } else if (aTablearr2.length === 3) {
                        if (recipedesc !== aTablearr2[2].recipe && recipedesc !== aTablearr2[1].recipe && recipedesc !== aTablearr2[0].recipe) {
                            var obj = {
                                "recipe": recipedesc,
                                "recipecostmtr": tot

                            }
                            aTablearr2.push(obj);
                            TableModel2.setProperty("/aTableData2", aTablearr2);

                        }
                    } else if (aTablearr2.length === 4) {
                        if (recipedesc !== aTablearr2[3].recipe && recipedesc !== aTablearr2[2].recipe && recipedesc !== aTablearr2[1].recipe && recipedesc !== aTablearr2[0].recipe) {
                            var obj = {
                                "recipe": recipedesc,
                                "recipecostmtr": tot

                            }
                            aTablearr2.push(obj);
                            TableModel2.setProperty("/aTableData2", aTablearr2);

                        }
                    }
                    else {
                        var obj = {
                            "recipe": recipedesc,
                            "recipecostmtr": tot

                        }
                        aTablearr2.push(obj);
                        TableModel2.setProperty("/aTableData2", aTablearr2);
                    }

                }
                var otot = this.getView().getModel("oTableDataModel2").getProperty("/aTableData2");
                var Total = 0;
                for (var p = 0; p < otot.length; p++) {
                    Total = Total + Number(otot[p].recipecostmtr);
                }

                Total = parseFloat(Total).toFixed(3)
                this.getView().byId("tot").setValue(Total);

            },

            DeletaTableData: function (oEvent) {
                var oTable = oEvent.getSource().getParent().getParent();
                var SelectedIndex = oTable.getSelectedIndices();
                if (SelectedIndex.length != 0) {

                    var aNewArr = this.getView().getModel('oTableDataModel').getProperty("/aTableData");
                    var aNewArr2 = [];
                    for (var D = 0; D < aNewArr.length; D++) {
                        var ind = SelectedIndex.indexOf(D); // ind value will be -1 if selected row index is not matched
                        if (ind == -1) {
                            aNewArr2.push(aNewArr[D]);
                        }
                    }
                    this.getView().getModel('oTableDataModel').setProperty("/aTableData", aNewArr2);
                } else {
                    MessageBox.error("Please Select Atleast One Row")
                }

            },




            CallBackendData: function () {
                var oModel = this.getView().getModel();
                var SetNum = this.getView().byId("SetNumber").getValue();
                var recipeno = this.getView().byId("recipe").getValue();
                var orderno = this.getView().byId("orderno").getValue();
                var oInput1 = this.getView().byId("Plant");
                var oInput = this.getView().byId("orderno");

                if (recipeno === "") {
                    MessageBox.error("Please Select the Recipe No.", {
                        title: "Warning",
                        icon: MessageBox.Icon.ERROR
                    });

                }
                else if (SetNum === "") {
                    MessageBox.error("Please Enter the Set No.",
                        {
                            title: "Warning",
                            icon: MessageBox.Icon.ERROR
                        });
                }
                else {
                    var aTablearr2 = [];
                    var oFilter = new sap.ui.model.Filter("SetNumber", "EQ", SetNum);
                    var oFilter1 = new sap.ui.model.Filter("SortField", "EQ", recipeno);
                    var oFilter2 = new sap.ui.model.Filter("OrderID", "EQ", orderno);
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();

                    oModel.read("/ZDYEC_SET_COMPONENT", {
                        urlParameters: { "$top": "50000" },
                        filters: [oFilter, oFilter1, oFilter2],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Please Enter the Set No ,Recipe No  and Order No.", {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                var plant = oresponse.results[0].Plant;
                                var orderno = oresponse.results[0].OrderID;
                                oInput1.setValue(plant);
                                oInput.setValue(orderno);
                                var TableModel2 = this.getView().getModel("oTableDataModel");
                                var aTablearr2 = TableModel2.getProperty("/aTableData")
                                oresponse.results.map(function (items) {
                                    var consqtyvar = items.ConsQty;
                                    var AlreadyConsvar = items.ResvnItmWithdrawnQtyInBaseUnit;

                                    

                                    var obj = {
                                        "recipedesc": items.SortField,
                                        "Product": items.Product,
                                        "ProductDescription": items.ProductDescription,
                                        "ResvnItmRequiredQtyInBaseUnit": items.ResvnItmRequiredQtyInBaseUnit,
                                        "ProdGPL": "",
                                        "LastUsedQty": items.LastUsedQty,
                                        "Feed_LTR": items.Feed_LTR,
                                        "BaseUnit": items.BaseUnit,
                                        "ResvnItmWithdrawnQtyInBaseUnit": Number(items.AlreadyQty),
                                        "StockQty": items.StockQty,
                                        "ConsQty": items.ConsQty,
                                        "Batch": "",
                                        "StorageLocation": "DY01",
                                        "bathadjustment": "",
                                        "costing": items.MvgAveragePriceInPreviousYear,
                                        "setlength": items.SetLength,
                                        "costpermtr": ""
                                    }
                                    aTablearr2.push(obj);

                                })
                                const res = aTablearr2.reduce((acc, item) => {
                                    const foundIndex = acc.findIndex(
                                        (a) =>
                                            a.recipedesc === item.recipedesc &&
                                            a.Product === item.Product &&
                                            a.ProductDescription === item.ProductDescription 
                                    );
                                    if (foundIndex !== -1) {
                                        // If found, add the AlreadyQty to the existing value
                                      var ab =  acc[foundIndex].ResvnItmWithdrawnQtyInBaseUnit +=item.ResvnItmWithdrawnQtyInBaseUnit;
                                      console.log(ab)
                                    } else {
                                        // If not found, push a new object with the item's properties
                                        acc.push({ ...item });
                                    }
                                    return acc;
                                }, []);
                                TableModel2.setProperty("/aTableData", res)
                                // this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                                oBusyDialog.close();
                                // this.consqtyvarFunction();
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Can't Read!!!!!!!!!", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })



                }

            },
        });
    });
