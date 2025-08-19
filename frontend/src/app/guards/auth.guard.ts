import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { TokenService } from "app/services/token.service";

export const authGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
) => {
  const router = inject(Router)
  const token = inject(TokenService).get();
  if (token != null) {
    return true
  }

  return router.createUrlTree(['/login']);
}
