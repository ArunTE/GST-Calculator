import {Component, OnInit} from '@angular/core';
import {ProductListService} from './services/product-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  productList = [];
  selectedProducts = [];
  searchTerm: String;
  gstAffects = false;

  constructor(private productListService: ProductListService) {}

  ngOnInit() {
    this.productListService.get().subscribe((response) => {
      this.processProductListFromApi(response);
    });
  }

  processProductListFromApi(apiProductList) {
    let tempProductList = [];
    for (let i = 0; i < apiProductList.length; i++) {
      apiProductList[i]['name'] = apiProductList[i]['product-label'];
      apiProductList[i]['current-spend'] = 0;
      apiProductList[i]['selected'] = false;
      apiProductList[i]['budget-after-gst'] = 0;
      apiProductList[i]['changes'] = 0;

      if (!tempProductList[apiProductList[i]['category-label']]) {
        tempProductList[apiProductList[i]['category-label']] = [];
      } else {
        tempProductList[apiProductList[i]['category-label']].push(apiProductList[i]);
      }
    }
    console.log(tempProductList);

    for (let key in tempProductList) {
      if (tempProductList.hasOwnProperty(key)) {
        this.productList.push({
          title: key,
          data: tempProductList[key]
        });
      }
    }

    console.log(this.productList);
  }

  selectItem(productCode) {
    let cIndex = 0, iIndex = 0;
    for (let i = 0; i < this.productList.length; i++) {
      cIndex = i;
      for (let j = 0; j < this.productList[i].data.length; j++) {
        iIndex = j;
        if (this.productList[i].data[j]['product-code'] === productCode) {
          this.productList[i].data[j].selected = !this.productList[i].data[j].selected;
          break;
        }
      }
      if ((iIndex + 1) < this.productList[i].data.length) {
        break;
      }
    }

    if (this.productList[cIndex].data[iIndex].selected) {
      this.selectedProducts.push(this.productList[cIndex].data[iIndex]);
    } else {
      for (let i = 0; i < this.selectedProducts.length; i++) {
        if (this.selectedProducts[i]['product-code'] === this.productList[cIndex].data[iIndex]['product-code']) {
          this.selectedProducts.splice(i, 1);
          break;
        }
      }
    }
    console.log(this.selectedProducts);
  }

  budgetAfterGst(index) {
    this.selectedProducts[index]['budget-after-gst'] = this.selectedProducts[index]['current-spend'] - ((this.selectedProducts[index]['current-spend'] * this.selectedProducts[index]['old-rate']) / 100) + ((this.selectedProducts[index]['current-spend'] * this.selectedProducts[index]['gst-rate']) / 100);
    return this.selectedProducts[index]['budget-after-gst'];
  }

  gstChanges(index) {
    this.selectedProducts[index]['changes'] = (((this.selectedProducts[index]['current-spend'] - ((this.selectedProducts[index]['current-spend'] * this.selectedProducts[index]['old-rate']) / 100) + ((this.selectedProducts[index]['current-spend'] * this.selectedProducts[index]['gst-rate']) / 100))) - this.selectedProducts[index]['current-spend']) / 100;
    return this.selectedProducts[index]['changes'];
  }

  currentBudgetTotal() {
    let current_budget_total = 0;
    for (let i = 0; i < this.selectedProducts.length; i++) {
      current_budget_total += this.selectedProducts[i]['current-spend'];
    }

    return current_budget_total;
  }

  budgetAfterGSTTotal() {
    let budget_after_gst_total = 0;
    for (let i = 0; i < this.selectedProducts.length; i++) {
      budget_after_gst_total += this.selectedProducts[i]['budget-after-gst'];
    }

    return budget_after_gst_total;
  }

  changesAverage() {
    let changes_total = 0;
    for (let i = 0; i < this.selectedProducts.length; i++) {
      changes_total += this.selectedProducts[i]['changes'];
    }

    return (changes_total / this.selectedProducts.length);
  }

  reset() {
    this.selectedProducts = [];
    for (let i = 0; i < this.productList.length; i++) {
      for (let j = 0; j < this.productList[i].data.length; j++) {
        this.productList[i].data[j].selected = false;
        this.productList[i].data[j]['current-spend'] = 0;
        this.productList[i].data[j]['changes'] = 0;
        this.productList[i].data[j]['budget-after-gst'] = 0;
      }
    }
    this.gstAffects = false;
  }
}
