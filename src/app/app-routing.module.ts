import { NgModule } from "@angular/core";
import { Routes, RouterModule, ExtraOptions } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { UserDetailsComponent } from "./pages/user-details/user-details.component";
import { UsersComponent } from "./pages/users/users.component";
import { HomeComponent } from "./pages/home/home.component";
import { AuthGuard } from "./_guard";
import { ManageProductComponent } from "./pages/manage-product/manage-product.component";
import { CartComponent } from "./pages/cart/cart.component";
import { FavouritesComponent } from "./pages/favourites/favourites.component";
import { ProductComponent } from "./pages/product/product.component";
import { ManageOrdersComponent } from "./pages/manage-orders/manage-orders.component";
import { OrdersComponent } from "./pages/orders/orders.component";
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: "enabled",
  anchorScrolling: "enabled",
  scrollOffset: [0, 64],
};

const routes: Routes = [
  // {
  //   path: "",
  //   redirectTo: "/",
  //   pathMatch: "full",
  // },
  {
    path: "favourites",
    component: FavouritesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "products/:id",
    component: ProductComponent,
    canActivate: [AuthGuard],
  },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "cart", component: CartComponent, canActivate: [AuthGuard] },
  { path: "", component: HomeComponent, canActivate: [AuthGuard] },

  {
    path: "manage-products",
    component: ManageProductComponent,
    canActivate: [AuthGuard],
    data: { roles: "admin" },
  },
  {
    path: "profile",
    component: UserDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "users",
    canActivate: [AuthGuard],
    component: UsersComponent,
    data: { roles: "admin" },
  },
  {
    path: "manage-orders",
    component: ManageOrdersComponent,
    canActivate: [AuthGuard],
    data: { roles: "admin" },
  },
  {
    path: "orders",
    component: OrdersComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
