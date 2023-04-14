import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductComponent } from './product/product.component';
import { ProductService } from './services/product.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'dashboard-app';

  displayedColumns: string[] = ['id', 'name', 'price', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private coreService: CoreService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  openProductForm() {
    const dialogRef = this.dialog.open(ProductComponent);
    dialogRef.afterClosed().subscribe({
      next: (val: Boolean) => {
        if (val) this.getProducts();
      },
    });
  }

  getProducts() {
    this.productService.getProductList().subscribe({
      next: (res: any) => {
        console.log('res', res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.coreService.openSnackBar('Product Deleted!','done')
        this.getProducts();
      },
      error: console.log,
    });
  }

  openEditProductForm(data: any) {
    const dialogRef = this.dialog.open(ProductComponent, { data });
    dialogRef.afterClosed().subscribe({
      next: (val: Boolean) => {
        if (val) this.getProducts();
      },
    });
  }
}
