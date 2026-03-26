import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import { MhdButtonComponent } from '../button/mhd-button.component';
import { MhdDropdownComponent } from '../dropdown/mhd-dropdown.component';
import { MhdSelectTriggerComponent } from '../select-trigger/mhd-select-trigger.component';

export type MhdDateRangeMode = 'single' | 'range';

export interface MhdDateRangeValue {
  mode: MhdDateRangeMode;
  start: string;
  end: string;
  preset?: string;
  label?: string;
}

interface MhdDatePresetDefinition {
  id: string;
  label: string;
  getValue(today: DateTime): MhdDateRangeValue;
}

@Component({
  selector: 'mhd-date-range-select',
  standalone: true,
  imports: [
    CommonModule,
    MhdButtonComponent,
    MhdDropdownComponent,
    MhdSelectTriggerComponent,
  ],
  templateUrl: './mhd-date-range-select.component.html',
  styleUrl: './mhd-date-range-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdDateRangeSelectComponent {
  readonly placeholder = input('Select date');
  readonly disabled = input(false);
  readonly compact = input(false);
  readonly zone = input('Europe/Brussels');
  readonly minPanelWidth = input(760);

  readonly value = model<MhdDateRangeValue>({
    mode: 'single',
    start: DateTime.now().toISODate() ?? '',
    end: DateTime.now().toISODate() ?? '',
    preset: 'today',
    label: 'Today',
  });

  protected readonly open = signal(false);

  protected readonly draftMode = signal<MhdDateRangeMode>('single');
  protected readonly draftStart = signal('');
  protected readonly draftEnd = signal('');
  protected readonly draftPreset = signal('');

  protected readonly displayLabel = computed(() => {
    const current = this.value();

    if (current.label) {
      return current.label;
    }

    return this.formatLabel(current);
  });

  protected readonly canApply = computed(() => {
    const start = this.draftStart();
    const end =
      this.draftMode() === 'single' ? this.draftStart() : this.draftEnd();

    return !!start && !!end;
  });

  protected readonly presets = computed<MhdDatePresetDefinition[]>(() => [
    {
      id: 'today',
      label: 'Today (live)',
      getValue: (today) => ({
        mode: 'single',
        start: today.toISODate() ?? '',
        end: today.toISODate() ?? '',
        preset: 'today',
        label: 'Today (live)',
      }),
    },
    {
      id: 'yesterday',
      label: 'Yesterday',
      getValue: (today) => {
        const date = today.minus({ days: 1 });
        return {
          mode: 'single',
          start: date.toISODate() ?? '',
          end: date.toISODate() ?? '',
          preset: 'yesterday',
          label: 'Yesterday',
        };
      },
    },
    {
      id: 'day-before-yesterday',
      label: 'Day before yesterday',
      getValue: (today) => {
        const date = today.minus({ days: 2 });
        return {
          mode: 'single',
          start: date.toISODate() ?? '',
          end: date.toISODate() ?? '',
          preset: 'day-before-yesterday',
          label: 'Day before yesterday',
        };
      },
    },
    {
      id: 'last-7-days',
      label: 'Last 7 days',
      getValue: (today) => ({
        mode: 'range',
        start: today.minus({ days: 6 }).toISODate() ?? '',
        end: today.toISODate() ?? '',
        preset: 'last-7-days',
        label: 'Last 7 days',
      }),
    },
    {
      id: 'last-30-days',
      label: 'Last 30 days',
      getValue: (today) => ({
        mode: 'range',
        start: today.minus({ days: 29 }).toISODate() ?? '',
        end: today.toISODate() ?? '',
        preset: 'last-30-days',
        label: 'Last 30 days',
      }),
    },
    {
      id: 'this-month',
      label: 'This month',
      getValue: (today) => ({
        mode: 'range',
        start: today.startOf('month').toISODate() ?? '',
        end: today.toISODate() ?? '',
        preset: 'this-month',
        label: 'This month',
      }),
    },
  ]);

  protected openPanel(): void {
    if (this.disabled()) {
      return;
    }

    this.syncDraftFromValue();
    this.open.set(true);
  }

  protected closePanel(): void {
    this.open.set(false);
  }

  protected setDraftMode(mode: MhdDateRangeMode): void {
    this.draftMode.set(mode);
    this.draftPreset.set('');

    if (mode === 'single' && this.draftStart()) {
      this.draftEnd.set(this.draftStart());
    }
  }

  protected applyPreset(presetId: string): void {
    const preset = this.presets().find((item) => item.id === presetId);

    if (!preset) {
      return;
    }

    const value = preset.getValue(this.today());
    this.draftMode.set(value.mode);
    this.draftStart.set(value.start);
    this.draftEnd.set(value.end);
    this.draftPreset.set(value.preset ?? '');
  }

  protected setDraftStart(value: string): void {
    this.draftStart.set(value);
    this.draftPreset.set('');

    if (this.draftMode() === 'single') {
      this.draftEnd.set(value);
    }
  }

  protected setDraftEnd(value: string): void {
    this.draftEnd.set(value);
    this.draftPreset.set('');
  }

  protected handleStartInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.setDraftStart(value);
  }

  protected handleEndInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.setDraftEnd(value);
  }

  protected applyDraft(): void {
    if (!this.canApply()) {
      return;
    }

    const normalized = this.normalizeDraftValue();
    this.value.set({
      ...normalized,
      label: this.resolveLabel(normalized),
    });
    this.open.set(false);
  }

  private syncDraftFromValue(): void {
    const current = this.value();

    this.draftMode.set(current.mode);
    this.draftStart.set(current.start);
    this.draftEnd.set(current.end);
    this.draftPreset.set(current.preset ?? '');
  }

  private normalizeDraftValue(): MhdDateRangeValue {
    const mode = this.draftMode();
    const start = this.draftStart();
    const rawEnd = mode === 'single' ? start : this.draftEnd();

    const startDate = DateTime.fromISO(start, { zone: this.zone() });
    const endDate = DateTime.fromISO(rawEnd, { zone: this.zone() });

    if (startDate.isValid && endDate.isValid && endDate < startDate) {
      return {
        mode,
        start: endDate.toISODate() ?? '',
        end: startDate.toISODate() ?? '',
        preset: '',
      };
    }

    return {
      mode,
      start,
      end: rawEnd,
      preset: this.draftPreset(),
    };
  }

  private resolveLabel(value: MhdDateRangeValue): string {
    const preset = this.presets().find((item) => item.id === value.preset);

    if (preset) {
      return preset.label;
    }

    return this.formatLabel(value);
  }

  private formatLabel(value: MhdDateRangeValue): string {
    const start = DateTime.fromISO(value.start, { zone: this.zone() });
    const end = DateTime.fromISO(value.end, { zone: this.zone() });

    if (!start.isValid) {
      return this.placeholder();
    }

    if (value.mode === 'single' || value.start === value.end || !end.isValid) {
      return start.toFormat('dd/MM/yyyy');
    }

    return `${start.toFormat('dd/MM/yyyy')} - ${end.toFormat('dd/MM/yyyy')}`;
  }

  private today(): DateTime {
    return DateTime.now().setZone(this.zone()).startOf('day');
  }
}
