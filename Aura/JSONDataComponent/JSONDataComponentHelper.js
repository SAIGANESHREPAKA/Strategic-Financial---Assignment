({
    fetchAccountData : function(component, event, helper) {
        var fetchData = component.get('c.getJSONData');
        console.log('fetchData@@@',fetchData);
        fetchData.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS') {
                var responsVal = response.getReturnValue();
                var totalBalance = 0;
                component.set('v.oldJSONAttribute', responsVal.oldVal);
                component.set('v.JSONAttribute', responsVal.newVal);
                for(var i in  responsVal.newVal){
                    var bal =  responsVal.newVal[i].balance;
                    totalBalance = totalBalance + bal;
                }
                console.log('totalBalance',totalBalance);
                component.set('v.Totalbalance',totalBalance);
            } 
            else {
                console.log('Unable to fetch data from server');
            }
        });
        $A.enqueueAction(fetchData);
    },
    selectAllCheckboxes : function(component, event, helper) {
        console.log(component.get("v.Parentchecked"));var selectedHeaderCheck = event.getSource().get("v.checked");
        var getAllId = component.find("boxPack"); 
        var selectedRow = [];
        if(! Array.isArray(getAllId)){
            component.find("boxPack").set("v.checked", selectedHeaderCheck);
            if(selectedHeaderCheck)selectedRow.push(1) ;
        }else{
            for (var i = 0; i < getAllId.length; i++) {
                getAllId[i].set("v.checked", selectedHeaderCheck);
            if(selectedHeaderCheck)selectedRow.push(i) ;
            }
        } 
    	if(!selectedHeaderCheck)selectedRow =[];
    	component.set("v.selectedRowData", selectedRow);
    },
    AddEmptyRow: function(component, event, helper) {
        var JSONList = component.get("v.JSONAttribute");
        JSONList.push({
            'id': JSONList.length,
            'creditorName': '',
            'firstName': '',
            'lastName': '',
            'minPaymentPercentage': 0,
            'balance': 0 
        });
        component.set("v.JSONAttribute", JSONList);
    },
    AddDataToJSON : function(component, event, helper) {debugger;
        var JSONattributeValue = component.get("v.JSONAttribute");
        var oldJSONattributeValue = component.get("v.oldJSONAttribute");
        var selectedRow = component.get("v.selectedRowData");
        var parentChecked = component.get("v.Parentchecked");
        if(!parentChecked){
            for(var i in selectedRow){console.log('OldJsonvalues---',oldJSONattributeValue[selectedRow[i]], JSONattributeValue[selectedRow[i]].Id)
                if(selectedRow[i]>oldJSONattributeValue.length-1){
                	oldJSONattributeValue.push(JSONattributeValue[selectedRow[i]])
                }
            	else oldJSONattributeValue[selectedRow[i]] = JSONattributeValue[selectedRow[i]];
            }
        }    else{oldJSONattributeValue = JSONattributeValue;}    
        var action = component.get("c.saveJSONValue");
        console.log('action',action);
        console.log('JSONattributeValue',JSON.stringify(oldJSONattributeValue));
        action.setParams({"jsonSave": JSON.stringify(oldJSONattributeValue)});
        action.setCallback(this, function(response) {
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