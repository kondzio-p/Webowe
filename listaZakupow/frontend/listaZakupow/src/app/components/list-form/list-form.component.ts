import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingListService } from '../../services/shopping-list.service';

@Component({
  selector: 'app-list-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.css']
})
export class ListFormComponent implements OnInit {
  listForm: FormGroup;
  editMode = false;
  listId: string = '';
  newItemName = '';

  constructor(
    private fb: FormBuilder,
    private shoppingListService: ShoppingListService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.listForm = this.fb.group({
      name: ['', Validators.required],
      store: ['', Validators.required],
      date: [this.formatDate(new Date()), Validators.required],
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editMode = true;
        this.listId = params['id'];
        this.loadList(this.listId);
      }
    });
  }

  // Helper do formatowania daty dla pola input[type="date"]
  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) 
      month = '0' + month;
    if (day.length < 2) 
      day = '0' + day;

    return [year, month, day].join('-');
  }

  loadList(id: string): void {
    this.shoppingListService.getList(id).subscribe(list => {
      this.listForm.patchValue({
        name: list.name,
        store: list.store,
        date: this.formatDate(new Date(list.date))
      });

      // Resetuj items FormArray
      while (this.items.length) {
        this.items.removeAt(0);
      }

      // Dodaj każdy element do FormArray
      list.items.forEach(item => {
        this.items.push(this.fb.group({
          _id: [item._id],
          name: [item.name, Validators.required],
          purchased: [item.purchased]
        }));
      });
    });
  }

  get items() {
    return this.listForm.get('items') as FormArray;
  }

  addItem(): void {
    if (this.newItemName.trim()) {
      this.items.push(this.fb.group({
        name: [this.newItemName, Validators.required],
        purchased: [false]
      }));
      this.newItemName = '';
    }
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  togglePurchased(index: number): void {
    const control = this.items.at(index).get('purchased');
    if (control) {
      const currentValue = control.value;
      control.setValue(!currentValue);
    }
  }

  onSubmit(): void {
    if (this.listForm.valid) {
      const formData = this.listForm.value;
      
      if (this.editMode) {
        this.shoppingListService.updateList(this.listId, formData).subscribe(() => {
          this.router.navigate(['/']);
        });
      } else {
        this.shoppingListService.createList(formData).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}