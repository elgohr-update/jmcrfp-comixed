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

import { Pipe, PipeTransform } from '@angular/core';
import { interpolate } from '@app/core';
import { GET_PAGE_CONTENT_URL } from '@app/library/library.constants';
import { Page } from '@app/comic-books/models/page';

@Pipe({
  name: 'comicPageUrl'
})
export class ComicPageUrlPipe implements PipeTransform {
  transform(page: Page): string {
    return interpolate(GET_PAGE_CONTENT_URL, { id: page.id });
  }
}
