import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { UserDetailsComponent } from "./pages/user-details/user-details.component";
import { UsersComponent } from "./pages/users/users.component";
import { AuthGuard } from "./_guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "register",
    pathMatch: "full",
  },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
