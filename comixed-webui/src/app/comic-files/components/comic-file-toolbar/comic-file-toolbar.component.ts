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

import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoggerService } from '@angular-ru/cdk/logger';
import { Store } from '@ngrx/store';
import { getUserPreference } from '@app/user';
import {
  IMPORT_MAXIMUM_RESULTS_DEFAULT,
  IMPORT_MAXIMUM_RESULTS_PREFERENCE,
  IMPORT_ROOT_DIRECTORY_DEFAULT,
  IMPORT_ROOT_DIRECTORY_PREFERENCE,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_OPTIONS,
  PAGE_SIZE_PREFERENCE
} from '@app/library/library.constants';
import {
  clearComicFileSelections,
  loadComicFiles
} from '@app/comic-files/actions/comic-file-list.actions';
import { sendComicFiles } from '@app/comic-files/actions/import-comic-files.actions';
import { ComicFile } from '@app/comic-files/models/comic-file';
import { User } from '@app/user/models/user';
import { saveUserPreference } from '@app/user/actions/user.actions';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from '@tragically-slick/confirmation';

@Component({
  selector: 'cx-comic-file-toolbar',
  templateUrl: './comic-file-toolbar.component.html',
  styleUrls: ['./comic-file-toolbar.component.scss']
})
export class ComicFileToolbarComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() comicFiles: ComicFile[] = [];
  @Input() selectedComicFiles: ComicFile[] = [];
  @Input() pageSize = PAGE_SIZE_DEFAULT;

  @Output() selectAll = new EventEmitter<void>();

  loadFilesForm: FormGroup;

  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  maximumOptions = [
    { label: 'comic-files.label.maximum-all-files', value: 0 },
    { label: 'comic-files.label.maximum-10-files', value: 10 },
    { label: 'comic-files.label.maximum-50-files', value: 50 },
    { label: 'comic-files.label.maximum-100-files', value: 100 },
    { label: 'comic-files.label.maximum-1000-files', value: 1000 }
  ];
  showLookupForm = true;

  constructor(
    private logger: LoggerService,
    private formBuilder: FormBuilder,
    private store: Store<any>,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {
    this.loadFilesForm = this.formBuilder.group({
      rootDirectory: ['', Validators.required],
      maximum: ['', Validators.required]
    });
  }

  @Input() set user(user: User) {
    this.logger.debug('Loading import toolbar from user:', user);
    this.loadFilesForm.controls.rootDirectory.setValue(
      getUserPreference(
        user.preferences,
        IMPORT_ROOT_DIRECTORY_PREFERENCE,
        IMPORT_ROOT_DIRECTORY_DEFAULT
      )
    );
    this.loadFilesForm.controls.maximum.setValue(
      parseInt(
        getUserPreference(
          user.preferences,
          IMPORT_MAXIMUM_RESULTS_PREFERENCE,
          `${IMPORT_MAXIMUM_RESULTS_DEFAULT}`
        ),
        10
      )
    );
  }

  onLoadFiles(): void {
    this.store.dispatch(
      loadComicFiles({
        directory: this.loadFilesForm.controls.rootDirectory.value,
        maximum: this.loadFilesForm.controls.maximum.value
      })
    );
  }

  onSelectAll(): void {
    this.logger.trace('Firing event: select all');
    this.selectAll.emit();
  }

  onDeselectAll(): void {
    this.logger.trace('Deselecting all comic files');
    this.store.dispatch(clearComicFileSelections());
  }

  onStartImport(): void {
    this.confirmationService.confirm({
      title: this.translateService.instant(
        'comic-files.import-comic-files.confirmation-title'
      ),
      message: this.translateService.instant(
        'comic-files.import-comic-files.confirmation-message',
        { count: this.selectedComicFiles.length }
      ),
      confirm: () => {
        this.logger.trace('Starting the import process');
        this.store.dispatch(
          sendComicFiles({
            files: this.selectedComicFiles
          })
        );
      }
    });
  }

  onToggleFileLookupForm(): void {
    this.showLookupForm = !this.showLookupForm;
  }

  onPageSizeChange(pageSize: number): void {
    this.logger.trace('Page size changed');
    this.store.dispatch(
      saveUserPreference({
        name: PAGE_SIZE_PREFERENCE,
        value: `${pageSize}`
      })
    );
  }
}
