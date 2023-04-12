import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemsServiceService } from '../services/items-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item } from '../models/item.model';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent {
  categoryList: string[] = ['phone', 'laptop', 'tablet', 'tv'];
  countries = ['China', 'India', 'USA'];

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    shippedFrom: new FormControl('', [Validators.required]),
    date: new FormControl(null, [Validators.required]),
  });

  constructor(
    private itemsServiceService: ItemsServiceService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddItemComponent>,
    private itemsService: ItemsServiceService
  ) {}

  onSave() {
    const postData = {
      id: this.generateUniqueId(),
      title: this.form.value.title,
      description: this.form.value.description,
      category: this.form.value.category,
      price: Number(this.form.value.price),
      shippedFrom: this.form.value.shippedFrom,
      date: this.form.value.date,
    };
    this.itemsServiceService.addItem(postData as Item).subscribe(() => {
      this.dialogRef.close(postData as Item);
      this.snackBar.open('Item added Successfully', 'Dismiss', {
        duration: 3000,
      });
    });
  }

  generateUniqueId() {
    let newId: string;
    let idExists: boolean;
    let existData: string[] = [];

    this.itemsService.getItems().subscribe((res) => {
      res.forEach((item) => existData.push(item.id));
    });

    do {
      newId = (Math.floor(Math.random() * 90000) + 10000).toString();
      idExists = existData.includes(newId);
    } while (idExists);

    return newId;
  }
}
