"use client";
import { ColumnDirective, ColumnsDirective } from "@syncfusion/ej2-react-grids";
import {
  GridComponent,
  Inject,
  Page,
  Toolbar,
  ExcelExport,
  PdfExport,
  Search,
  DetailRow,
  Sort,
} from "@syncfusion/ej2-react-grids";
// import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function DeviceModelSyncfusion() {
  const router = useRouter();
  let grid;
  const toolbar = ["PdfExport", "Search", "ExcelExport"];
  const [data, setData] = useState([]);

  const toolbarClick = (args) => {
    if (grid && args.item.id === "grid_pdfexport") {
      grid.pdfExport();
    }
    if (grid && args.item.id === "grid_excelexport") {
      grid.excelExport();
    }
  };

  const pageOptions = {
    pageSize: 10,
    pageSizes: true,
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const token = localStorage.getItem("token");
    let tempData = await fetch("http://127.0.0.1:5231/api/DeviceModel/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `bearer ${token}`
      },
    }).then((res) => res.json());
    const length = tempData.length;
    let deviceList = await fetch("http://127.0.0.1:5231/api/DeviceCategory/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `bearer ${token}`
      },
    }).then((res) => res.json());

    for (let i = 0; i < length; i++) {
      let index = deviceList.findIndex((val) => {
        return tempData[i].categoryID == val.id;
      });
      if (index === -1) tempData[i].category = "";
      else tempData[i].category = deviceList[index].categoryName;
    }
    setData(tempData);
  };

  const handleEdit = (id) => {
    router.push("/devices/model/" + id);
  };
  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    confirmAlert({
      message: "Are you sure you want to delete this item?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            fetch("http://127.0.0.1:5231/api/DeviceModel?id=" + id, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `bearer ${token}`
              },
            })
              .then((res) => res.json())
              .then((result) => {
                if (result.state === 1) {
                  getData();
                  toast.success(result.message, {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                } else
                  toast.error(result.message, {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
              });
          },
        },
        {
          label: "No",
          onClick: () => {
            console.log("Canceled");
          },
        },
      ],
    });
  };

  const actionTemplate = (rowData) => {
    return (
      <>
        <button
          className="mr-5 e-edit e-icons"
          onClick={() => handleEdit(rowData.id)}
        ></button>
        <button
          className="e-delete e-icons"
          onClick={() => handleDelete(rowData.id)}
        ></button>
      </>
    );
  };

  const template = (props) => {
    return <div>{actionTemplate(props)}</div>;
  };
  return (
    <div className="py-5 w-full">
      <GridComponent
        id="grid"
        dataSource={data}
        allowPaging={true}
        allowExcelExport={true}
        allowPdfExport={true}
        allowSorting={true}
        height={420}
        toolbar={toolbar}
        toolbarClick={toolbarClick}
        pageSettings={pageOptions}
        ref={(g) => (grid = g)}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="modelNo"
            headerText="ModelNo"
            width="130"
            textAlign="center"
          />
          <ColumnDirective
            field="category"
            headerText="Category"
            width="130"
            textAlign="center"
          />
          <ColumnDirective
            field="modelDescription"
            headerText="Description"
            width="130"
            textAlign="center"
          />
          <ColumnDirective
            field="transmissionType"
            headerText="Type"
            width="130"
            textAlign="center"
          />
          <ColumnDirective
            field="brand"
            headerText="Brand"
            width="130"
            textAlign="center"
          />
          <ColumnDirective
            field="productURL"
            headerText="ProductURL"
            width="130"
            textAlign="center"
          />
          <ColumnDirective
            headerText="Actions"
            width="130"
            textAlign="center"
            template={template}
          />
        </ColumnsDirective>
        <Inject
          services={[
            Page,
            Sort,
            Toolbar,
            Search,
            DetailRow,
            ExcelExport,
            PdfExport,
          ]}
        />
      </GridComponent>
    </div>
  );
}
export default DeviceModelSyncfusion;
