/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2021, The ComiXed Project
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
 * along with this program. If not, see <http://www.gnu.org/licenses>
 */

import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { ComicEffects } from './comic.effects';
import { ComicService } from '@app/comic-books/services/comic.service';
import { AlertService } from '@app/core/services/alert.service';
import { COMIC_2 } from '@app/comic-books/comic-books.fixtures';
import {
  comicLoaded,
  comicUpdated,
  loadComic,
  loadComicFailed,
  pageDeletionUpdated,
  pageOrderSaved,
  savePageOrder,
  savePageOrderFailed,
  updateComic,
  updateComicFailed,
  updatePageDeletion,
  updatePageDeletionFailed
} from '@app/comic-books/actions/comic.actions';
import { hot } from 'jasmine-marbles';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { LoggerModule } from '@angular-ru/cdk/logger';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PAGE_1 } from '@app/comic-pages/comic-pages.fixtures';

describe('ComicEffects', () => {
  const COMIC = COMIC_2;
  const PAGE = PAGE_1;
  const DELETED = Math.random() > 0.5;

  let actions$: Observable<any>;
  let effects: ComicEffects;
  let comicService: jasmine.SpyObj<ComicService>;
  let alertService: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerModule.forRoot(),
        TranslateModule.forRoot(),
        MatSnackBarModule
      ],
      providers: [
        ComicEffects,
        provideMockActions(() => actions$),
        {
          provide: ComicService,
          useValue: {
            loadOne: jasmine.createSpy('ComicService.loadOne()'),
            updateOne: jasmine.createSpy('ComicService.updateOne()'),
            updatePageDeletion: jasmine.createSpy(
              'ComicService.updatePageDeletion()'
            ),
            savePageOrder: jasmine.createSpy('ComicService.savePageOrder()')
          }
        },
        AlertService
      ]
    });

    effects = TestBed.inject(ComicEffects);
    comicService = TestBed.inject(ComicService) as jasmine.SpyObj<ComicService>;
    alertService = TestBed.inject(AlertService);
    spyOn(alertService, 'error');
    spyOn(alertService, 'info');
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loading a single comic', () => {
    it('fires an action on success', () => {
      const serviceResponse = COMIC;
      const action = loadComic({ id: COMIC.id });
      const outcome = comicLoaded({ comic: COMIC });

      actions$ = hot('-a', { a: action });
      comicService.loadOne.and.returnValue(of(serviceResponse));

      const expected = hot('-b', { b: outcome });
      expect(effects.loadOne$).toBeObservable(expected);
    });

    it('fires an action on service failure', () => {
      const serviceResponse = new HttpErrorResponse({});
      const action = loadComic({ id: COMIC.id });
      const outcome = loadComicFailed();

      actions$ = hot('-a', { a: action });
      comicService.loadOne.and.returnValue(throwError(serviceResponse));

      const expected = hot('-b', { b: outcome });
      expect(effects.loadOne$).toBeObservable(expected);
      expect(alertService.error).toHaveBeenCalledWith(jasmine.any(String));
    });

    it('fires an action on general failure', () => {
      const action = loadComic({ id: COMIC.id });
      const outcome = loadComicFailed();

      actions$ = hot('-a', { a: action });
      comicService.loadOne.and.throwError('expected');

      const expected = hot('-(b|)', { b: outcome });
      expect(effects.loadOne$).toBeObservable(expected);
      expect(alertService.error).toHaveBeenCalledWith(jasmine.any(String));
    });
  });

  describe('saving a single comic', () => {
    it('fires an action on success', () => {
      const serviceResponse = COMIC;
      const action = updateComic({ comic: COMIC });
      const outcome = comicUpdated({ comic: COMIC });

      actions$ = hot('-a', { a: action });
      comicService.updateOne.and.returnValue(of(serviceResponse));

      const expected = hot('-b', { b: outcome });
      expect(effects.saveOne$).toBeObservable(expected);
      expect(alertService.info).toHaveBeenCalledWith(jasmine.any(String));
    });

    it('fires an action on service failure', () => {
      const serviceResponse = new HttpErrorResponse({});
      const action = updateComic({ comic: COMIC });
      const outcome = updateComicFailed();

      actions$ = hot('-a', { a: action });
      comicService.updateOne.and.returnValue(throwError(serviceResponse));

      const expected = hot('-b', { b: outcome });
      expect(effects.saveOne$).toBeObservable(expected);
      expect(alertService.error).toHaveBeenCalledWith(jasmine.any(String));
    });

    it('fires an action on general failure', () => {
      const action = updateComic({ comic: COMIC });
      const outcome = updateComicFailed();

      actions$ = hot('-a', { a: action });
      comicService.updateOne.and.throwError('expected');

      const expected = hot('-(b|)', { b: outcome });
      expect(effects.saveOne$).toBeObservable(expected);
      expect(alertService.error).toHaveBeenCalledWith(jasmine.any(String));
    });
  });

  describe('updating page deletion', () => {
    it('fires an action on success', () => {
      const serviceResponse = new HttpResponse({ status: 200 });
      const action = updatePageDeletion({ pages: [PAGE], deleted: DELETED });
      const outcome = pageDeletionUpdated();

      actions$ = hot('-a', { a: action });
      comicService.updatePageDeletion
        .withArgs({ pages: [PAGE], deleted: DELETED })
        .and.returnValue(of(serviceResponse));

      const expected = hot('-b', { b: outcome });
      expect(effects.updatePageDeletion$).toBeObservable(expected);
      expect(alertService.info).toHaveBeenCalledWith(jasmine.any(String));
    });

    it('fires an action on success', () => {
      const serviceResponse = new HttpErrorResponse({});
      const action = updatePageDeletion({ pages: [PAGE], deleted: DELETED });
      const outcome = updatePageDeletionFailed();

      actions$ = hot('-a', { a: action });
      comicService.updatePageDeletion
        .withArgs({
          pages: [PAGE],
          deleted: DELETED
        })
        .and.returnValue(throwError(serviceResponse));

      const expected = hot('-b', { b: outcome });
      expect(effects.updatePageDeletion$).toBeObservable(expected);
      expect(alertService.error).toHaveBeenCalledWith(jasmine.any(String));
    });

    it('fires an action on general failure', () => {
      const action = updatePageDeletion({ pages: [PAGE], deleted: DELETED });
      const outcome = updatePageDeletionFailed();

      actions$ = hot('-a', { a: action });
      comicService.updatePageDeletion
        .withArgs({
          pages: [PAGE],
          deleted: DELETED
        })
        .and.throwError('expected');

      const expected = hot('-(b|)', { b: outcome });
      expect(effects.updatePageDeletion$).toBeObservable(expected);
      expect(alertService.error).toHaveBeenCalledWith(jasmine.any(String));
    });
  });

  describe('saving the page order', () => {
    it('fires an action on success', () => {
      const serviceResponse = new HttpResponse({ status: 200 });
      const action = savePageOrder({
        comic: COMIC,
        entries: [{ index: 0, filename: PAGE.filename }]
      });
      const outcome = pageOrderSaved();

      actions$ = hot('-a', { a: action });
      comicService.savePageOrder
        .withArgs({
          comic: COMIC,
          entries: [{ index: 0, filename: PAGE.filename }]
        })
        .and.returnValue(of(serviceResponse));

      const expected = hot('-b', { b: outcome });
      expect(effects.savePageOrder$).toBeObservable(expected);
      expect(alertService.info).toHaveBeenCalledWith(jasmine.any(String));
    });

    it('fires an action on service failure', () => {
      const serviceResponse = new HttpErrorResponse({});
      const action = savePageOrder({
        comic: COMIC,
        entries: [{ index: 0, filename: PAGE.filename }]
      });
      const outcome = savePageOrderFailed();

      actions$ = hot('-a', { a: action });
      comicService.savePageOrder
        .withArgs({
          comic: COMIC,
          entries: [{ index: 0, filename: PAGE.filename }]
        })
        .and.returnValue(throwError(serviceResponse));

      const expected = hot('-b', { b: outcome });
      expect(effects.savePageOrder$).toBeObservable(expected);
      expect(alertService.error).toHaveBeenCalledWith(jasmine.any(String));
    });

    it('fires an action on general failure', () => {
      const action = savePageOrder({
        comic: COMIC,
        entries: [{ index: 0, filename: PAGE.filename }]
      });
      const outcome = savePageOrderFailed();

      actions$ = hot('-a', { a: action });
      comicService.savePageOrder
        .withArgs({
          comic: COMIC,
          entries: [{ index: 0, filename: PAGE.filename }]
        })
        .and.throwError('expected');

      const expected = hot('-(b|)', { b: outcome });
      expect(effects.savePageOrder$).toBeObservable(expected);
      expect(alertService.error).toHaveBeenCalledWith(jasmine.any(String));
    });
  });
});
