import { MhdMultiSelectOption, MhdSelectOption } from '@mh-traffic/mh-design';

export function createPlatformOptions(): MhdMultiSelectOption[] {
  return [
    { value: 'www', label: 'www' },
    { value: 'mobile', label: 'mobile' },
    { value: 'app', label: 'app' },
  ];
}

export function createProductOptions(): MhdSelectOption[] {
  return [
    { value: 'all', label: 'All products' },
    { value: 'news', label: 'News' },
    { value: 'sport', label: 'Sport' },
    { value: 'premium', label: 'Premium' },
  ];
}

export function createReferrerOptions(): MhdSelectOption[] {
  return [
    { value: 'all', label: 'All referrers' },
    { value: 'direct', label: 'Direct' },
    { value: 'search', label: 'Search' },
    { value: 'social', label: 'Social' },
  ];
}

export function createAudienceTypeOptions(): MhdSelectOption[] {
  return [
    { value: 'all', label: 'All audience types' },
    { value: 'subscriber', label: 'Subscriber' },
    { value: 'registered', label: 'Registered' },
    { value: 'anonymous', label: 'Anonymous' },
  ];
}
