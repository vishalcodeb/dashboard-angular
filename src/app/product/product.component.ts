import { Component, Inject, Input, OnInit, VERSION } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
      sku: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', Validators.required],
      imgUrl: [''],
    });
  }

  ngOnInit(): void {
    this.productForm.patchValue(this.data);
  }

  async onFormSubmit() {
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
        console.log('this.productForm.value', this.productForm.value);
        this.productForm.value.imgUrl =
          this.productForm.value.imgUrl.split('?')[0];

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

  getFileOnLoad(event: any, test: string) {
    const file = event.target.files[0];
    console.log('file', file);
    let imgUrl;

    const element = document.getElementById(
      'fileInput'
    ) as HTMLInputElement | null;

    if (element != null) {
      element.value = file?.name;

      this.productService.getS3Url().subscribe({
        next: (val: any) => {
          imgUrl = val.data;
          this.productService.uploadImageToS3(imgUrl, element.value).subscribe({
            next: (val: any) => {
              this.productForm.value.imgUrl = val.data;
              console.log(
                'this.productForm.value.imgUrl',
                this.productForm.value.imgUrl
              );
            },
            error: (err: Error) => {
              console.log('s3 error ', err);
            },
          });
        },
        error: (err: any) => {
          console.log('Error', err);
        },
      });
    }
  }
}
