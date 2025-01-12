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

import { LIBRARY_FEATURE_KEY, LibraryState } from '../reducers/library.reducer';
import { selectLibraryState, selectSelectedComics } from './library.selectors';
import {
  COMIC_1,
  COMIC_2,
  COMIC_3
} from '@app/comic-books/comic-books.fixtures';

describe('Library Selectors', () => {
  const SELECTED_COMICS = [COMIC_1, COMIC_2, COMIC_3];

  let state: LibraryState;

  beforeEach(() => {
    state = {
      selected: SELECTED_COMICS
    };
  });

  it('selects the feature state', () => {
    expect(
      selectLibraryState({
        [LIBRARY_FEATURE_KEY]: state
      })
    ).toEqual(state);
  });

  it('selects the selected comics', () => {
    expect(selectSelectedComics({ [LIBRARY_FEATURE_KEY]: state })).toEqual(
      SELECTED_COMICS
    );
  });
});
