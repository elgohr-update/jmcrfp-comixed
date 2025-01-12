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
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { VolumeMetadata } from '@app/comic-metadata/models/volume-metadata';
import { Comic } from '@app/comic-books/models/comic';
import { MatTableDataSource } from '@angular/material/table';
import { LoggerService } from '@angular-ru/cdk/logger';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IssueMetadata } from '@app/comic-metadata/models/issue-metadata';
import { Store } from '@ngrx/store';
import {
  loadIssueMetadata,
  resetMetadataState,
  scrapeComic
} from '@app/comic-metadata/actions/metadata.actions';
import { Subscription } from 'rxjs';
import {
  selectIssueMetadata,
  selectMetadataState
} from '@app/comic-metadata/selectors/metadata.selectors';
import { TranslateService } from '@ngx-translate/core';
import { deselectComics } from '@app/library/actions/library.actions';
import { SortableListItem } from '@app/core/models/ui/sortable-list-item';
import { setBusyState } from '@app/core/actions/busy.actions';
import { ConfirmationService } from '@tragically-slick/confirmation';
import { MetadataSource } from '@app/comic-metadata/models/metadata-source';
import { PAGE_SIZE_OPTIONS } from '@app/library/library.constants';

export const MATCHABILITY = 'matchability';
export const EXACT_MATCH = 2;
export const EXACT_MATCH_TEXT = 'scraping.text.exact-match';
export const NEAR_MATCH = 1;
export const NEAR_MATCH_TEXT = 'scraping.text.near-match';
export const NO_MATCH = 0;
export const NO_MATCH_TEXT = 'scraping.text.no-match';

@Component({
  selector: 'cx-comic-metadata',
  templateUrl: './comic-metadata.component.html',
  styleUrls: ['./comic-metadata.component.scss']
})
export class ComicMetadataComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;

  @Input() comic: Comic;
  @Input() metadataSource: MetadataSource;
  @Input() comicSeriesName: string;
  @Input() comicVolume: string;
  @Input() comicIssueNumber: string;
  @Input() skipCache = false;
  @Input() pageSize: number;
  @Input() multimode = false;

  @Output() comicScraped = new EventEmitter<Comic>();

  issueSubscription: Subscription;
  issue: IssueMetadata;
  scrapingStateSubscription: Subscription;
  selectedVolume: VolumeMetadata;

  dataSource = new MatTableDataSource<SortableListItem<VolumeMetadata>>();
  displayedColumns = [
    MATCHABILITY,
    'publisher',
    'name',
    'start-year',
    'issue-count',
    'action'
  ];

  constructor(
    private logger: LoggerService,
    private store: Store<any>,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {
    this.issueSubscription = this.store
      .select(selectIssueMetadata)
      .subscribe(issue => (this.issue = issue));
    this.scrapingStateSubscription = this.store
      .select(selectMetadataState)
      .subscribe(state =>
        this.store.dispatch(setBusyState({ enabled: state.loadingRecords }))
      );
  }

  @Input() set volumes(volumes: VolumeMetadata[]) {
    this.logger.trace('Received scraping volumes');
    this.dataSource.data = volumes.map(volume => {
      const sortOrder =
        volume.name === this.comicSeriesName &&
        volume.startYear === this.comicVolume
          ? EXACT_MATCH
          : volume.name === this.comicSeriesName
          ? NEAR_MATCH
          : NO_MATCH;
      return {
        item: volume,
        sortOrder
      } as SortableListItem<VolumeMetadata>;
    });
    this.selectedVolume = null;
    const preselect = this.dataSource.data.find(
      entry => entry.sortOrder === EXACT_MATCH
    );
    if (!!preselect) {
      this.logger.debug('Preselecting volume:', preselect);
      this.onVolumeSelected(preselect.item);
    }
  }

  ngOnDestroy(): void {
    this.issueSubscription.unsubscribe();
    this.scrapingStateSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.logger.trace('Setting up pagination');
    this.dataSource.paginator = this.paginator;
    this.logger.trace('Setting up sorting');
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (element, property) => {
      switch (property) {
        case MATCHABILITY:
          return element.sortOrder;
        case 'start-year':
          return element.item.startYear;
        case 'issue-count':
          return element.item.issueCount;
        default:
          return element.item[property];
      }
    };
    this.logger.trace('Setting up filtering');
    this.dataSource.filterPredicate = (data, filter) => {
      return (
        this.matchesFilter(data.item.name, filter) ||
        this.matchesFilter(data.item.publisher, filter) ||
        this.matchesFilter(data.item.startYear, filter)
      );
    };
  }

  onVolumeSelected(volume: VolumeMetadata): void {
    this.logger.trace('Volume selected:', volume);
    this.selectedVolume = volume;
    this.store.dispatch(
      loadIssueMetadata({
        metadataSource: this.metadataSource,
        volumeId: volume.id,
        issueNumber: this.comicIssueNumber,
        skipCache: this.skipCache
      })
    );
  }

  onDecision(decision: boolean): void {
    this.logger.trace(
      `Scraping issue was ${decision ? 'accepted' : 'rejected'}`
    );
    if (decision) {
      this.confirmationService.confirm({
        title: this.translateService.instant(
          'scraping.scrape-comic-confirmation-title'
        ),
        message: this.translateService.instant(
          'scraping.scrape-comic-confirmation-message'
        ),
        confirm: () => {
          this.logger.debug(
            'User confirmed scraping the comic:',
            this.multimode
          );
          if (this.multimode) {
            this.logger.debug(
              'Removing comic from scraping queue:',
              this.comic
            );
            this.store.dispatch(deselectComics({ comics: [this.comic] }));
          }
          this.store.dispatch(
            scrapeComic({
              metadataSource: this.metadataSource,
              issueId: this.issue.id,
              comic: this.comic,
              skipCache: this.skipCache
            })
          );
        }
      });
    } else {
      this.issue = null;
    }
  }

  onCancelScraping(): void {
    this.logger.trace('Canceling scraping');
    this.store.dispatch(resetMetadataState());
  }

  private matchesFilter(value: string, filter: string): boolean {
    console.log('Looking for', filter, ' in', value);
    return (
      (value || '').toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) !==
      -1
    );
  }
}
