import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ShoppingItem {
  _id?: string;
  name: string;
  purchased: boolean;
}

export interface ShoppingList {
  _id?: string;
  name: string;
  store: string;
  date: Date;
  items: ShoppingItem[];
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private apiUrl = 'http://localhost:3000/api/lists';

  constructor(private http: HttpClient) { }

  getLists(): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(this.apiUrl);
  }

  getList(id: string): Observable<ShoppingList> {
    return this.http.get<ShoppingList>(`${this.apiUrl}/${id}`);
  }

  createList(list: ShoppingList): Observable<ShoppingList> {
    return this.http.post<ShoppingList>(this.apiUrl, list);
  }

  updateList(id: string, list: ShoppingList): Observable<ShoppingList> {
    return this.http.put<ShoppingList>(`${this.apiUrl}/${id}`, list);
  }

  deleteList(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addItem(listId: string, item: ShoppingItem): Observable<ShoppingList> {
    return this.http.post<ShoppingList>(`${this.apiUrl}/${listId}/items`, item);
  }

  updateItem(listId: string, itemId: string, purchased: boolean): Observable<ShoppingList> {
    return this.http.put<ShoppingList>(`${this.apiUrl}/${listId}/items/${itemId}`, { purchased });
  }

  deleteItem(listId: string, itemId: string): Observable<ShoppingList> {
    return this.http.delete<ShoppingList>(`${this.apiUrl}/${listId}/items/${itemId}`);
  }
}