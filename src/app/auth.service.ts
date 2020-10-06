import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, CanActivate, Router,} from '@angular/router';
import * as firebase from 'firebase';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppUser } from './models/app-user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth, private route: ActivatedRoute, private userService: UserService, private router: Router) {
    this.user$ = afAuth.authState;
  }

  login(){
    let returnURl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnURl);

    this.afAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  logOut(){
    this.afAuth.signOut();
    this.router.navigate([''], {relativeTo: this.route});
  }

  get appUser$() : Observable<AppUser> {
    return this.user$.pipe(switchMap(user => {
      if(user) {
      return this.userService.get(user.uid).valueChanges();
      }
      else return of(null);
    }));
  }
}
