import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UiShellStore, NavItem } from './ui-shell.store';

describe('UiShellStore', () => {
  let store: UiShellStore;
  let routerMock: any;
  let routerEventsSubject: Subject<any>;
  let postMessageSpy: jest.SpyInstance;

  beforeEach(() => {
    routerEventsSubject = new Subject();
    routerMock = {
      url: '/',
      events: routerEventsSubject.asObservable(),
      navigateByUrl: jest.fn().mockResolvedValue(true),
    };

    // Reset global extension flag before each test
    (globalThis as any).__TD_EXTENSION__ = undefined;

    TestBed.configureTestingModule({
      providers: [
        UiShellStore,
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  function createStore() {
    store = TestBed.inject(UiShellStore);
  }

  describe('Initialization and Environment', () => {
    it('should initialize with default values in Web mode', () => {
      createStore();
      expect(store.isExtension()).toBe(false);
      expect(store.sidebarHover()).toBe(false);
      expect(store.mobileOpen()).toBe(false);
      expect(store.url()).toBe('/');
    });

    it('should detect Extension mode via global variable', () => {
      (globalThis as any).__TD_EXTENSION__ = true;
      createStore();
      expect(store.isExtension()).toBe(true);
    });
  });

  describe('Responsiveness and Layout', () => {
    beforeEach(() => createStore());

    it('should calculate isMobile based on viewport width', () => {
      store.setViewportWidth(1024);
      expect(store.isMobile()).toBe(false);

      store.setViewportWidth(800);
      expect(store.isMobile()).toBe(true);
    });

    it('should expand sidebar when hovering (Desktop)', () => {
      store.setViewportWidth(1024);
      store.onSidebarEnter();
      expect(store.sidebarExpanded()).toBe(true);
      expect(store.uiMode()).toBe('submenu');

      store.onSidebarLeave();
      expect(store.sidebarExpanded()).toBe(false);
      expect(store.uiMode()).toBe('collapsed');
    });

    it('should return correct sidebar width', () => {
      store.onSidebarEnter();
      expect(store.sidebarWidthPx()).toBe(280);

      store.onSidebarLeave();
      expect(store.sidebarWidthPx()).toBe(56);
    });
  });

  describe('Navigation and Active States', () => {
    beforeEach(() => createStore());

    const mockItem: NavItem = { id: 'test', label: 'Test', icon: 'fa-test', route: '/test' };
    const mockParent: NavItem = {
      id: 'parent',
      label: 'Parent',
      icon: 'fa-parent',
      children: [{ id: 'child', label: 'Child', route: '/child' }]
    };

    it('should identify active route accurately', () => {
      // Manually trigger router event
      routerEventsSubject.next(new NavigationEnd(1, '/test', '/test'));
      expect(store.url()).toBe('/test');
      expect(store.isExactActive('/test')).toBe(true);
      expect(store.isExactActive('/other')).toBe(false);
    });

    it('should identify active child routes', () => {
      routerEventsSubject.next(new NavigationEnd(1, '/child', '/child'));
      expect(store.isChildActive(mockParent)).toBe(true);
      expect(store.isItemActive(mockParent)).toBe(true);
    });

    it('should normalize paths (strip query/hash)', () => {
      routerEventsSubject.next(new NavigationEnd(1, '/test?query=1#hash', '/test?query=1#hash'));
      expect(store.url()).toBe('/test');
      expect(store.isExactActive('/test')).toBe(true);
    });
  });

  describe('Accordion and Hover Logic', () => {
    beforeEach(() => {
      createStore();
      store.onSidebarEnter(); // Expand to allow accordion
      // Ensure categoryItem is in the store
      store.navItems.set([...store.navItems(), categoryItem]);
    });

    const categoryItem: NavItem = {
      id: 'cat',
      label: 'Cat',
      icon: 'icon',
      children: [{ id: 'sub', label: 'Sub', route: '/sub' }]
    };

    it('should open category on hover', () => {
      store.onItemEnter(categoryItem);
      expect(store.openCategoryId()).toBe('cat');

      store.onItemLeave(categoryItem);
      expect(store.openCategoryId()).toBeNull();
    });

    it('should pin category on click', () => {
      store.togglePinCategory(categoryItem);
      expect(store.pinnedCategoryId()).toBe('cat');
      expect(store.openCategoryId()).toBe('cat');

      // Stay open even if hover leaves
      store.onItemLeave(categoryItem);
      expect(store.openCategoryId()).toBe('cat');

      // Toggle off
      store.togglePinCategory(categoryItem);
      expect(store.pinnedCategoryId()).toBeNull();
    });

    it('should reset hover and pin when sidebar collapses', () => {
      store.onItemEnter(categoryItem);
      store.togglePinCategory(categoryItem);

      store.onSidebarLeave();

      // Wait for effect (in tests, computed/effects might need a cycle or manual check)
      // Since sidebarExpanded() is false, openCategoryId should be null immediately
      expect(store.openCategoryId()).toBeNull();
    });
  });

  describe('Mobile Behavior', () => {
    beforeEach(() => {
      createStore();
      store.setViewportWidth(400);
    });

    it('should toggle mobile drawer', () => {
      store.openMobile();
      expect(store.mobileOpen()).toBe(true);
      expect(store.sidebarExpanded()).toBe(true);

      store.closeMobile();
      expect(store.mobileOpen()).toBe(false);
    });

    it('should close mobile drawer after navigation', () => {
      store.openMobile();
      routerEventsSubject.next(new NavigationEnd(1, '/new', '/new'));
      expect(store.mobileOpen()).toBe(false);
    });
  });

  describe('Extension Specific Logic', () => {
    beforeEach(() => {
      (globalThis as any).__TD_EXTENSION__ = true;
      createStore();
      // Spy on postMessage of the real parent (jsdom: parent === window)
      postMessageSpy = jest
        .spyOn(globalThis.parent as any, 'postMessage')
        .mockImplementation(() => {});
    });

    afterEach(() => {
      postMessageSpy?.mockRestore();
    });

    it('should not allow mobile drawer in extension mode', () => {
      store.openMobile();
      expect(store.mobileOpen()).toBe(false);
      expect(store.isMobile()).toBe(false); // isMobile is always false in extension
    });

    it('should handle navigation toggle logic (hide if same route)', async () => {
      routerEventsSubject.next(new NavigationEnd(1, '/test', '/test'));

      // Click same route -> should go to _blank
      await store.onItemClick({ id: 'test', label: 'Test', icon: 'i', route: '/test' });
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/_blank');
    });

    it('should navigate normally if different route', async () => {
      routerEventsSubject.next(new NavigationEnd(1, '/home', '/home'));

      await store.onItemClick({ id: 'test', label: 'Test', icon: 'i', route: '/test' });
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/test');
    });

    it('should hide page content when URL is _blank', () => {
      routerEventsSubject.next(new NavigationEnd(1, '/_blank', '/_blank'));
      expect(store.showPage()).toBe(false);
    });

    it('should send postMessage to parent on navigation', () => {
      routerEventsSubject.next(new NavigationEnd(1, '/test', '/test'));
      expect(globalThis.parent.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'TD_UI_DRAWER' }),
        '*'
      );
    });
  });
});
