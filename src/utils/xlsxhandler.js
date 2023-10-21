import * as XLSX from 'xlsx'


const LoadFile = (file,callback)=>{
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const workbook = XLSX.read(content, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);
      callback(data);
    };
    reader.readAsBinaryString(file);
}

const GetSuppliers = (rawData,callback)=>{
    const suppliers = rawData.map(row=>{
        if (row.Supplier !== ""){
            return row["Supplier"]
        }
    }).filter(notUndefined => notUndefined !== undefined);
    callback([...new Set(suppliers)])
}

const GetPurchaseOrder = (rawData,supplier,callback)=>{
    const purchaseOrder = rawData.map(row=>{
        if(row.Supplier === supplier ){
            return row["PO Number"]
        }
    }).filter(notUndefined => notUndefined !== undefined);
    callback(purchaseOrder)
}

const GetPurchaseOrderDetails = (rawData,orderID,supplier,callback) =>{
    const purchaseOrderDetails = rawData.map(row=>{
        if(row["PO Number"] === orderID){
            row["Supplier"] = supplier
            return row
        }
    }).filter(notUndefined => notUndefined !== undefined);
    callback(purchaseOrderDetails)
}
export {LoadFile, GetSuppliers,GetPurchaseOrder,GetPurchaseOrderDetails}