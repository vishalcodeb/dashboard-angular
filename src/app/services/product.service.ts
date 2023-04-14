import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private base_url = 'http://localhost:3000/product';

  constructor(private http: HttpClient) {}

  addProduct(data: any): Observable<any> {
    return this.http.post(this.base_url, data);
  }

  getProductList() {
    return this.http.get(this.base_url);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.base_url}/${id}`);
  }

  updateProduct(id: any, data: any): Observable<any> {
    return this.http.put(`${this.base_url}/${id}`, data);
  }
}
