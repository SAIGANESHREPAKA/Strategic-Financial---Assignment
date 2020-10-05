({
    doInit : function(component, event, helper) {
        helper.fetchAccountData(component, event, helper);
    },
    
    selectAll: function(component, event, helper) {
        helper.selectAllCheckboxes(component, event, helper);
    },
    
    addRow: function(component, event, helper) {
        helper.AddEmptyRow(component, event, helper);
    },
    
    addDebt:  function(component, event, helper) {
        helper.AddDataToJSON(component, event, helper);
    },
    //Process the selected Row
    handleSelectedRow: function(component, event, helper) {debugger;
        var accProList = component.get("v.JSONAttribute");
        console.log('accProList.length',accProList.length);
        console.log('accProList.length',event.getSource().get("v.checked"));
        var selectedRow = [];
        var checkedVal = event.getSource().get("v.checked");
        var currentEvnt = event.getSource().get("v.name");
        selectedRow = component.get("v.selectedRowData");
        if($A.util.isUndefined(selectedRow)){
            selectedRow = [];
        }    
        if(checkedVal){
            if(!$A.util.isUndefined(currentEvnt) ){
                var accList = currentEvnt.split('_');
                selectedRow.push(parseInt(accList[0]));
            }
        }else{
    		if(!$A.util.isUndefined(currentEvnt)){
                var accList = currentEvnt.split('_');
                for(var i in selectedRow){
                    if(selectedRow[i] === parseInt(accList[0])){
                		selectedRow.splice(i, 1);
                	}
                }
            }
    	}
        if(selectedRow.length === accProList.length){component.set("v.Parentchecked", true)}else{component.set("v.Parentchecked", false)}
    	component.set("v.selectedRowData", selectedRow);
    },
    
    // function for delete the row 
    removeDebt: function(component, event, helper) {debugger;
        var newJSONattributeValue = [];
        var JSONattributeValue = component.get("v.oldJSONAttribute");
        var selectedRow = component.get("v.selectedRowData");
        var totalBalance = 0;
        var parentChecked = component.get("v.Parentchecked");
		if(!parentChecked){
            for(var i in JSONattributeValue){
                if(!selectedRow.includes(parseInt(i))){
                    newJSONattributeValue.push(JSONattributeValue[i]);
                }
            }
        }    else{newJSONattributeValue = []}  
        console.log('JSONattributeValue',JSON.stringify(newJSONattributeValue));
        var action = component.get("c.saveJSONValue");
        action.setParams({"jsonSave": JSON.stringify(newJSONattributeValue)});
        action.setCallback(this, function(response) {debugger;
            var state = response.getState();
            if(state === 'SUCCESS') {
                var responsVal = response.getReturnValue();
                var totalBalance = 0;
                component.set('v.oldJSONAttribute', responsVal.oldVal);
                component.set('v.JSONAttribute', responsVal.newVal);
                for(var i in responsVal.newVal){
                    var bal = responsVal.newVal[i].balance;
                    totalBalance = totalBalance + bal;
                }
                console.log('totalBalance',totalBalance);
                component.set('v.Totalbalance',totalBalance);
                component.set("v.selectedRowData",[]);component.set("v.Parentchecked", false);
            } 
            else {
                console.log('Unable to fetch data from server');
            }
        });
        
        $A.enqueueAction(action);
    }
})