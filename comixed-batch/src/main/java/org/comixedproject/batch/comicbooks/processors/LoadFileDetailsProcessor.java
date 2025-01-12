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

package org.comixedproject.batch.comicbooks.processors;

import java.io.FileInputStream;
import lombok.extern.log4j.Log4j2;
import org.comixedproject.adaptors.GenericUtilitiesAdaptor;
import org.comixedproject.model.comicbooks.Comic;
import org.comixedproject.model.comicbooks.ComicFileDetails;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <code>LoadFileDetailsProcessor</code> loads the file details for a comic.
 *
 * @author Darryl L. Pierce
 */
@Component
@Log4j2
public class LoadFileDetailsProcessor implements ItemProcessor<Comic, Comic> {
  @Autowired private GenericUtilitiesAdaptor genericUtilitiesAdaptor;

  @Override
  public Comic process(final Comic comic) throws Exception {
    log.debug("Creating file details container: id={}", comic.getId());
    final ComicFileDetails fileDetails = new ComicFileDetails(comic);
    comic.setFileDetails(fileDetails);
    log.trace("Getting comic file hash");
    fileDetails.setHash(
        this.genericUtilitiesAdaptor.createHash(new FileInputStream(comic.getFilename())));
    return comic;
  }
}
