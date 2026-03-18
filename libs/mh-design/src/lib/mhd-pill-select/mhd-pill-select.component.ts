import {
  ApplicationRef,
  Component,
  DestroyRef,
  ElementRef,
  EmbeddedViewRef,
  HostListener,
  TemplateRef,
  ViewChild,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';

export type PillSelectOption<T = string> = {
  label: string;
  value: T;
  iconUrl?: string; // ✅ optional icon
  disabled?: boolean;
};

@Component({
  selector: 'mhd-pill-select',
  standalone: true,
  templateUrl: './mhd-pill-select.component.html',
  styleUrls: ['./mhd-pill-select.component.scss'],
})
export class MhdPillSelectComponent<T = string> {
  // inputs
  options = input<PillSelectOption<T>[]>([]);
  placeholder = input('Select');
  accent = input('#ff3b30');

  /** ✅ multi-select toggle */
  multiple = input(false);
  multiLabel = input<
    (count: number, selected: T[], options: PillSelectOption<T>[]) => string
  >((count) => `${count} selected`);

  /** ✅ single value */
  value = model<T | null>(null);

  /** ✅ multi values */
  values = model<T[]>([]);

  // optional explicit outputs
  selected = output<T>();
  selectedMany = output<T[]>();

  @ViewChild('trigger', { static: true })
  triggerRef!: ElementRef<HTMLButtonElement>;

  @ViewChild('panelTpl', { static: true })
  panelTpl!: TemplateRef<unknown>;

  open = signal(false);
  activeIndex = signal(-1);

  selectedOption = computed(() => {
    if (this.multiple()) return null;
    const v = this.value();
    if (v === null) return null;
    return this.options().find((o) => o.value === v) ?? null;
  });

  triggerIconUrl = computed(() => this.selectedOption()?.iconUrl ?? null);

  // ---- selection helpers ----
  isSelected = (opt: PillSelectOption<T>) => {
    if (!this.multiple()) {
      const v = this.value();
      return v !== null && opt.value === v;
    }
    return this.values().some((v) => v === opt.value);
  };

  selectedLabel = computed(() => {
    if (!this.multiple()) {
      const v = this.value();
      const found = this.options().find((o) => v !== null && o.value === v);
      return found?.label ?? this.placeholder();
    }

    const selected = this.values();
    if (!selected.length) return this.placeholder();

    return this.multiLabel()(selected.length, selected, this.options());
  });

  // ---- overlay plumbing ----
  private appRef = inject(ApplicationRef);
  private destroyRef = inject(DestroyRef);

  private overlayHost: HTMLDivElement | null = null;
  private panelView: EmbeddedViewRef<unknown> | null = null;
  private removeRepositionListeners: (() => void) | null = null;

  toggle() {
    const next = !this.open();
    this.open.set(next);

    if (next) {
      const opts = this.options();
      const firstEnabled = Math.max(
        0,
        opts.findIndex((o) => !o.disabled)
      );
      this.activeIndex.set(firstEnabled);
      this.openOverlay();
    } else {
      this.activeIndex.set(-1);
      this.closeOverlay();
    }
  }

  close() {
    this.open.set(false);
    this.activeIndex.set(-1);
    this.closeOverlay();
  }

  /** ✅ handles both single + multi */
  selectOption(opt: PillSelectOption<T>) {
    if (opt.disabled) return;

    // single: set + close (your old behavior)
    if (!this.multiple()) {
      this.value.set(opt.value);
      this.selected.emit(opt.value);
      this.close();
      this.triggerRef.nativeElement.focus();
      return;
    }

    // multi: toggle, keep open
    const cur = this.values();
    const exists = cur.some((v) => v === opt.value);
    const next = exists
      ? cur.filter((v) => v !== opt.value)
      : [...cur, opt.value];
    this.values.set(next);
    this.selectedMany.emit(next);

    // keep focus on trigger for keyboard continuity (and because panel is in body)
    this.triggerRef.nativeElement.focus();

    // panel remains open in multi mode; it will close on outside click / Escape / trigger toggle
  }

  // Close on outside click (must check both trigger and overlay)
  @HostListener('document:mousedown', ['$event'])
  onDocMouseDown(e: MouseEvent) {
    if (!this.open()) return;

    const target = e.target as Node;
    const triggerEl = this.triggerRef.nativeElement;

    const clickedTrigger = triggerEl.contains(target);
    const clickedPanel = this.overlayHost?.contains(target) ?? false;

    if (!clickedTrigger && !clickedPanel) this.close();
  }

  // Keyboard support
  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (!this.open()) {
      if ((e.key === 'Enter' || e.key === ' ') && this.isTriggerFocused()) {
        e.preventDefault();
        this.toggle();
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.move(1);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.move(-1);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const i = this.activeIndex();
      const opt = this.options()[i];
      if (opt) this.selectOption(opt);
    }
  }

  private move(delta: number) {
    const opts = this.options();
    if (!opts.length) return;

    let i = this.activeIndex();
    for (let step = 0; step < opts.length; step++) {
      i = (i + delta + opts.length) % opts.length;
      if (!opts[i].disabled) {
        this.activeIndex.set(i);
        return;
      }
    }
  }

  private isTriggerFocused(): boolean {
    return document.activeElement === this.triggerRef?.nativeElement;
  }

  // -------------------- Overlay implementation --------------------

  private openOverlay() {
    if (this.overlayHost) return;

    const host = document.createElement('div');
    host.className = 'mhd-pill-select-overlay-host';
    host.style.position = 'fixed';
    host.style.left = '0px';
    host.style.top = '0px';
    host.style.zIndex = '2147483647';
    document.body.appendChild(host);

    this.overlayHost = host;

    const view = this.panelTpl.createEmbeddedView({});
    this.panelView = view;
    this.appRef.attachView(view);
    view.detectChanges();

    for (const node of view.rootNodes) host.appendChild(node);

    requestAnimationFrame(() => this.repositionOverlay());

    const onReposition = () => this.repositionOverlay();
    window.addEventListener('resize', onReposition, { passive: true });
    // capture scroll events from nested scroll containers too
    window.addEventListener('scroll', onReposition, {
      passive: true,
      capture: true,
    });

    this.removeRepositionListeners = () => {
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true as any);
    };

    this.destroyRef.onDestroy(() => this.closeOverlay());
  }

  private closeOverlay() {
    this.removeRepositionListeners?.();
    this.removeRepositionListeners = null;

    if (this.panelView) {
      this.appRef.detachView(this.panelView);
      this.panelView.destroy();
      this.panelView = null;
    }

    if (this.overlayHost) {
      this.overlayHost.remove();
      this.overlayHost = null;
    }
  }

  private repositionOverlay() {
    if (!this.overlayHost) return;

    const triggerEl = this.triggerRef.nativeElement;
    const rect = triggerEl.getBoundingClientRect();

    const panelEl = this.overlayHost.querySelector(
      '.panel'
    ) as HTMLElement | null;
    if (!panelEl) return;

    const gap = 10;
    const padding = 8;

    // Ensure we measure after styles apply
    const panelRect = panelEl.getBoundingClientRect();
    const panelW = panelRect.width;
    const panelH = panelRect.height;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // flip up if needed
    const spaceBelow = vh - rect.bottom;
    const spaceAbove = rect.top;
    const openUp = spaceBelow < panelH + gap && spaceAbove > spaceBelow;

    let top = openUp ? rect.top - panelH - gap : rect.bottom + gap;
    top = Math.max(padding, Math.min(top, vh - panelH - padding));

    // start aligned to trigger left
    let left = rect.left;

    // clamp horizontally to keep fully onscreen
    if (left + panelW > vw - padding) left = vw - panelW - padding;
    left = Math.max(padding, Math.min(left, vw - panelW - padding));

    this.overlayHost.style.transform = `translate3d(${Math.round(
      left
    )}px, ${Math.round(top)}px, 0)`;
  }
}
