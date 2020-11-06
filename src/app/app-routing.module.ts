import { NgModule } from "@angular/core";
import { Routes, RouterModule, ExtraOptions } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { UserDetailsComponent } from "./pages/user-details/user-details.component";
import { UsersComponent } from "./pages/users/users.component";
import { HomeComponent } from "./pages/home/home.component";
import { AuthGuard } from "./_guard";
import { ManageProductComponent } from "./pages/manage-product/manage-product.component";
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
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "", component: HomeComponent },
  { path: "manage-products", component: ManageProductComponent },
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
