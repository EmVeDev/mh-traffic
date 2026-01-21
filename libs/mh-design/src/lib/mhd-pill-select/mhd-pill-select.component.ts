import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';

export type PillSelectOption<T = string> = {
  label: string;
  value: T;
  iconUrl?: string; // optional icon
  disabled?: boolean;
};

@Component({
  selector: 'mhd-pill-select',
  standalone: true,
  templateUrl: './mhd-pill-select.component.html',
  styleUrls: ['./mhd-pill-select.component.scss'],
})
export class MhdPillSelectComponent<T = string> {
  // Signal inputs
  options = input<PillSelectOption<T>[]>([]);
  placeholder = input('Select');
  accent = input('#ff3b30');
  panelWidth = input<string | null>(null);

  /** single-select */
  value = model<T | null>(null);

  /** multi-select values */
  values = model<T[]>([]);

  /** enable multi-select */
  multiple = input(false);

  // (optional) explicit outputs
  selected = output<T>();
  selectedMany = output<T[]>();

  @ViewChild('trigger', { static: true })
  triggerRef!: ElementRef<HTMLButtonElement>;

  open = signal(false);
  activeIndex = signal(-1);

  /** helper: is option selected */
  isSelected = (opt: PillSelectOption<T>) => {
    if (!this.multiple()) {
      const v = this.value();
      return v !== null && opt.value === v;
    }
    return this.values().some((v) => v === opt.value);
  };

  /** label for trigger */
  selectedLabel = computed(() => {
    if (!this.multiple()) {
      const v = this.value();
      const found = this.options().find((o) => v !== null && o.value === v);
      return found?.label ?? this.placeholder();
    }

    const selected = this.values();
    if (!selected.length) return this.placeholder();

    // simple UX: show count
    return `${selected.length} selected`;

    // to show actual labels, swap to:
    // const labels = this.options()
    //   .filter(o => selected.includes(o.value))
    //   .map(o => o.label);
    // return labels.join(', ');
  });

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
    } else {
      this.activeIndex.set(-1);
    }
  }

  close() {
    this.open.set(false);
    this.activeIndex.set(-1);
  }

  /** click/enter handler for an option */
  selectOption(opt: PillSelectOption<T>) {
    if (opt.disabled) return;

    // single select
    if (!this.multiple()) {
      this.value.set(opt.value);
      this.selected.emit(opt.value);

      this.close();
      this.triggerRef.nativeElement.focus();
      return;
    }

    // multi-select: toggle, keep open
    const current = this.values();
    const exists = current.some((v) => v === opt.value);
    const next = exists
      ? current.filter((v) => v !== opt.value)
      : [...current, opt.value];

    this.values.set(next);
    this.selectedMany.emit(next);
  }

  // Close on outside click
  @HostListener('document:mousedown', ['$event'])
  onDocMouseDown(e: MouseEvent) {
    if (!this.open()) return;

    const target = e.target as HTMLElement;
    const host = this.triggerRef.nativeElement.closest('.pill-select');
    if (host && !host.contains(target)) this.close();
  }

  // Keyboard support (basic)
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
}
