import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShoppingList, ShoppingListService } from '../../services/shopping-list.service';
@Component({
  selector: 'app-list-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {
  shoppingLists: ShoppingList[] = [];
  filteredLists: ShoppingList[] = [];
  storeFilter: string = '';
  sortBy: string = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  stores: string[] = [];

  constructor(
    private shoppingListService: ShoppingListService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadLists();
  }

  loadLists(): void {
    this.shoppingListService.getLists().subscribe(lists => {
      this.shoppingLists = lists;
      this.filteredLists = [...lists];
      
      // Wyciągnij unikalne nazwy sklepów
      this.stores = [...new Set(lists.map(list => list.store))];
      
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let result = [...this.shoppingLists];
    
    // Filtrowanie wg sklepu
    if (this.storeFilter) {
      result = result.filter(list => list.store === this.storeFilter);
    }
    
    // Sortowanie
    result.sort((a, b) => {
      if (this.sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (this.sortBy === 'store') {
        return this.sortDirection === 'asc' 
          ? a.store.localeCompare(b.store) 
          : b.store.localeCompare(a.store);
      }
      return 0;
    });
    
    this.filteredLists = result;
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  editList(id?: string): void {
    if (id) {
      this.router.navigate(['/edit-list', id]);
    }
  }

  deleteList(id?: string): void {
    if (id) {
      const confirmDelete = confirm('Czy na pewno chcesz usunąć tę listę zakupów?');
      if (confirmDelete) {
        this.shoppingListService.deleteList(id).subscribe(() => {
          this.loadLists();
        });
      }
    }
  }

  toggleItemStatus(listId?: string, itemId?: string, purchased: boolean = false): void {
    if (listId && itemId) {
      this.shoppingListService.updateItem(listId, itemId, !purchased).subscribe(() => {
        this.loadLists();
      });
    }
  }

  deleteItem(listId?: string, itemId?: string): void {
    if (listId && itemId) {
      this.shoppingListService.deleteItem(listId, itemId).subscribe(() => {
        this.loadLists();
      });
    }
  }

  addNewList(): void {
    this.router.navigate(['/new-list']);
  }
}