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

import static org.comixedproject.batch.comicbooks.ConsolidationConfiguration.PARAM_DELETE_REMOVED_COMIC_FILES;

import lombok.extern.log4j.Log4j2;
import org.comixedproject.adaptors.file.FileAdaptor;
import org.comixedproject.model.comicbooks.Comic;
import org.comixedproject.service.comicbooks.ComicService;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;

/**
 * <code>DeleteComicProcessor</code> deletes comics, removing the file from the database as well as
 * from the physical file if requested.
 *
 * @author Darryl L. Pierce
 */
@TestComponent
@Log4j2
public class DeleteComicProcessor implements ItemProcessor<Comic, Void>, StepExecutionListener {
  @Autowired private ComicService comicService;
  @Autowired private FileAdaptor fileAdaptor;

  private ExecutionContext executionContext;

  @Override
  public Void process(final Comic comic) {
    log.trace("Removing comic from database");
    this.comicService.deleteComic(comic);
    if (Boolean.parseBoolean(this.executionContext.getString(PARAM_DELETE_REMOVED_COMIC_FILES))) {
      log.trace("Deleting physical file: {}", comic.getFilename());
      this.fileAdaptor.deleteFile(comic.getFile());
    }
    return null;
  }

  @Override
  public void beforeStep(final StepExecution stepExecution) {
    log.trace("Loading job context");
    this.executionContext = stepExecution.getJobExecution().getExecutionContext();
  }

  @Override
  public ExitStatus afterStep(final StepExecution stepExecution) {
    return null;
  }
}
