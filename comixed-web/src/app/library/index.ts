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

import { Params } from '@angular/router';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import {
  COMIC_IMPORT_FEATURE_KEY,
  ComicImportState,
  reducer as libraryImportReducer
} from '../comic-file/reducers/comic-import.reducer';
import { ActionReducerMap } from '@ngrx/store';
import {
  LIBRARY_FEATURE_KEY,
  LibraryState,
  reducer as libraryReducer
} from './reducers/library.reducer';
import {
  DISPLAY_FEATURE_KEY,
  DisplayState,
  reducer as displayReducer
} from '@app/library/reducers/display.reducer';
import {
  reducer as scrapingReducer,
  SCRAPING_FEATURE_KEY,
  ScrapingState
} from '@app/library/reducers/scraping.reducer';
import {
  COMIC_LIST_FEATURE_KEY,
  ComicListState,
  reducer as comicListReducer
} from '@app/library/reducers/comic-list.reducer';
import {
  COMIC_FEATURE_KEY,
  ComicState,
  reducer as comicReducer
} from '@app/library/reducers/comic.reducer';

export { Comic } from '@app/library/models/comic';
export { ComicCredit } from '@app/library/models/comic-credit';
export { ComicFile } from '@app/comic-file/models/comic-file';
export { ComicFileEntry } from '@app/library/models/comic-file-entry';
export { ComicViewMode } from '@app/library/models/comic-view-mode.enum';
export { FileDetails } from '@app/library/models/file-details';
export { Page } from '@app/library/models/page';
export { PageType } from '@app/library/models/page-type';
export { ReadingList } from '@app/library/models/reading-list';
export { updateComics } from '@app/library/actions/library.actions';

interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export interface LibraryModuleState {
  router: RouterReducerState<RouterStateUrl>;
  [DISPLAY_FEATURE_KEY]: DisplayState;
  [COMIC_IMPORT_FEATURE_KEY]: ComicImportState;
  [LIBRARY_FEATURE_KEY]: LibraryState;
  [SCRAPING_FEATURE_KEY]: ScrapingState;
  [COMIC_LIST_FEATURE_KEY]: ComicListState;
  [COMIC_FEATURE_KEY]: ComicState;
}

export type ModuleState = LibraryModuleState;

export const reducers: ActionReducerMap<LibraryModuleState> = {
  router: routerReducer,
  [DISPLAY_FEATURE_KEY]: displayReducer,
  [COMIC_IMPORT_FEATURE_KEY]: libraryImportReducer,
  [LIBRARY_FEATURE_KEY]: libraryReducer,
  [SCRAPING_FEATURE_KEY]: scrapingReducer,
  [COMIC_LIST_FEATURE_KEY]: comicListReducer,
  [COMIC_FEATURE_KEY]: comicReducer
};
