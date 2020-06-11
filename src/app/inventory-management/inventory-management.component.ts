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
  inventoryHistoryCols: any[];

  enableInventoryPopup: boolean = false;
  enableInventoryDeletePopup: boolean = false;
  showStatusDropdown: boolean = false;

  inventoryModalTitle: string = "Loading..";

  submitted = false;
  statusList: SelectItem[]; // pop up dropdown
  statusListFilter: SelectItem[]; // table filter dropdown

  //Student
  assignedStudent = {};
  enableInventoryAssignment: boolean = false;
  enableInventoryManagement: boolean = false;
  enableInventoryRepair: boolean = false;

  inventoryHistoryList: any[] = [];

  studentList: SelectItem[] = [];

  inventoryForm = new FormGroup({
    laptopSn: new FormControl('', Validators.required),
    powerAdapterSn: new FormControl('', Validators.required),
    statusSelect: new FormControl('SPARE')
  });

  inventoryHistoryForm = new FormGroup({
    comments: new FormControl('')
  });

  inventoryAssignForm = new FormGroup({
    inventory: new FormControl('', Validators.required)
  });

  inventoryRepairForm = new FormGroup({
    comments: new FormControl('', Validators.required)
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
    const statusSelect = {label: rowData.status, value: rowData.status}
    this.inventoryForm.patchValue({
      laptopSn: rowData.laptopSn,
      powerAdapterSn: rowData.powerAdapterSn,
      statusSelect: statusSelect
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
    console.log(inventoryRecord);
    if (this.inventoryModalTitle == 'Add Inventory') {
      this.inventoryService.insertInventory(inventoryRecord).then(data => {
        console.log("inserted");
        this.getAllInventories();
      }).catch(data => {
        console.log(data);
      });
    } else {
      inventoryRecord.status = inventoryRecord.statusSelect.value;
      inventoryRecord.inventoryId = this.inventoryId;
      console.log(inventoryRecord);
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
    console.log(rowData.inventory);
    this.inventoryId = rowData.inventoryId;
    this.assignedStudent = rowData.inventory;
    if(this.assignedStudent == null){
      this.assignedStudent = {netId: '', lastname: '', firstname:'', email:''};
    }
    this.enableInventoryManagement = true;
    this.getInventoryHistory();
  }

  private getInventoryHistory() {
    this.inventoryService.getAllInventoryHistory(this.inventoryId).then(data => {
      this.inventoryHistoryList = data["inventoryHistoryList"];
      console.log(this.inventoryHistoryList);
    }).catch(data => {
      console.log(data);
    });
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

  updateInventoryHistory() {
    const inventoryRecord = Object.assign({}, this.inventoryHistoryForm.value);
    inventoryRecord.inventoryId = this.inventoryId
    this.inventoryService.updateInventoryHistory(inventoryRecord).then(data => {
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Inventory Notes added'});
      this.getInventoryHistory();
      this.inventoryHistoryForm.reset();
    }).catch(data => {
      console.log(data);
    });
  }


  onInventoryAssignNewLaptopClicked() {
    this.enableInventoryRepair = false;
    //get spare inventory list
    this.inventoryService.getAllSpareInventories().then(data => {
      console.log(data["inventoryList"]);
      const spareInvList = data["inventoryList"];
      this.studentList = [];

      for (let inv of spareInvList) {
        inv.label = inv.laptopSn;
        inv.value = inv;
        this.studentList.push(inv);
      }
      console.log(this.studentList);
      this.enableInventoryAssignment = true;

    }).catch(error => {
      console.log(error)
    });
  }


  onInventoryAssignNewLaptopSaved() {
    const inventoryRecord = Object.assign({}, this.inventoryAssignForm.value);
    console.log(inventoryRecord);
    const input = {
      inventoryId: this.inventoryId,
      // inventoryId: inventoryRecord.inventory.inventoryId
    }
    this.assignInventory(input);
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Laptop Assigned'});

  }

  onCloseAssignPopUpClicked() {
    this.getAllInventories();
    this.enableInventoryManagement = false;

  }

  assignInventory(data) {
    this.inventoryService.assignInventory(data).then(r => {
      console.log(r)
    });
  }

  onInventoryRepairClicked() {
    this.enableInventoryRepair = true;
    this.enableInventoryAssignment = false;

  }

  onInventoryRepairSaved() {
    const inventoryRecord = Object.assign({}, this.inventoryRepairForm.value);
    console.log(this.assignedStudent);
    inventoryRecord.inventoryId = this.assignedStudent['studentId'];
    inventoryRecord.status = 'IN_REPAIR';
    console.log(inventoryRecord);

    this.inventoryService.repairInventory(inventoryRecord).then(data => {
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Inventory Updated'});
    }).catch(data => {
      console.log(data);
    });
  }
}
