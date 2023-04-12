import { Component, ViewChild } from '@angular/core';
import { ItemsServiceService } from '../services/items-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Item } from '../models/item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddItemComponent } from '../add-item/add-item.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-display-items',
  templateUrl: './display-items.component.html',
  styleUrls: ['./display-items.component.scss'],
})
export class DisplayItemsComponent {
  public items!: Item[];
  isEdit = false;
  editItemId!: string;
  editItem!: any;
  dataSource!: MatTableDataSource<Item>;

  displayedColumns: string[] = [
    'id',
    'title',
    'description',
    'category',
    'price',
    'shippedFrom',
    'date',
    'action',
  ];
  categoryList: string[] = ['phone', 'laptop', 'tablet', 'tv'];
  countries = ['China', 'India', 'USA'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    shippedFrom: new FormControl('', [Validators.required]),
    date: new FormControl(null, [Validators.required]),
  });

  constructor(
    private itemsService: ItemsServiceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this.itemsService.getItems().subscribe({
      next: (res) => {
        this.isEdit = false;
        this.items = res;
        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.snackBar.open('Oopz Something went wrong!!', 'Dismiss', {
          duration: 3000,
        });
      },
    });
  }

  onEdit(id: string) {
    this.isEdit = true;
    this.editItemId = id;

    const item = this.dataSource.data.find((item) => item.id === id);
    this.editItem = { ...item };

    this.itemsService.getItemById(id).subscribe({
      next: (res) => {
        const item = res;
        this.form.patchValue({
          title: item.title,
          category: item.category,
          description: item.description,
          price: item.price.toString(),
          shippedFrom: item.shippedFrom,
          date: item.date,
        });
      },
      error: () => {
        this.isEdit = false;
        this.snackBar.open('Oopz Something went wrong!!', 'Dismiss', {
          duration: 3000,
        });
      },
    });
  }

  onSave(id: string) {
    const postData = {
      id: id,
      title: this.form.value.title,
      description: this.form.value.description,
      category: this.form.value.category,
      price: Number(this.form.value.price),
      shippedFrom: this.form.value.shippedFrom,
      date: this.form.value.date,
    };
    this.itemsService.updateItem(postData as Item, id).subscribe({
      next: () => {
        this.isEdit = false;
        this.getItems();
        this.snackBar.open('Item Saved Successfully', 'Dismiss', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackBar.open('Oopz Something went wrong!!', 'Dismiss', {
          duration: 3000,
        });
      },
    });
  }

  deleteItem(id: string) {
    console.log(id);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: { message: 'Are you sure you want to delete this item?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemsService.deleteItem(id).subscribe({
          next: () => {
            this.getItems();
            this.snackBar.open('Successfully Deleted', 'Dismiss', {
              duration: 3000,
            });
          },
          error: () => {
            this.snackBar.open('Oopz Something went wrong!!', 'Dismiss', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  addItem() {
    const dialogRef = this.dialog.open(AddItemComponent, {
      maxWidth: '600px',
      width: '85vw',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getItems();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
