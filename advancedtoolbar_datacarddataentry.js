/**
 * Copyright (c) 2016 LABVANTAGE.  All rights reserved.
 * This software and documentation is the confidential and proprietary
 * information of LABVANTAGE. ("Confidential Information").
 * You shall not disclose such Confidential Information and shall use
 * it only in accordance with the terms of the license agreement you
 * entered into with LABVANTAGE.
 *
 * If you are not authorized by LABVANTAGE to utilize this
 * software and/or documentation, you must immediately discontinue any
 * further use or viewing of this software and documentation.
 * Violators will be prosecuted to the fullest extent of the law by
 * LABVANTAGE.
 *
 * Developed by LABVANTAGE.
 * 265 Davidson Avenue, Suite 220
 * Somerset, NJ, 08873

 * Description: Added in AdvancedToolbar of Data Card Data Entry page.
 * <p>
 * <p>
 *
 * @author  Sayantani Bakshi
 * @version $Author: sayantanib $
 *          $Source: /extra/CVS/profserv/Alcoa_6305/webapp/WEB-TESTINGLABS/scripts/advancedtoolbar_datacarddataentry.js,v $
 *          $Revision: 1.21 $
 *          $Date: 2017/08/08 06:07:18 $
 *          $State: Exp $
 *          $Id: advancedtoolbar_datacarddataentry.js,v 1.21 2017/08/08 06:07:18 sayantanib Exp $
 */
function AT_DataCardDataEntry() {

    var failSpecimenFlag = false;
    var passSpecimenFlag = false;
    var validFixtureStatus = false;
    var daysToFail = 0;
    var validStatus = 0;
    var daysToPass = 0;
    var passFailRFTDate = "";

    /**
     * This function is used to fail a specimen from data card data entry page
     */

    this.failSpecimen = function () {

        var selectedValues = rightframe.getSelectedDataitems();
        if ( selectedValues == null || selectedValues.length == 0 ) {
            sapphire.alert( "Select atleast one specimen" );
            return false;
        }
        if ( document.getElementById( 'action_intestdate' ) ) {
            var inTestDate = document.getElementById( 'action_intestdate' ).value;
        }
        if ( inTestDate == "" ) {
            sapphire.alert( "In Test Date is needed to fail a Specimen" );
            return false;
        }

        //***************************Added based on Customer feedback, Opening the Date Picker page*******************//

        var oDialog = sapphire.ui.dialog.open( 'Date', 'rc?command=page&page=DatePickerPrompt', true, 390, 300, null );
        oDialog.promptcallback = objDataEntryMaint.checkDateForFail;
        oDialog.promptcallbackarguments = {'': ''};
        return true;
    }

    this.checkDateForFail = function ( oPrompt ) {

        if ( document.getElementById( 'action_intestdate' ) ) {
            var inTestDate = document.getElementById( 'action_intestdate' ).value;
        }
        //Added on 09-03-2017 to fix VT#  ALCOA-00346

        if ( document.getElementById( 'action_datacardstatus' ) ) {
            var dataCardStatus = document.getElementById( 'action_datacardstatus' ).value;
        }
        var selectedValues = rightframe.getSelectedDataitems();
        if ( selectedValues == null || selectedValues.length == 0 ) {
            sapphire.alert( "Select atleast one specimen" );
            return false;
        }
        sapphire.ajax.callClass( "labvantage.custom.alcoa.ajax.PassFailSpecimenOperationOfDataCard", "objDataEntryMaint.callback_setFailToSpecimen",
            {operationdate: oPrompt.operationdate, intestdate: inTestDate}, true, true );

        if ( failSpecimenFlag ) {

            if ( document.getElementById( 'action_specimenintest' ) ) {
                var specimensInTest = document.getElementById( 'action_specimenintest' ).value;
            }
            if ( document.getElementById( 'action_u_datacardid' ) ) {
                var dataCardId = document.getElementById( 'action_u_datacardid' ).value;
            }
            var specimensInTestFinal = 0;
            var sampleid = "";
            var paramlistid = "";
            var paramlistversionid = "";
            var paramlistvariantid = "";
            var dataset = "";
            var paramid = "Pass/Fail;Days To Fail";
            var paramtype = "";
            var replicateid = "";
            var enteredText = "Fail" + ";" + daysToFail;
            var enteredTextFinal = "";
            var paramidFinal = "";
            var __selectedValues = selectedValues.split( "%3B" );
            var flagRFT = false;
            var val = "";
            var newFixtureId = "";
            var fixtureId = "";
            var fixtureIds = "";
            var newfixtureIds = "";
            var checkValue = rightframe.getSelectedDataitemsValue( 'enteredtext' ).split( ";" );
            var passfailDate = "";

            for ( var i = 0; i < __selectedValues.length; i++ ) {
                var _sampleid = __selectedValues[i].split( ";" )[0];
                var _paramlistid = __selectedValues[i].split( ";" )[1];
                var _paramlistversionid = __selectedValues[i].split( ";" )[2];
                var _paramlistvariantid = __selectedValues[i].split( ";" )[3];
                var _dataset = __selectedValues[i].split( ";" )[4];
                var _paramid = __selectedValues[i].split( ";" )[5];
                var _paramtype = __selectedValues[i].split( ";" )[6];
                var _replicateid = __selectedValues[i].split( ";" )[7];

                if ( _paramid == "Pass/Fail" ) {
                    val = checkValue[i];
                    if ( val == "RFT" ) {
                        flagRFT = true;
                        //alert(val);
                    }
                }

                if ( _paramid == "Days To Fail" ) {
                    if ( flagRFT ) {
                        val = checkValue[i];
                        enteredText = "Fail" + ";" + val;
                        //alert(enteredText);
                    }
                }

                if ( _paramid == "Fixture#" ) {
                    fixtureIds += ";" + checkValue[i];
                }

                sampleid += ";" + _sampleid;
                paramlistid += ";" + _paramlistid;
                paramlistversionid += ";" + _paramlistversionid;
                paramlistvariantid += ";" + _paramlistvariantid;
                dataset += ";" + _dataset;
                paramidFinal += ";" + paramid;
                paramtype += ";" + _paramtype;
                replicateid += ";" + _replicateid;
                enteredTextFinal += ";" + enteredText;
                passfailDate += ";" + passFailRFTDate;
            }
            if ( fixtureIds.match( "^;" ) ) {
                newfixtureIds = fixtureIds.substring( 1 );
            }
            var arrFixtureIds = newfixtureIds.split( ";" );
            var noOfFixtures = arrFixtureIds.length;
            var oForm = document.getElementById( "submitdata" );
            addField( oForm, 'hidden', 'action_keyid1', sampleid.substr( 1 ), 'action_keyid1' );
            addField( oForm, 'hidden', 'action_paramlistid', paramlistid.substr( 1 ), 'action_paramlistid' );
            addField( oForm, 'hidden', 'action_paramlistversionid', paramlistversionid.substr( 1 ), 'action_paramlistversionid' );
            addField( oForm, 'hidden', 'action_variantid', paramlistvariantid.substr( 1 ), 'action_variantid' );
            addField( oForm, 'hidden', 'action_dataset', dataset.substr( 1 ), 'action_dataset' );
            addField( oForm, 'hidden', 'action_paramid', paramidFinal.substr( 1 ), 'action_paramid' );
            addField( oForm, 'hidden', 'action_paramtype', paramtype.substr( 1 ), 'action_paramtype' );
            addField( oForm, 'hidden', 'action_replicateid', replicateid.substr( 1 ), 'action_replicateid' );
            addField( oForm, 'hidden', 'action_enteredtext', enteredTextFinal.substr( 1 ), 'action_enteredtext' );
            addField( oForm, 'hidden', 'action_passfailrftdate', passfailDate.substr( 1 ), 'action_passfailrftdate' );

            //Added and modified on 09-03-2017 to fix VT#  ALCOA-00346
            if ( dataCardStatus == 'Out of Test' || dataCardStatus == 'Complete' ) {
                specimensInTestFinal = 0;
            }
            else {
                specimensInTestFinal = parseInt( specimensInTest ) - parseInt( noOfFixtures );
            }
            addField( oForm, 'hidden', 'action_datacardid', dataCardId, 'action_datacardid' );
            addField( oForm, 'hidden', 'action_specimenintest', specimensInTestFinal, 'action_specimenintest' );
            addField( oForm, 'hidden', 'action_fixtureid', newfixtureIds, 'action_fixtureid' );  //CR ALCOA-00267 implemented by Sayantani on 08-08-2017
            actionbuttonscript( 'Sample', 'advancedtoolbar', 'fail', 'submitdata' );
            return true;
        }
    }


    /**
     *  AJAX callback to check Date difference and set failSpecimen flag accordingly
     * @param dateDifference
     */

    this.callback_setFailToSpecimen = function ( validdate, dateDifference, operationdate ) {

        if ( validdate == "No" ) {
            sapphire.alert( "The selected date should be greater than In Test Date" );
            return false;
        }
        if ( dateDifference >= 0 ) {
            daysToFail = dateDifference;
            passFailRFTDate = operationdate;
            failSpecimenFlag = true;
            return true;
        }
    }

    /**
     * This function is used to pass a specimen from data card data entry page
     */
    this.passSpecimen = function () {

        var selectedValues = rightframe.getSelectedDataitems();
        if ( selectedValues == null || selectedValues.length == 0 ) {
            sapphire.alert( "Select atleast one specimen" );
            return false;
        }
        if ( document.getElementById( 'action_intestdate' ) ) {
            var inTestDate = document.getElementById( 'action_intestdate' ).value;
        }
        if ( inTestDate == "" ) {
            sapphire.alert( "In Test Date is needed to pass a Specimen" );
            return false;
        }

        //***************************Added based on Customer feedback, Opening the Date Picker page*******************//

        var oDialog = sapphire.ui.dialog.open( 'Date', 'rc?command=page&page=DatePickerPrompt', true, 390, 300, null );
        oDialog.promptcallback = objDataEntryMaint.checkDateForPass;
        oDialog.promptcallbackarguments = {'': ''};
        return true;

    }

    /**
     * Deferred callback
     * @param oPrompt
     */

    this.checkDateForPass = function ( oPrompt ) {

        if ( document.getElementById( 'action_intestdate' ) ) {
            var inTestDate = document.getElementById( 'action_intestdate' ).value;
        }
        var selectedValues = rightframe.getSelectedDataitems();
        if ( selectedValues == null || selectedValues.length == 0 ) {
            sapphire.alert( "Select atleast one specimen" );
            return false;
        }

        sapphire.ajax.callClass( "labvantage.custom.alcoa.ajax.PassFailSpecimenOperationOfDataCard", "objDataEntryMaint.callback_setPassToSpecimen",
            {operationdate: oPrompt.operationdate, intestdate: inTestDate}, true, true );

        if ( passSpecimenFlag ) {
            var checkValue = rightframe.getSelectedDataitemsValue( 'enteredtext' ).split( ";" );
            var val = "";
            var sampleid = "";
            var paramlistid = "";
            var paramlistversionid = "";
            var paramlistvariantid = "";
            var dataset = "";
            var paramid = "Pass/Fail;Days To Fail";
            var paramtype = "";
            var replicateid = "";
            var enteredText = "Pass" + ";" + daysToPass;
            var enteredTextFinal = "";
            var paramidFinal = "";
            var __selectedValues = selectedValues.split( "%3B" );
            var passfailDate = "";
            var flagRFT = false;

            for ( var i = 0; i < __selectedValues.length; i++ ) {

                var _sampleid = __selectedValues[i].split( ";" )[0];
                var _paramlistid = __selectedValues[i].split( ";" )[1];
                var _paramlistversionid = __selectedValues[i].split( ";" )[2];
                var _paramlistvariantid = __selectedValues[i].split( ";" )[3];
                var _dataset = __selectedValues[i].split( ";" )[4];
                var _paramid = __selectedValues[i].split( ";" )[5];
                var _paramtype = __selectedValues[i].split( ";" )[6];
                var _replicateid = __selectedValues[i].split( ";" )[7];
                if ( _paramid == "Pass/Fail" ) {
                    val = checkValue[i];
                    if ( val == "Fail" ) {
                        sapphire.alert( "This specimen is failed" );
                        return false;
                    }
                    if ( val == "RFT" ) {
                        flagRFT = true;
                    }
                }

                if ( _paramid == "Days To Fail" ) {
                    if ( flagRFT ) {
                        val = checkValue[i];
                        daysToPass = "OK" + val;
                        enteredText = "Pass" + ";" + daysToPass;
                    }
                }

                sampleid += ";" + _sampleid;
                paramlistid += ";" + _paramlistid;
                paramlistversionid += ";" + _paramlistversionid;
                paramlistvariantid += ";" + _paramlistvariantid;
                dataset += ";" + _dataset;
                paramidFinal += ";" + paramid;
                paramtype += ";" + _paramtype;
                replicateid += ";" + _replicateid;
                enteredTextFinal += ";" + enteredText;
                passfailDate += ";" + passFailRFTDate;
            }

            var oForm = document.getElementById( "submitdata" );

            addField( oForm, 'hidden', 'action_keyid1', sampleid.substr( 1 ), 'action_keyid1' );
            addField( oForm, 'hidden', 'action_paramlistid', paramlistid.substr( 1 ), 'action_paramlistid' );
            addField( oForm, 'hidden', 'action_paramlistversionid', paramlistversionid.substr( 1 ), 'action_paramlistversionid' );
            addField( oForm, 'hidden', 'action_variantid', paramlistvariantid.substr( 1 ), 'action_variantid' );
            addField( oForm, 'hidden', 'action_dataset', dataset.substr( 1 ), 'action_dataset' );
            addField( oForm, 'hidden', 'action_paramid', paramidFinal.substr( 1 ), 'action_paramid' );
            addField( oForm, 'hidden', 'action_paramtype', paramtype.substr( 1 ), 'action_paramtype' );
            addField( oForm, 'hidden', 'action_replicateid', replicateid.substr( 1 ), 'action_replicateid' );
            addField( oForm, 'hidden', 'action_enteredtext', enteredTextFinal.substr( 1 ), 'action_enteredtext' );
            addField( oForm, 'hidden', 'action_passfailrftdate', passfailDate.substr( 1 ), 'action_passfailrftdate' );

            actionbuttonscript( 'Sample', 'advancedtoolbar', 'pass', 'submitdata' );
            return true;
        }
    }


    /**
     * AJAX callback to check Date difference and set passSpecimen flag accordingly
     * @param dateDifference
     */
    this.callback_setPassToSpecimen = function ( validdate, dateDifference, operationdate ) {

        if ( validdate == "No" ) {
            sapphire.alert( "The selected date should be greater than In Test Date" );
            return false;
        }
        if ( dateDifference >= 0 ) {
            daysToPass = "OK" + dateDifference;
            passSpecimenFlag = true;
            passFailRFTDate = operationdate;
            return true;
        }
        else {
            passSpecimenFlag = false;
            return false;
        }
    }

    /**
     * This function is used to remove a specimen from test
     */

    this.removeForTest = function () {

        var selectedValues = rightframe.getSelectedDataitems();
        if ( selectedValues == null || selectedValues.length == 0 ) {
            sapphire.alert( "Select atleast one specimen" );
            return false;
        }
        if ( document.getElementById( 'action_intestdate' ) ) {
            var inTestDate = document.getElementById( 'action_intestdate' ).value;
        }
        if ( inTestDate == "" ) {
            sapphire.alert( "In Test Date is needed before removing for test" );
            return false;
        }

        //***************************Added based on Customer feedback, Opening the Date Picker page*******************//

        var oDialog = sapphire.ui.dialog.open( 'Date', 'rc?command=page&page=DatePickerPrompt', true, 390, 300, null );
        oDialog.promptcallback = objDataEntryMaint.checkDateForRFT;
        oDialog.promptcallbackarguments = {'': ''};
        return true;


    }
    /**
     * Modified Remove For RFT functionality based on customer feedback
     * This function is added to calculate the Days to Fail column value for RFT
     * @param oPrompt
     */

    this.checkDateForRFT = function ( oPrompt ) {

        var selectedValues = rightframe.getSelectedDataitems();
        if ( selectedValues == null || selectedValues.length == 0 ) {
            sapphire.alert( "Select atleast one specimen" );
            return false;
        }
        var checkValue = rightframe.getSelectedDataitemsValue( 'enteredtext' ).split( ";" );
        var __selectedValues = selectedValues.split( "%3B" );
        var fixtureId = "";
        var fixtureIds = "";
        var newfixtureIds = "";
        for ( var i = 0; i < __selectedValues.length; i++ ) {

            var _paramid = __selectedValues[i].split( ";" )[5];

            if ( _paramid == "Fixture#" ) {
                fixtureId += ",'" + checkValue[i] + "'";
                fixtureIds += ";" + checkValue[i];

                if ( fixtureId == "" ) {
                    sapphire.alert( "Specimen should be associated with a Fixture before removing from Test." );
                    return false;
                }
            }
        }

        if ( fixtureId.match( "^," ) ) {
            newFixtureId = fixtureId.substring( 1 );
        }
        var sql = sapphire.encrypt( "select status from u_fixture where u_fixtureid in (" + newFixtureId + ")" );
        sapphire.ajax.callClass( "labvantage.custom.alcoa.util.GetSQLData", "objDataEntryMaint.callback_checkFixtureStatus", {sql: sql}, true, true );

        if ( validFixtureStatus ) {
            if ( document.getElementById( 'action_intestdate' ) ) {
                var inTestDate = document.getElementById( 'action_intestdate' ).value;
            }
            sapphire.ajax.callClass( "labvantage.custom.alcoa.ajax.PassFailSpecimenOperationOfDataCard", "objDataEntryMaint.callback_setFailToSpecimen",
                {operationdate: oPrompt.operationdate, intestdate: inTestDate}, true, true );
        }

        if ( failSpecimenFlag ) {

            if ( document.getElementById( 'action_specimenintest' ) ) {
                var specimensInTest = document.getElementById( 'action_specimenintest' ).value;
            }
            if ( document.getElementById( 'action_u_datacardid' ) ) {
                var dataCardId = document.getElementById( 'action_u_datacardid' ).value;
            }
            var specimensInTestFinal = 0;
            checkValue = rightframe.getSelectedDataitemsValue( 'enteredtext' ).split( ";" );
            var sampleid = "";
            var paramlistid = "";
            var paramlistversionid = "";
            var paramlistvariantid = "";
            var dataset = "";
            var paramid = "Pass/Fail;Days To Fail";
            var paramtype = "";
            var replicateid = "";
            var enteredText = "RFT" + ";" + daysToFail;
            var enteredTextFinal = "";
            var paramidFinal = "";
            var newFixtureId = "";
            fixtureIds = "";
            __selectedValues = selectedValues.split( "%3B" );
            var passfailDate = "";
            for ( i = 0; i < __selectedValues.length; i++ ) {

                var _sampleid = __selectedValues[i].split( ";" )[0];
                var _paramlistid = __selectedValues[i].split( ";" )[1];
                var _paramlistversionid = __selectedValues[i].split( ";" )[2];
                var _paramlistvariantid = __selectedValues[i].split( ";" )[3];
                var _dataset = __selectedValues[i].split( ";" )[4];
                _paramid = __selectedValues[i].split( ";" )[5];
                var _paramtype = __selectedValues[i].split( ";" )[6];
                var _replicateid = __selectedValues[i].split( ";" )[7];

                if ( _paramid == "Fixture#" ) {
                    fixtureIds += ";" + checkValue[i];
                }

                sampleid += ";" + _sampleid;
                paramlistid += ";" + _paramlistid;
                paramlistversionid += ";" + _paramlistversionid;
                paramlistvariantid += ";" + _paramlistvariantid;
                dataset += ";" + _dataset;
                paramidFinal += ";" + paramid;
                paramtype += ";" + _paramtype;
                replicateid += ";" + _replicateid;
                enteredTextFinal += ";" + enteredText;
                passfailDate += ";" + passFailRFTDate;
            }

            if ( fixtureIds.match( "^;" ) ) {
                newfixtureIds = fixtureIds.substring( 1 );
            }
            var oForm = document.getElementById( "submitdata" );
            var arrFixtureIds = newfixtureIds.split( ";" );
            var noOfFixtures = arrFixtureIds.length;
            specimensInTestFinal = parseInt( specimensInTest ) - parseInt( noOfFixtures );
            addField( oForm, 'hidden', 'action_keyid1', sampleid.substr( 1 ), 'action_keyid1' );
            addField( oForm, 'hidden', 'action_paramlistid', paramlistid.substr( 1 ), 'action_paramlistid' );
            addField( oForm, 'hidden', 'action_paramlistversionid', paramlistversionid.substr( 1 ), 'action_paramlistversionid' );
            addField( oForm, 'hidden', 'action_variantid', paramlistvariantid.substr( 1 ), 'action_variantid' );
            addField( oForm, 'hidden', 'action_dataset', dataset.substr( 1 ), 'action_dataset' );
            addField( oForm, 'hidden', 'action_paramid', paramidFinal.substr( 1 ), 'action_paramid' );
            addField( oForm, 'hidden', 'action_paramtype', paramtype.substr( 1 ), 'action_paramtype' );
            addField( oForm, 'hidden', 'action_replicateid', replicateid.substr( 1 ), 'action_replicateid' );
            addField( oForm, 'hidden', 'action_enteredtext', enteredTextFinal.substr( 1 ), 'action_enteredtext' );
            addField( oForm, 'hidden', 'action_passfailrftdate', passfailDate.substr( 1 ), 'action_passfailrftdate' );

            addField( oForm, 'hidden', 'action_fixtureid', newfixtureIds, 'action_fixtureid' );

            addField( oForm, 'hidden', 'action_datacardid', dataCardId, 'action_datacardid' );
            addField( oForm, 'hidden', 'action_specimenintest', specimensInTestFinal, 'action_specimenintest' );
            actionbuttonscript( 'Sample', 'advancedtoolbar', 'removefromtest', 'submitdata' );
            return true;
        }

    }


    /**
     * AJAX callback to check Fixture status before doing EditSDI on Fixture to change the status to Unassigned
     * @param dataset
     * @param rows
     * @param columns
     */

    this.callback_checkFixtureStatus = function ( dataset, rows, columns ) {

        if ( dataset == "No data found" || rows == 0 ) {
            sapphire.alert( "No Fixture status is found" );
            return false;
        }
        var notAssignedState = 0;
        for ( var i = 0; i < rows; i++ ) {
            if ( dataset[i].status != "Assigned" ) {
                notAssignedState++;
            }
        }
        if ( notAssignedState == 0 ) {
            validFixtureStatus = true;
            validStatus++;
        }
        else {
            validFixtureStatus = false;
            sapphire.alert( "One or Specimens can be removed only when the Fixture is in Assigned status" );
        }
    }

    /**
     * This function is to check a flag to determine the source (List/Maint) and close the dataentry page accordingly.
     */

    this.dataCardDataEntryClose = function () {

        var pageSourceFlag = document.getElementById( 'action_pagesourceflag' ).value;
        if ( pageSourceFlag == "Maint" ) {

            top.parent.refreshList();
            sapphire.ui.dialog.close( sapphire.ui.dialog.getDialogNumber( window ) );
        }
        else {
            sapphire.ui.dialog.close( sapphire.ui.dialog.getDialogNumber( window ) );
        }

        return true;

    }

    /**
     * this function wil set Fixture Id, Data Card ID and Fixture Type for auto assign fixture operation.
     * @return {boolean}
     */
    this.setPropertyForAssignFixtureOperation = function () {
        var fixturetype = document.getElementById( 'action_fixturetype' ).value;
        var dataCardId = sapphire.page.request.data.param1;
        var fixtureId = "";
        var paramid = "Fixture#";
        var selectedValues = rightframe.getSelectedDataitems();
        if ( selectedValues == null || selectedValues == "" ) {
            sapphire.alert( "Select atleast one specimen" );
            return false;
        }
        var __selectedValues = rightframe.getSelectedDataitems().split( "%3B" );
        var checkValue = rightframe.getSelectedDataitemsValue( 'enteredtext' ).split( ";" );

        for ( var i = 0; i < __selectedValues.length; i++ ) {
            var _paramid = __selectedValues[i].split( ";" )[5];
            if ( _paramid == paramid ) {
                fixtureId = checkValue[i];
                break;
            }
        }
        if ( fixtureId == "" ) {
            sapphire.alert( "Please select Fixture first" );
            return false;
        }

        var oForm = document.getElementById( "submitdata" );
        addField( oForm, 'hidden', 'action_datacardid', dataCardId, 'action_datacardid' );
        addField( oForm, 'hidden', 'action_fixturetype', fixturetype, 'action_fixturetype' );
        addField( oForm, 'hidden', 'action_fixturenumber', fixtureId, 'action_fixturenumber' );

        return true;
    }

}

if ( typeof( objDataEntryMaint ) == 'undefined' ) {
    var objDataEntryMaint = new AT_DataCardDataEntry();
}
