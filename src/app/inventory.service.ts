import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private baseUrl = 'http://localhost:8080';

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
}
