import { ROUTES } from "../routes";

export const AUTH_ROUTES: Set<string> = new Set([
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.VERIFY,
]);

export const PROTECTED_PREFIXES = [ROUTES.PROTECTED.HISTORY] as const;

export const DEFAULT_AFTER_LOGIN = ROUTES.PUBLIC.HOME;

export const DEFAULT_AFTER_LOGOUT = ROUTES.PUBLIC.HOME;
