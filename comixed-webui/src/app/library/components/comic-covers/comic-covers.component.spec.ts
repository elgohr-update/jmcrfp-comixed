/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2020, The ComiXed Project
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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ComicCoversComponent } from './comic-covers.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerModule } from '@angular-ru/cdk/logger';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatTreeModule } from '@angular/material/tree';
import {
  initialState as initialLibraryState,
  LIBRARY_FEATURE_KEY
} from '@app/library/reducers/library.reducer';
import { MatBadgeModule } from '@angular/material/badge';
import {
  COMIC_1,
  COMIC_2,
  COMIC_3,
  COMIC_4
} from '@app/comic-books/comic-books.fixtures';
import {
  deselectComics,
  selectComics
} from '@app/library/actions/library.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { ComicDetailsDialogComponent } from '@app/library/components/comic-details-dialog/comic-details-dialog.component';
import { LibraryToolbarComponent } from '@app/library/components/library-toolbar/library-toolbar.component';
import { ComicBookState } from '@app/comic-books/models/comic-book-state';
import { updateMetadata } from '@app/library/actions/update-metadata.actions';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {
  ArchiveType,
  archiveTypeFromString
} from '@app/comic-books/models/archive-type.enum';
import { markComicsDeleted } from '@app/comic-books/actions/mark-comics-deleted.actions';
import { MatDividerModule } from '@angular/material/divider';
import { addComicsToReadingList } from '@app/lists/actions/reading-list-entries.actions';
import { READING_LIST_1 } from '@app/lists/lists.fixtures';
import { convertComics } from '@app/library/actions/convert-comics.actions';
import { setComicsRead } from '@app/last-read/actions/set-comics-read.actions';
import {
  LAST_READ_1,
  LAST_READ_3,
  LAST_READ_5
} from '@app/last-read/last-read.fixtures';
import { Comic } from '@app/comic-books/models/comic';
import { MatSortModule } from '@angular/material/sort';
import {
  Confirmation,
  ConfirmationService
} from '@tragically-slick/confirmation';
import { FileDownloadService } from '@app/core/services/file-download.service';

describe('ComicCoversComponent', () => {
  const PAGINATION = 25;
  const PAGE_INDEX = 23;
  const COMIC = COMIC_2;
  const COMICS = [COMIC_1, COMIC_2, COMIC_3, COMIC_4];
  const READING_LIST = READING_LIST_1;
  const LAST_READ_DATES = [LAST_READ_1, LAST_READ_3, LAST_READ_5];
  const initialState = {
    [LIBRARY_FEATURE_KEY]: initialLibraryState
  };

  let component: ComicCoversComponent;
  let fixture: ComponentFixture<ComicCoversComponent>;
  let store: MockStore<any>;
  let dialog: MatDialog;
  let translateService: TranslateService;
  let confirmationService: ConfirmationService;
  let paginator: ComponentFixture<MatPaginator>;
  let fileDownloadService: FileDownloadService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ComicCoversComponent, LibraryToolbarComponent],
        imports: [
          NoopAnimationsModule,
          RouterTestingModule.withRoutes([{ path: '**', redirectTo: '' }]),
          LoggerModule.forRoot(),
          TranslateModule.forRoot(),
          MatSidenavModule,
          MatToolbarModule,
          MatIconModule,
          MatPaginatorModule,
          MatTreeModule,
          MatBadgeModule,
          MatFormFieldModule,
          MatTooltipModule,
          MatDialogModule,
          MatMenuModule,
          MatSelectModule,
          MatOptionModule,
          MatDividerModule,
          MatSortModule
        ],
        providers: [
          provideMockStore({ initialState }),
          ConfirmationService,
          FileDownloadService
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ComicCoversComponent);
      component = fixture.componentInstance;
      store = TestBed.inject(MockStore);
      spyOn(store, 'dispatch');
      dialog = TestBed.inject(MatDialog);
      spyOn(dialog, 'open');
      translateService = TestBed.inject(TranslateService);
      confirmationService = TestBed.inject(ConfirmationService);
      paginator = TestBed.createComponent(MatPaginator);
      fileDownloadService = TestBed.inject(FileDownloadService);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loading comics to display', () => {
    beforeEach(() => {
      component.dataSource.data = [];
      component.comics = COMICS;
    });

    it('loads the comics to display', () => {
      expect(component.comics).toEqual(COMICS);
    });
  });

  describe('checking if a comic is selected', () => {
    beforeEach(() => {
      component.selected = [COMIC_1];
    });

    it('returns true for selected comics', () => {
      expect(component.isSelected(COMIC_1)).toBeTrue();
    });

    it('returns false for unselected comics', () => {
      expect(component.isSelected(COMIC_2)).toBeFalse();
    });
  });

  describe('when a comic select event is received', () => {
    describe('selecting a comic', () => {
      beforeEach(() => {
        component.onSelectionChanged(COMIC, true);
      });

      it('fires an action', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          selectComics({ comics: [COMIC] })
        );
      });
    });

    describe('deselecting a comic', () => {
      beforeEach(() => {
        component.onSelectionChanged(COMIC, false);
      });

      it('fires an action', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          deselectComics({ comics: [COMIC] })
        );
      });
    });
  });

  describe('showing the context menu', () => {
    const XPOS = '7';
    const YPOS = '17';

    beforeEach(() => {
      component.comic = null;
      spyOn(component.contextMenu, 'openMenu');
      component.onShowContextMenu(COMIC, XPOS, YPOS);
    });

    it('sets the current comic', () => {
      expect(component.comic).toEqual(COMIC);
    });

    it('set the context menu x position', () => {
      expect(component.contextMenuX).toEqual(XPOS);
    });

    it('set the context menu y position', () => {
      expect(component.contextMenuY).toEqual(YPOS);
    });

    it('shows the context menu', () => {
      expect(component.contextMenu.openMenu).toHaveBeenCalled();
    });
  });

  describe('showing the comic details dialog', () => {
    beforeEach(() => {
      component.onShowComicDetails(COMIC);
    });

    it('opens the comic details dialog', () => {
      expect(dialog.open).toHaveBeenCalledWith(ComicDetailsDialogComponent, {
        data: COMIC
      });
    });
  });

  describe('setting the read state', () => {
    const READ = Math.random() > 0.5;

    describe('for one comic', () => {
      beforeEach(() => {
        component.onMarkOneComicRead(COMIC, READ);
      });

      it('fires an action', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          setComicsRead({ comics: [COMIC], read: READ })
        );
      });
    });

    describe('for selected comic', () => {
      beforeEach(() => {
        component.selected = COMICS;
        component.onMarkMultipleComicsRead(READ);
      });

      it('fires an action', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          setComicsRead({ comics: COMICS, read: READ })
        );
      });
    });
  });

  describe('checking if a comic is changed', () => {
    it('returns false when ADDED', () => {
      expect(
        component.isChanged({ ...COMIC, comicState: ComicBookState.ADDED })
      ).toBeFalse();
    });

    it('returns true when CHANGED', () => {
      expect(
        component.isChanged({ ...COMIC, comicState: ComicBookState.CHANGED })
      ).toBeTrue();
    });

    it('returns true when STABLE', () => {
      expect(
        component.isChanged({ ...COMIC, comicState: ComicBookState.STABLE })
      ).toBeFalse();
    });

    it('returns true when DELETED', () => {
      expect(
        component.isChanged({ ...COMIC, comicState: ComicBookState.DELETED })
      ).toBeFalse();
    });
  });

  describe('updating the comic info', () => {
    beforeEach(() => {
      spyOn(confirmationService, 'confirm').and.callFake(
        (confirmation: Confirmation) => confirmation.confirm()
      );
      component.onUpdateMetadata(COMIC);
    });

    it('confirms with the user', () => {
      expect(confirmationService.confirm).toHaveBeenCalled();
    });

    it('fires an action', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        updateMetadata({ comics: [COMIC] })
      );
    });
  });

  describe('when the archive type changes', () => {
    const ARCHIVE_TYPE = Math.random() > 0.5 ? ArchiveType.CBZ : null;

    beforeEach(() => {
      spyOn(component.archiveTypeChanged, 'emit');
      component.onArchiveTypeChanged(ARCHIVE_TYPE);
    });

    it('emits an event', () => {
      expect(component.archiveTypeChanged.emit).toHaveBeenCalledWith(
        ARCHIVE_TYPE
      );
    });
  });

  describe('marking comics for deletion', () => {
    beforeEach(() => {
      component.selected = COMICS;
      spyOn(confirmationService, 'confirm').and.callFake(
        (confirmation: Confirmation) => confirmation.confirm()
      );
    });

    describe('for a single comic', () => {
      beforeEach(() => {
        component.onMarkAsDeleted(COMICS[0], true);
      });

      it('confirms with the user', () => {
        expect(confirmationService.confirm).toHaveBeenCalled();
      });

      it('fires an action', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          markComicsDeleted({ comics: [COMICS[0]], deleted: true })
        );
      });
    });

    describe('for multiple comics', () => {
      beforeEach(() => {
        component.onMarkSelectedDeleted(true);
      });

      it('confirms with the user', () => {
        expect(confirmationService.confirm).toHaveBeenCalled();
      });

      it('fires an action', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          markComicsDeleted({ comics: COMICS, deleted: true })
        );
      });
    });
  });

  describe('unmarking comics for deletion', () => {
    beforeEach(() => {
      component.selected = COMICS;
      spyOn(confirmationService, 'confirm').and.callFake(
        (confirmation: Confirmation) => confirmation.confirm()
      );
    });

    describe('for a single comic', () => {
      beforeEach(() => {
        component.onMarkAsDeleted(COMICS[0], false);
      });

      it('confirms with the user', () => {
        expect(confirmationService.confirm).toHaveBeenCalled();
      });

      it('fires an action', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          markComicsDeleted({ comics: [COMICS[0]], deleted: false })
        );
      });
    });

    describe('for multiple comics', () => {
      beforeEach(() => {
        component.onMarkSelectedDeleted(false);
      });

      it('confirms with the user', () => {
        expect(confirmationService.confirm).toHaveBeenCalled();
      });

      it('fires an action', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          markComicsDeleted({ comics: COMICS, deleted: false })
        );
      });
    });
  });

  describe('adding comics to a reading list', () => {
    beforeEach(() => {
      component.selected = COMICS;
      spyOn(confirmationService, 'confirm').and.callFake(
        (confirmation: Confirmation) => confirmation.confirm()
      );
      component.addSelectedToReadingList(READING_LIST);
    });

    it('confirms with the user', () => {
      expect(confirmationService.confirm).toHaveBeenCalled();
    });

    it('fires an action', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        addComicsToReadingList({ list: READING_LIST, comics: COMICS })
      );
    });
  });

  describe('converting a single comic', () => {
    beforeEach(() => {
      spyOn(confirmationService, 'confirm').and.callFake(
        (confirmation: Confirmation) => confirmation.confirm()
      );
      component.onConvertOne(COMIC, 'CBZ');
    });

    it('confirms with the user', () => {
      expect(confirmationService.confirm).toHaveBeenCalled();
    });

    it('fires an action', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        convertComics({
          comics: [COMIC],
          archiveType: archiveTypeFromString('CBZ'),
          renamePages: true,
          deletePages: true
        })
      );
    });
  });

  describe('converting the comic selection', () => {
    beforeEach(() => {
      spyOn(confirmationService, 'confirm').and.callFake(
        (confirmation: Confirmation) => confirmation.confirm()
      );
      component.selected = COMICS;
      component.onConvertSelected('CB7');
    });

    it('confirms with the user', () => {
      expect(confirmationService.confirm).toHaveBeenCalled();
    });

    it('fires an action', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        convertComics({
          comics: COMICS,
          archiveType: archiveTypeFromString('CB7'),
          renamePages: true,
          deletePages: true
        })
      );
    });
  });

  describe('comic last read states', () => {
    beforeEach(() => {
      component.lastRead = LAST_READ_DATES;
    });

    it('stores the read comic ids', () => {
      expect(component.readComicIds).toEqual(
        LAST_READ_DATES.map(entry => entry.comic.id)
      );
    });

    it('identifies read comics', () => {
      expect(component.isRead(LAST_READ_DATES[0].comic as Comic)).toBeTrue();
    });
  });

  describe('sorting comics', () => {
    const LEFT = {
      ...COMIC,
      coverDate: new Date().getTime(),
      addedDate: new Date().getTime() - 24 * 60 * 60 * 1000
    };
    const RIGHT = {
      ...COMIC,
      coverDate: new Date().getTime() - 24 * 60 * 60 * 1000,
      addedDate: new Date().getTime()
    };

    describe('can sorting by added date', () => {
      beforeEach(() => {
        component.comics = [RIGHT, LEFT];
        component.sortField = 'added-date';
      });

      it('sorts correctly', () => {
        expect(component.dataSource.data[0]).toBe(LEFT);
      });
    });

    describe('can sorting by cover date', () => {
      beforeEach(() => {
        component.comics = [LEFT, RIGHT];
        component.sortField = 'cover-date';
      });

      it('sorts correctly', () => {
        expect(component.dataSource.data[0]).toBe(RIGHT);
      });
    });
  });

  describe('when the page index changes', () => {
    beforeEach(() => {
      spyOn(component.pageIndexChanged, 'emit');
      component.onPageIndexChanged(PAGE_INDEX);
    });

    it('emits an event', () => {
      expect(component.pageIndexChanged.emit).toHaveBeenCalledWith(PAGE_INDEX);
    });
  });

  describe('setting the page index', () => {
    beforeEach(() => {
      component.dataSource.paginator = paginator.componentInstance;
      component.pageIndex = PAGE_INDEX;
    });

    it('sets the page index for the paginator', () => {
      expect(paginator.componentInstance.pageIndex).toEqual(PAGE_INDEX);
    });
  });

  describe('downloading comic metadata', () => {
    beforeEach(() => {
      spyOn(fileDownloadService, 'saveFileContent');
      component.downloadComicData(COMICS);
    });

    it('downloads the file detail', () => {
      expect(fileDownloadService.saveFileContent).toHaveBeenCalled();
    });
  });

  describe('checking if a comic is deleted', () => {
    it('returns true when the comic is in the deleted state', () => {
      expect(
        component.isDeleted({ ...COMIC, comicState: ComicBookState.DELETED })
      ).toBeTrue();
    });

    it('returns false when the comic is not in the deleted state', () => {
      expect(
        component.isDeleted({ ...COMIC, comicState: ComicBookState.CHANGED })
      ).toBeFalse();
    });
  });
});
