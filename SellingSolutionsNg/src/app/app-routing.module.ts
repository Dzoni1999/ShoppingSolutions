import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AllOrdersComponent } from './components/all-orders/all-orders.component';
import { AllProductsComponent } from './components/all-products/all-products.component';
import { CartComponent } from './components/cart/cart.component';
import { CurrentDeliveryComponent } from './components/current-delivery/current-delivery.component';
import { CurrentOrderComponent } from './components/current-order/current-order.component';
import { LoginComponent } from './components/login/login.component';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { OrderHistoryDelivererComponent } from './components/order-history-deliverer/order-history-deliverer.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { PendingOrdersComponent } from './components/pending-orders/pending-orders.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { VerificationComponent } from './components/verification/verification.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AdminGuard } from './guards/admin.guard';
import { CustomerGuard } from './guards/customer.guard';
import { DelivererGuard } from './guards/deliverer.guard';
import { LoggedInGuard } from './guards/loggedIn.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {path: 'home',component: WelcomeComponent,pathMatch: 'full',},
  {path: 'register',component: RegisterComponent,pathMatch: 'full',canActivate: [LoginGuard]},
  {path: 'login',component: LoginComponent,pathMatch: 'full',canActivate: [LoginGuard]},
  {path: 'profile',component: ProfileComponent,pathMatch: 'full',canActivate: [LoggedInGuard]},
  {path: 'deliverers',component: VerificationComponent,pathMatch: 'full',canActivate: [AdminGuard]},
  {path: 'add-product',component: AddProductComponent,pathMatch: 'full',canActivate: [DelivererGuard]},
  {path: 'new-order',component: NewOrderComponent,pathMatch: 'full',canActivate: [CustomerGuard]},
  {path: 'cart',component: CartComponent,pathMatch: 'full',canActivate: [CustomerGuard]},
  {path: 'history',component: OrderHistoryComponent,pathMatch: 'full',canActivate: [CustomerGuard]},
  {path: 'all-products',component: AllProductsComponent,pathMatch: 'full',canActivate: [DelivererGuard]},
  {path: 'all-orders',component: AllOrdersComponent,pathMatch: 'full',canActivate: [AdminGuard]},
  {path: 'history-deliverer',component: OrderHistoryDelivererComponent,pathMatch: 'full',canActivate: [DelivererGuard]},
  {path: 'pending-orders',component: PendingOrdersComponent,pathMatch: 'full',canActivate: [DelivererGuard]},
  {path: 'current-order',component: CurrentOrderComponent,pathMatch: 'full',canActivate: [DelivererGuard]},
  {path: 'current-delivery',component: CurrentDeliveryComponent,pathMatch: 'full',canActivate: [CustomerGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }