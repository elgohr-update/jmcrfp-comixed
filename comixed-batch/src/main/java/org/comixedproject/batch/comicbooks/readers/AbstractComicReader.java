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

package org.comixedproject.batch.comicbooks.readers;

import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.comixedproject.model.comicbooks.Comic;
import org.springframework.batch.item.ItemReader;

/**
 * <code>AbstractComicReader</code> provides a foundation for building new {@link ItemReader}
 * classes that work with instances of {@link Comic}.
 *
 * @author Darryl L. Pierce
 */
@Log4j2
public abstract class AbstractComicReader implements ItemReader<Comic> {
  List<Comic> comicList = null;

  @Override
  public Comic read() {
    if (this.comicList == null) {
      log.trace("Load more comics to process");
      this.comicList = this.doLoadComics();
    }

    if (this.comicList.isEmpty()) {
      log.trace("No comics to process");
      this.comicList = null;
      return null;
    }

    log.trace("Returning next comic to process");
    return this.comicList.remove(0);
  }

  /**
   * Called to load more comics to be processed.
   *
   * @return the comics
   */
  protected abstract List<Comic> doLoadComics();
}
