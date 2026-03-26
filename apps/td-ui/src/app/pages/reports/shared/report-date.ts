import { MhdDateRangeValue } from '@mh-traffic/mh-design';

export function createDefaultSingleDayValue(
  date = '2025-11-05'
): MhdDateRangeValue {
  return {
    mode: 'single',
    start: date,
    end: date,
    preset: '',
  };
}

export function getAnalysisTypeLabelFromDateRange(
  value: MhdDateRangeValue
): string {
  return value.mode === 'single' ? 'Single-day' : 'Multiple days';
}

export function getDateLabelFromDateRange(value: MhdDateRangeValue): string {
  return value.label ?? formatDateRangeFallback(value);
}

function formatDateRangeFallback(value: MhdDateRangeValue): string {
  if (value.mode === 'single' || value.start === value.end) {
    return formatIsoDateToDisplay(value.start);
  }

  return `${formatIsoDateToDisplay(value.start)} - ${formatIsoDateToDisplay(
    value.end
  )}`;
}

function formatIsoDateToDisplay(value: string): string {
  const [year, month, day] = value.split('-');

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}
