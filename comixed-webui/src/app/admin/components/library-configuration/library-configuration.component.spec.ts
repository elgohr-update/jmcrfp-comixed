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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryConfigurationComponent } from './library-configuration.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { LoggerModule } from '@angular-ru/logger';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatDialogModule } from '@angular/material/dialog';
import {
  LIBRARY_RENAMING_RULE,
  LIBRARY_ROOT_DIRECTORY
} from '@app/admin/admin.constants';
import { Confirmation } from '@app/core/models/confirmation';
import { saveConfigurationOptions } from '@app/admin/actions/save-configuration-options.actions';
import { ConfirmationService } from '@app/core/services/confirmation.service';

describe('LibraryConfigurationComponent', () => {
  const LIBRARY_ROOT = 'The library root';
  const RENAMING_RULE = 'The renaming rule';
  const OPTIONS = [
    {
      name: LIBRARY_ROOT_DIRECTORY,
      value: LIBRARY_ROOT
    },
    {
      name: LIBRARY_RENAMING_RULE,
      value: RENAMING_RULE
    }
  ];
  const initialState = {};

  let component: LibraryConfigurationComponent;
  let fixture: ComponentFixture<LibraryConfigurationComponent>;
  let store: MockStore<any>;
  let confirmationService: ConfirmationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LibraryConfigurationComponent],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        LoggerModule.forRoot(),
        TranslateModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
        MatDialogModule
      ],
      providers: [provideMockStore({ initialState }), ConfirmationService]
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryConfigurationComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
    confirmationService = TestBed.inject(ConfirmationService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loading the options', () => {
    beforeEach(() => {
      component.options = OPTIONS;
    });

    it('sets the library root value', () => {
      expect(
        component.libraryConfigurationForm.controls.rootDirectory.value
      ).toEqual(LIBRARY_ROOT);
    });

    it('sets the renaming rule value', () => {
      expect(
        component.libraryConfigurationForm.controls.renamingRule.value
      ).toEqual(RENAMING_RULE);
    });
  });

  describe('saving the options', () => {
    beforeEach(() => {
      spyOn(confirmationService, 'confirm').and.callFake(
        (confirmation: Confirmation) => confirmation.confirm()
      );
      component.options = OPTIONS;
      component.onSave();
    });

    it('confirms with the user', () => {
      expect(confirmationService.confirm).toHaveBeenCalled();
    });

    it('fires an action', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        saveConfigurationOptions({
          options: [
            { name: LIBRARY_ROOT_DIRECTORY, value: LIBRARY_ROOT },
            { name: LIBRARY_RENAMING_RULE, value: RENAMING_RULE }
          ]
        })
      );
    });
  });
});