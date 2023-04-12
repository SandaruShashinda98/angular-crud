import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemsServiceService {
  private baseUrl: string = 'http://localhost:3000/items';

  constructor(private http: HttpClient) {}

  addItem(item: Item) {
    return this.http.post<Item>(`${this.baseUrl}`, item);
  }

  getItems() {
    return this.http.get<Item[]>(`${this.baseUrl}`);
  }

  updateItem(item: Item, id: string) {
    return this.http.put<Item>(`${this.baseUrl}/${id}`, item);
  }

  deleteItem(id: string) {
    return this.http.delete<Item>(`${this.baseUrl}/${id}`);
  }

  getItemById(id: string) {
    return this.http.get<Item>(`${this.baseUrl}/${id}`);
  }
}
