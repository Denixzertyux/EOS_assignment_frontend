import {inject,Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class LoggedInGuardService {

    private readonly router = inject(Router);

    canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot){
        if (localStorage.getItem('user') != null) {
            return true;
    }
    this.router.navigate(['/login']);
    return false;
    }
}