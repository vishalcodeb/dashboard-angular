import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as aws from 'aws-sdk';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private base_url = 'http://3.110.154.209/api/v1/product';

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

  getS3Url(): Observable<any> {
    return this.http.get(`${this.base_url}/getUrl`);
  }

  uploadImageToS3(url: string, file: any): Observable<any> {
    return this.http.put(`${url}`, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}
