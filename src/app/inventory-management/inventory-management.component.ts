import {Component, OnInit} from '@angular/core';
import {MessageService, SelectItem} from "primeng/api";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {InventoryService} from "../inventory.service";

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css']
})
export class InventoryManagementComponent implements OnInit {

  constructor(private inventoryService: InventoryService, private messageService: MessageService) {
  }

  inventoryList: any;
  inventoryId: number;
  cols: any[];
  enableInventoryPopup: boolean = false;
  showStatusDropdown: boolean = false;
  inventoryModalTitle: string = "Loading..";

  submitted = false;
  statusList: SelectItem[]; // pop up dropdown
  statusListFilter: SelectItem[]; // table filter dropdown
  enableInventoryManagement: boolean = false;
  enableInventoryDeletePopup: boolean = false;

  inventoryForm = new FormGroup({
    laptopSn: new FormControl('', Validators.required),
    powerAdapterSn: new FormControl('', Validators.required),
    status: new FormControl('SPARE')
  });

  get registerFormControl() {
    return this.inventoryForm.controls;
  }

  ngOnInit(): void {
    this.getAllInventories();
    this.cols = [
      {field: 'laptopSn', header: 'Laptop SN'},
      {field: 'powerAdapterSn', header: 'Power Adapter SN'},
      {field: 'status', header: 'Status'}
    ];

    this.statusList = [
      {label: 'SPARE', value: 'SPARE'},
      {label: 'IN_USE', value: 'IN_USE'},
      {label: 'IN_REPAIR', value: 'IN_REPAIR'},
    ];

    this.statusListFilter = [
      {label: 'All', value: null},
      {label: 'SPARE', value: 'SPARE'},
      {label: 'IN_USE', value: 'IN_USE'},
      {label: 'IN_REPAIR', value: 'IN_REPAIR'},
    ];

  }

  private getAllInventories() {
    this.inventoryService.getAllInventories().then((data: Array<any>) => {
      this.inventoryList = data["inventoryList"];
      console.log(this.inventoryList)
    }).catch(data => {
      console.log(data);
    });
  }

  onEditInventoryClicked(rowData) {
    this.inventoryModalTitle = "Edit Inventory"
    this.showStatusDropdown = true;
    console.log(rowData);
    this.inventoryId = rowData.inventoryId;
    const status = {label: rowData.status, value: rowData.status}
    this.inventoryForm.patchValue({
      laptopSn: rowData.laptopSn,
      powerAdapterSn: rowData.powerAdapterSn,
      status: status
    });
    this.enableInventoryPopup = true;
  }

  onAddInventoryClicked() {
    this.showStatusDropdown = false;
    this.inventoryForm.reset();
    this.submitted = false;
    this.inventoryModalTitle = 'Add Inventory';
    this.enableInventoryPopup = true;
  }

  addOrEditInventory() {
    console.log(this.inventoryForm.value);
    this.submitted = true;
    const inventoryRecord = Object.assign({}, this.inventoryForm.value);
    if (this.inventoryModalTitle == 'Add Inventory') {
      this.inventoryService.insertInventory(inventoryRecord).then(data => {
        console.log("inserted");
        this.getAllInventories();
      }).catch(data => {
        console.log(data);
      });
    } else {
      inventoryRecord.id = this.inventoryId;
      this.inventoryService.updateInventory(inventoryRecord).then(data => {
        console.log("updated");
        this.getAllInventories();

      }).catch(data => {
        console.log(data);
      });
    }
    this.enableInventoryPopup = false;

  }

  onAssignInventoryClicked(rowData) {
    this.enableInventoryManagement = true;
  }

  onDeleteInventoryClicked(rowData) {
    this.inventoryId = rowData.inventoryId;
    this.enableInventoryDeletePopup = true
  }

  deleteInventory() {
    const inventoryRecord = {
      inventoryId: this.inventoryId,
    };
    this.inventoryService.deactivateInventory(inventoryRecord).then(data => {
      console.log("updated");
      this.getAllInventories();
      this.enableInventoryDeletePopup = false;
    }).catch(data => {
      console.log(data);
    });
  }
}
