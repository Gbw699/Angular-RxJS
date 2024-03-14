import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Supplier } from '../../suppliers/supplier';
import { Product } from '../product';

import { ProductService } from '../product.service';
import { EMPTY, catchError, combineLatest, map } from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  errorMessage = '';

  product$ = this.productService.selectedProduct$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  pageTitle$ = this.product$.pipe(
    map((p) => (p ? `Product Detail for: ${p.productName}` : null))
  );

  productSuppliers$ = this.productService.selectedProductSuppliers$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  vm$ = combineLatest([
    this.product$,
    this.pageTitle$,
    this.productSuppliers$,
  ]).pipe(
    map(([product, pageTitle, productSuppliers]) => {
      return { product, pageTitle, productSuppliers };
    })
  );

  constructor(private productService: ProductService) {}
}
