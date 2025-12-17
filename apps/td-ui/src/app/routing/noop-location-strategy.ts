import { LocationChangeListener, LocationStrategy } from '@angular/common';

/**
 * LocationStrategy that never reads/writes the browser URL.
 * Router navigation still works internally (RouterOutlet updates),
 * but the URL remains unchanged.
 */
export class NoopLocationStrategy extends LocationStrategy {
  override path(includeHash: boolean = false): string {
    return '/';
  }

  override prepareExternalUrl(internal: string): string {
    return internal;
  }

  override pushState(state: any, title: string, url: string, queryParams: string): void {
    // no-op: do not mutate browser URL
  }

  getState(): any {
    // no-op:
  }

  override replaceState(state: any, title: string, url: string, queryParams: string): void {
    // no-op
  }

  override forward(): void {
    // no-op
  }

  override back(): void {
    // no-op
  }

  override onPopState(fn: LocationChangeListener): void {
    // no-op: we do not react to URL changes
  }

  override getBaseHref(): string {
    return '/';
  }
}
