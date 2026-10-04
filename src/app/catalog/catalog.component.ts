import {
  Component,
  OnInit,
  inject,
  signal,
  computed, afterNextRender
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../products.service';
import {Meta, Title} from '@angular/platform-browser';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'title';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  private readonly productService = inject(ProductService);

  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  hydrated = false;

  constructor() {
    afterNextRender(() => {
      this.hydrated = true;
    });
  }

  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal('');

  searchQuery = signal('');
  maxPrice = signal<number | null>(null);
  sortOption = signal<SortOption>('default');

  filteredProducts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const max = this.maxPrice();
    const sort = this.sortOption();

    let result = this.products().filter(product => {
      const matchesName = product.title
        .toLowerCase()
        .includes(query);

      const matchesPrice = max === null || product.price <= max;

      return matchesName && matchesPrice;
    });

    switch (sort) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;

      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;

      case 'title':
        result = [...result].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;
    }

    return result;
  });

  ngOnInit(): void {
    this.titleService.setTitle('Каталог товаров');

    this.metaService.updateTag({
      name: 'description',
      content: 'Каталог товаров с поиском и фильтрацией'
    });
    this.productService.getProducts().subscribe({
      next: response => {
        this.products.set(response.products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Не удалось загрузить товары');
        this.loading.set(false);
      }
    });
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  onMaxPriceChange(value: string): void {
    this.maxPrice.set(value === '' ? null : Number(value));
  }

  onSortChange(value: string): void {
    this.sortOption.set(value as SortOption);
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.maxPrice.set(null);
    this.sortOption.set('default');
  }
}
