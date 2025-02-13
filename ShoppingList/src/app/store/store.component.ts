import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-store',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent implements OnInit {
  stores: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStores();
  }

  // Pobierz wszystkie sklepy
  loadStores() {
    this.http.get('http://localhost:3000/stores').subscribe((data: any) => {
      this.stores = data;
    });
  }

  // Dodaj nowy sklep
  addStore() {
    const storeName = prompt('Enter store name:');
    if (storeName) {
      const newStore = { name: storeName, products: [], id: this.stores.length + 1 };
      this.http.post('http://localhost:3000/stores', newStore).subscribe(() => {
        this.loadStores();
      });
    }
  }

  // Usuń sklep
  removeStore(storeId: number) {
    this.http.delete(`http://localhost:3000/stores/${storeId}`).subscribe(() => {
      this.loadStores();
    });
  }

  // Dodaj produkt do sklepu
  addProduct(storeId: number) {
    const productName = prompt('Enter product name:');
    if (productName) {
      const store = this.stores.find(store => store.id === storeId);
      if (store) {
        store.products.push(productName);
        this.http.put(`http://localhost:3000/stores/${storeId}`, store).subscribe(() => {
          this.loadStores();
        });
      }
    }
  }

  // Usuń produkt ze sklepu
  removeProduct(storeId: number, productIndex: number) {
    const store = this.stores.find(store => store.id === storeId);
    if (store) {
      store.products.splice(productIndex, 1);
      this.http.put(`http://localhost:3000/stores/${storeId}`, store).subscribe(() => {
        this.loadStores();
      });
    }
  }
}