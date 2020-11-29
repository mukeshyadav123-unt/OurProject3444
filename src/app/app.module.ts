//Imports
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatTabsModule } from "@angular/material/tabs";
import { NgxPaginationModule } from "ngx-pagination";
import { MatSelectModule } from "@angular/material/select";

//providers
import { JwtInterceptor } from "./_helpers/jwt.interceptor";
import { ErrorInterceptor } from "./_helpers/error.interceptor";
import { AuthGuard } from "./_guard";
import { CookieService } from "ngx-cookie-service";

//declarations
import { AppComponent } from "./app.component";
import { UsersComponent } from "./pages/users/users.component";
import { RegisterComponent } from "./pages/register/register.component";
import { TableComponent } from "./fixed/table/table.component";
import { LoginComponent } from "./pages/login/login.component";
import { UserDetailsComponent } from "./pages/user-details/user-details.component";
import { NavbarComponent } from "./fixed/navbar/navbar.component";
import { HomeComponent } from "./pages/home/home.component";
import { ManageProductComponent } from "./pages/manage-product/manage-product.component";
import { CartComponent } from './pages/cart/cart.component';
import { FavouritesComponent } from './pages/favourites/favourites.component';
import { ProductComponent } from './pages/product/product.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    TableComponent,
    UserDetailsComponent,
    NavbarComponent,
    HomeComponent,
    ManageProductComponent,
    CartComponent,
    FavouritesComponent,
    ProductComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    HttpClientModule,
    MatButtonModule,
    MatTabsModule,
    NgxPaginationModule,
    MatSelectModule,
  ],
  providers: [
    CookieService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
