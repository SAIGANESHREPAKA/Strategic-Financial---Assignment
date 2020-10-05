public class JSONGeneratorForLightningComponent {
    
    @AuraEnabled
    Public static ResponseJSONWrapperList getJSONData() {
        List<Document> srList = [select id,Name, Url, Body from Document Where Name = 'BalanceJson'];
        List<ResponseJSONWrapper> wrapList = new List<ResponseJSONWrapper> ();
        if(!srList.isEmpty()){
            Document sr = srList[0];
            String allcontents = sr.body.toString();
            wrapList = (List<ResponseJSONWrapper>) System.JSON.deserialize(allcontents, List<ResponseJSONWrapper>.class);
        }
        ResponseJSONWrapperList wrap = new  ResponseJSONWrapperList ();
        wrap.oldVal = wrapList;
        wrap.newVal = wrapList;
        
        return wrap;
    }
    @AuraEnabled
    Public static ResponseJSONWrapperList  saveJSONValue(String jsonSave) {
        Document  sr = new Document ();
        List<Document> srList = [select id,Name, Url, Body from Document Where Name = 'BalanceJson'];
        if(!srList.isEmpty()){
            sr= srList[0];
            sr.Body=Blob.valueof(jsonSave);
            update sr;
        } else{   
            sr.Body=Blob.valueof(jsonSave);
            sr.Name = 'BalanceJson';
            insert sr;
        }
        List<ResponseJSONWrapper> wrapList = (List<ResponseJSONWrapper>) System.JSON.deserialize(jsonSave, List<ResponseJSONWrapper>.class);
        ResponseJSONWrapperList wrap = new  ResponseJSONWrapperList ();
        wrap.oldVal = wrapList;
        wrap.newVal = wrapList;
        return wrap; 
    }
    Public class ResponseJSONWrapperList {
        @AuraEnabled
        public List<ResponseJSONWrapper> oldVal ;
        @AuraEnabled
        public List<ResponseJSONWrapper> newVal;
    
    }
    Public class ResponseJSONWrapper {
        @AuraEnabled
        public Integer id;
        @AuraEnabled
        public String creditorName;
        @AuraEnabled
        public String firstName;
        @AuraEnabled
        public String lastName;
        @AuraEnabled
        public Decimal minPaymentPercentage;
        @AuraEnabled
        public Decimal balance;
    }
}