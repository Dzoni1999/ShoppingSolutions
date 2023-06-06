import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { NavigationBar1Component } from './components/navigation-bar1/navigation-bar1.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { HttpClientModule} from "@angular/common/http";
import { ProfileComponent } from './components/profile/profile.component';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { SocialLoginModule,SocialAuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { VerificationComponent } from './components/verification/verification.component';   
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ProductService } from './services/product.service';
import { AddProductComponent } from './components/add-product/add-product.component';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { CartComponent } from './components/cart/cart.component';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AllProductsComponent } from './components/all-products/all-products.component';
import { AllOrdersComponent } from './components/all-orders/all-orders.component';
import { OrderHistoryDelivererComponent } from './components/order-history-deliverer/order-history-deliverer.component';
import { PendingOrdersComponent } from './components/pending-orders/pending-orders.component';
import { CurrentOrderComponent } from './components/current-order/current-order.component';
import { CurrentDeliveryComponent } from './components/current-delivery/current-delivery.component';


export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    NavigationBar1Component,
    ProfileComponent,
    VerificationComponent,
    WelcomeComponent,
    AddProductComponent,
    NewOrderComponent,
    CartComponent,
    OrderHistoryComponent,
    AllProductsComponent,
    AllOrdersComponent,
    OrderHistoryDelivererComponent,
    PendingOrdersComponent,
    CurrentOrderComponent,
    CurrentDeliveryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    JwtModule.forRoot(
      {
        config:{
          tokenGetter: tokenGetter,
          allowedDomains: environment.allowedDomains
        }
      }
    ),
    SocialLoginModule
  ],
  providers: [
    UserService,
    ProductService,
    CartService,
    OrderService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('148517665605-jspahbqleats6lvlag9kasc2c11b5g7o.apps.googleusercontent.com')
          }
        ]
      }
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
