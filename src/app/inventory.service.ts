import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private baseUrl = 'https://dls-inventory-app.herokuapp.com';

  constructor(private http:HttpClient) {

  }

  async getAllInventories() {
    const inventoryData = await this.http.get(this.baseUrl+'/api/v1/inventory-controller/getAllInventory').toPromise();
    return inventoryData;
  }

  async getAllSpareInventories() {
    const inventoryData = await this.http.get(this.baseUrl+'/api/v1/inventory-controller/getAllSpareInventory').toPromise();
    return inventoryData;
  }

  async updateInventory(data: object) {
    return await this.http.post(this.baseUrl + '/api/v1/inventory-controller/updateInventory', data).toPromise();
  }

  async insertInventory(data: object) {
    return await this.http.post(this.baseUrl + '/api/v1/inventory-controller/insertInventory', data).toPromise();
  }

  async deactivateInventory(data: object) {
    return await this.http.post(this.baseUrl + '/api/v1/inventory-controller/deactivateInventory', data).toPromise();
  }

  async repairInventory(data: object) {
    return await this.http.post(this.baseUrl + '/api/v1/inventory-controller/repairInventory', data).toPromise();
  }

  // async isInventoryInUse(data: object) {
  //   return await this.http.post(this.baseUrl + '/api/v1/inventory-controller/isInventoryInUse', data).toPromise();
  // }
  //
  // async assignInventory(data: object) {
  //   return await this.http.post(this.baseUrl + '/api/v1/inventory-controller/assignInventory', data).toPromise();
  // }

  async updateInventoryHistory(data: object) {
    return await this.http.post(this.baseUrl + '/api/v1/inventory-controller/updateInventoryHistory', data).toPromise();
  }

  async getAllInventoryHistory(inventoryId: number) {
    return await this.http.get(this.baseUrl + '/api/v1/inventory-controller/getAllInventoryHistory/' + inventoryId).toPromise();
  }
}
