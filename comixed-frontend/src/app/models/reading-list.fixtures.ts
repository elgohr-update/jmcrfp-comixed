/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2019, The ComiXed Project
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

import { ReadingListEntry } from 'app/models/reading-list-entry';
import { User } from 'app/models/user/user';
import { READER_USER } from 'app/models/user/user.fixtures';
import { ReadingList } from 'app/models/reading-list';

export const READING_LIST_1: ReadingList = {
  id: 1000,
  owner: READER_USER,
  name: 'My Reading List',
  summary: 'This is my first reading list',
  entries: []
};