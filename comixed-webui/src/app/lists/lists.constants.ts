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

import { API_ROOT_URL } from '../core';
import { ReadingList } from '@app/lists/models/reading-list';
import { SECURED_PREFIX } from '@app/messaging/messaging.constants';

export const LOAD_READING_LISTS_URL = `${API_ROOT_URL}/lists/reading`;
export const LOAD_READING_LIST_URL = `${API_ROOT_URL}/lists/reading/\${id}`;
export const SAVE_READING_LIST = `${API_ROOT_URL}/lists/reading`;
export const UPDATE_READING_LIST = `${API_ROOT_URL}/lists/reading/\${id}`;
export const ADD_COMICS_TO_READING_LIST_URL = `${API_ROOT_URL}/lists/reading/\${id}/comics/add`;
export const REMOVE_COMICS_FROM_READING_LIST_URL = `${API_ROOT_URL}/lists/reading/\${id}/comics/remove`;
export const DOWNLOAD_READING_LIST_URL = `${API_ROOT_URL}/lists/reading/\${id}/download`;
export const UPLOAD_READING_LIST_URL = `${API_ROOT_URL}/lists/reading/upload`;

export const READING_LIST_TEMPLATE: ReadingList = {
  id: null,
  name: '',
  summary: '',
  owner: null,
  createdOn: new Date().getTime(),
  lastModifiedOn: 0,
  comics: []
};

export const READING_LIST_UPDATES = `${SECURED_PREFIX}/topic/reading-list.\${id}.update`;
