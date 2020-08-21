/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2018, The ComiXed Project
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

package org.comixedproject.web.authentication;

/**
 * <code>AuthenticationConstants</code> is a placeholder for constant values used in the
 * authentication code.
 *
 * @author Darryl L. Pierce
 */
public final class AuthenticationConstants {
  public static final String ROLE_PREFIX = "ROLE_";
  public static final String SIGNING_KEY = "comixedproject";
  public static final String HEADER_STRING = "Authorization";
  public static final String TOKEN_PREFIX = "Bearer ";

  private AuthenticationConstants() {
    // prevent it from being instantiates
  }
}
