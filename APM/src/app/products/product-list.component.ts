import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  combineLatest,
  map,
} from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';

import { Product } from './product';
import { ProductService } from './product.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';

  private categorySelectedSubject = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$ = combineLatest([
    this.productService.productsWithCategory$,
    this.categorySelectedAction$,
  ]).pipe(
    map(([products, selectedCategoryId]) =>
      products.filter((product) =>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
      )
    ),
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  categories$ = this.productCategoryService.productCategories$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) {}

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
