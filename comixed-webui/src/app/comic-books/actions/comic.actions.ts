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

import { createAction, props } from '@ngrx/store';
import { Comic } from '@app/comic-books/models/comic';
import { Page } from '@app/comic-books/models/page';
import { PageOrderEntry } from '@app/comic-books/models/net/page-order-entry';

export const loadComic = createAction(
  '[Comic] Loads a single comic',
  props<{ id: number }>()
);

export const comicLoaded = createAction(
  '[Comic] A single comic was loaded',
  props<{ comic: Comic }>()
);

export const loadComicFailed = createAction(
  '[Comic] Failed to load a single comic'
);

export const updateComic = createAction(
  '[Comic] Update a comic',
  props<{ comic: Comic }>()
);

export const comicUpdated = createAction(
  '[Comic] Comic updated',
  props<{ comic: Comic }>()
);

export const updateComicFailed = createAction(
  '[Comic] Failed to update a comic'
);

export const updatePageDeletion = createAction(
  '[Comic] Update page deletion state',
  props<{ pages: Page[]; deleted: boolean }>()
);

export const pageDeletionUpdated = createAction(
  '[Comic] Page deletion was updated'
);

export const updatePageDeletionFailed = createAction(
  '[Comic] Failed to update page deletion state'
);

export const savePageOrder = createAction(
  '[Comic] Save page order',
  props<{ comic: Comic; entries: PageOrderEntry[] }>()
);

export const pageOrderSaved = createAction('[Comic] Page order saved');

export const savePageOrderFailed = createAction(
  '[Comic] Save page order failed'
);
