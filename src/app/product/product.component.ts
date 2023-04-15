import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  productForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private coreService: CoreService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.productForm.patchValue(this.data);
  }

  onFormSubmit() {
    if (this.productForm.valid) {
      if (this.data) {
        console.log(this.productForm.value);
        this.productService
          .updateProduct(this.data.id, this.productForm.value)
          .subscribe({
            next: (val: any) => {
              this.coreService.openSnackBar('Product Updated!', 'done');
              this.dialogRef.close(true);
            },
            error: (err: any) => {
              console.log('Error', err);
            },
          });
      } else {
        console.log(this.productForm.value);
        this.productService.addProduct(this.productForm.value).subscribe({
          next: (val: any) => {
            this.coreService.openSnackBar('Product Added!', 'done');
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.log('Error', err);
          },
        });
      }
    }
  }
}
