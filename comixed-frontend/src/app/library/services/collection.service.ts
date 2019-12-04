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
 * along with this program. If not, see <http://www.gnu.org/licenses>
 */

import { Injectable } from '@angular/core';
import { CollectionType } from 'app/library/models/collection-type.enum';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { interpolate } from 'app/app.functions';
import {
  GET_COLLECTION_ENTRIES_URL,
  GET_PAGE_FOR_ENTRY_URL
} from 'app/library/library.constants';
import { GetCollectionPageRequest } from 'app/library/models/net/get-collection-page-request';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  constructor(private http: HttpClient) {}

  getEntries(type: CollectionType): Observable<any> {
    return this.http.get(
      interpolate(GET_COLLECTION_ENTRIES_URL, { type: type })
    );
  }

  getPageForEntry(
    type: CollectionType,
    name: string,
    page: number,
    count: number,
    sortField: string,
    ascending: boolean
  ): Observable<any> {
    return this.http.post(
      interpolate(GET_PAGE_FOR_ENTRY_URL, { type: type, name: name }),
      {
        page: page,
        count: count,
        sortField: sortField,
        ascending: ascending
      } as GetCollectionPageRequest
    );
  }
}