import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {

  orders: Array<any>;
  error: string;

  constructor(private orderService: OrderService) { }
  
    ngOnInit(id: number) {
      this.orderService.getOrders(id)
        .subscribe(
        data => this.orders = data,
        error => this.error = error.statusText
        );
    }

    approve(clientId: any, productId: any, amount: any) {
      this.orderService.buy(clientId, productId, amount)
      .subscribe(
        data => this.orders = this.orders.filter(i => i.productId !== productId),
        error => this.error = error.statusText
      );
    }
}
