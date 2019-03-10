/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2018, The ComiXed Project
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.package
 * org.comixed;
 */

import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Router } from "@angular/router";
import { Store, Action } from "@ngrx/store";
import { AppState } from "./app.state";
import { Observable, Subject } from "rxjs";
import * as UserActions from "./actions/user.actions";
import { filter } from "rxjs/operators";
import { User } from "./models/user/user";

@Injectable()
export class ReaderGuard implements CanActivate {
  user: User;
  reader_subject = new Subject<boolean>();

  constructor(private router: Router, private store: Store<AppState>) {
    store.select("user").subscribe((user: User) => {
      this.user = user;

      if (
        this.user.initialized &&
        !this.user.authenticating &&
        !this.user.fetching
      ) {
        this.reader_subject.next(this.user.is_reader);
      }
    });
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // if the user auth check hasn't completed, return a promise
    if (this.user.initialized) {
      if (this.user.authenticated) {
        return this.user.is_reader;
      } else {
        this.router.navigate(["/home"]);
        return false;
      }
    } else {
      this.store.dispatch(new UserActions.UserAuthCheck());
      return this.reader_subject;
    }
  }
}