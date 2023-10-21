"use client";
import { GetPurchaseOrder, GetPurchaseOrderDetails, GetSuppliers, LoadFile } from "@/utils/xlsxhandler";
import {
  FileInput,
  Label,
  TextInput,
  Datepicker,
  Select,
  Button,
  Table
} from "flowbite-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
export default function Home() {
  const [file, setFile] = useState(null);
  const [fileIsProcessing, setFileIsProcessing] = useState(false)
  const [rawData, setRawData] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [purchaseOrder, setPurchaseOrder] = useState([])
  const [formData, setFormData] = useState({
    "name": "",
    "startTime": "",
    "endTime": "",
    "hours": "",
    "rate": "",
    "supplier": "",
    "purchaseOrder": ""
  })
  const [tableData, setTableData] = useState([])
  const [tableHeaders, setTableHeaders] = useState(["Name", "Start Time", "End Time", "Hours", "Rate", "Supplier", "Purchase Order", "Description"])
  const [isTableDataProcessing, setIsTableDataProcessing] = useState(false)
  const handleFileInput = (e) => {
    if (e.target.files.length > 0) {
      if (e.target.files[0]["name"].split(".")[1] === "xlsx" || e.target.files[0]["name"].split(".")[1] === "xls") {
        setFile(e.target.files[0])
      }
    } else {
      setFile(null)
    }
  }
  const handleFormInput = (e) => {
    setFormData(prevs => { return { ...prevs, [e.target.id]: e.target.value } })
  }
  const handleStartDateInput = (e) => {
    setFormData(prevs => { return { ...prevs, startTime: e.toString() } })
  }
  const handleEndDateInput = (e) => {
    setFormData(prevs => { return { ...prevs, endTime: e.toString() } })
  }
  const handleFormSubmit = () => {
    GetPurchaseOrderDetails(rawData, formData.purchaseOrder,formData.supplier, (data) => {
      setTableData(data)
    })
  }
  useEffect(() => {
    if (file !== null) {
      setFileIsProcessing(true)
      LoadFile(file, (data) => {
        setRawData(data)
      })
      setFileIsProcessing(false)
    }
  }, [file])
  useEffect(() => {
    GetSuppliers(rawData, (data) => {
      setSuppliers(data)
    })
  }, [rawData])
  useEffect(() => {
    GetPurchaseOrder(rawData, formData.supplier, (data) => {
      setPurchaseOrder(data)
    })
  }, [formData.supplier])

  return (
    <div className="flex flex-col justify-center justify-items-center">
      <div id="heading" className="px-5 mb-2">
        <h2 className="text-4xl font-bold dark:text-white">Async Task</h2>
      </div>
      <div id="fileInput" className="flex items-center gap-3 px-5">
        <div className="max-w-md" id="fileUpload">
          <div className="mb-2 block">
            <Label htmlFor="file" value="Upload xlsx file" />
          </div>
          <FileInput onChange={handleFileInput} helperText="Open xlsx file." id="file" accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" />
        </div>
        <div>
          {file === null ? "" : fileIsProcessing ? <p className="mb-2 block">Processing...</p> : <p className="mb-2 block">File Loaded!</p>}
        </div>
      </div>
      <div id="formInput" className="grid grid-cols-5 gap-3 w-full px-5">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name" value="Name" />
          </div>
          <TextInput onChange={handleFormInput} id="name" sizing="md" type="text" />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="startTime" value="Start Time" />
          </div>
          <Datepicker id="startTime" onSelectedDateChanged={handleStartDateInput} />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="endTime" value="End Time" />
          </div>
          <Datepicker onSelectedDateChanged={handleEndDateInput} id="endTime" />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="hours" value="No. of hours worked" />
          </div>
          <TextInput onChange={handleFormInput} id="hours" sizing="md" type="text" />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="rate" value="Rate per hour" />
          </div>
          <TextInput onChange={handleFormInput} id="rate" sizing="md" type="text" />
        </div>
        <div id="select">
          <div className="mb-2 block">
            <Label htmlFor="supplier" value="Select your Supplier" />
          </div>
          <Select value={formData.supplier} onChange={handleFormInput} id="supplier" required>
            <option value={-1} defaultValue={true}>select supplier</option>
            {
              suppliers.length > 0 && suppliers.map(value => {
                return (
                  <option key={uuidv4()} value={value}>{value}</option>
                )
              })
            }
          </Select>
        </div>
        <div id="select">
          <div className="mb-2 block">
            <Label
              htmlFor="purchaseOrder"
              value="Select your Purchase Order"
            />
          </div>
          <Select value={formData.purchaseOrder} onChange={handleFormInput} id="purchaseOrder" required>
            <option value={-1} defaultValue={true}>select Purchase Order</option>
            {
              purchaseOrder.length > 0 && purchaseOrder.map(value => {
                return (
                  <option key={uuidv4()} value={value}>{value}</option>
                )
              })
            }
          </Select>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="" value="&nbsp;" />
          </div>
          <Button onClick={handleFormSubmit} >Search</Button>
        </div>
      </div>
      <div id="dataTable" className="my-5 p-4">
        <Table striped>
          <Table.Head>
            {
              tableHeaders.map(value => {
                return (
                  <Table.HeadCell key={uuidv4()}>
                    {value}
                  </Table.HeadCell>
                )
              })
            }
          </Table.Head>
          <Table.Body className="divide-y">
            {
              tableData.length > 0 && tableData.map(value => {
                return (
                  <>
                    <Table.Row key={uuidv4()} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell key={uuidv4()} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {formData.name}
                      </Table.Cell>
                      <Table.Cell key={uuidv4()}>
                        {formData.startTime}
                      </Table.Cell>
                      <Table.Cell key={uuidv4()}>
                        {formData.endTime}
                      </Table.Cell>
                      <Table.Cell key={uuidv4()}>
                        {formData.hours}
                      </Table.Cell>
                      <Table.Cell key={uuidv4()}>
                        {formData.rate}
                      </Table.Cell>
                      <Table.Cell key={uuidv4()}>
                        {value.Supplier}
                      </Table.Cell>
                      <Table.Cell key={uuidv4()}>
                        {value["PO Number"]}
                      </Table.Cell>
                      <Table.Cell key={uuidv4()}>
                        {value.Description}
                      </Table.Cell>
                    </Table.Row>
                  </>)
              })
            }
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
