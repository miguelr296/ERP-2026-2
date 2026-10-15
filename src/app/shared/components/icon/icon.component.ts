import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const ICON_PATHS: Record<string, string> = {
  'angle-down': 'M7 10l5 5 5-5',
  plus: 'M12 5v14m-7-7h14',
  search: 'm21 21-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z',
  'angle-right': 'M10 7l5 5-5 5',
  'arrow-right': 'M5 12h13m-5-5 5 5-5 5',
  'arrow-up-right': 'M7 17 17 7m0 0H9m8 0v8',
  at: 'M16.5 8.5v5a3.5 3.5 0 1 1-3.5-3.5h4.5a4.5 4.5 0 1 1-1 8.7',
  bell: 'M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 22h4',
  briefcase: 'M4 7h16v13H4V7Zm4 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M4 12h16m-9 0v2h2v-2',
  bars: 'M4 6h16M4 12h16M4 18h16',
  box: 'm4 7 8-4 8 4v10l-8 4-8-4V7Zm0 0 8 4 8-4M12 11v10',
  'building-columns': 'M3 21h18M5 18V9m4 9V9m6 9V9m4 9V9M3 7l9-4 9 4H3Z',
  'chart-bar': 'M5 20V10m7 10V4m7 16v-7',
  check: 'm5 12 4 4L19 6',
  'check-circle': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-4-9 3 3 5-6',
  'chevron-down': 'm7 10 5 5 5-5',
  clock: 'M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  cog: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.4-3.5a7.7 7.7 0 0 0-.1-1l2-1.5-2-3.5-2.3.9a7.8 7.8 0 0 0-1.7-1L15 3h-4l-.3 2.4a7.8 7.8 0 0 0-1.7 1L6.7 5.5l-2 3.5 2 1.5a7.7 7.7 0 0 0 0 2L4.7 14l2 3.5 2.3-.9a7.8 7.8 0 0 0 1.7 1L11 20h4l.3-2.4a7.8 7.8 0 0 0 1.7-1l2.3.9 2-3.5-2-1.5c.1-.3.1-.7.1-1Z',
  file: 'M6 3h8l4 4v14H6V3Zm8 0v5h4M9 13h6m-6 4h6',
  home: 'm3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z',
  info: 'M12 17v-5m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  'info-circle': 'M12 17v-5m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  link: 'M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1m3.1 5a5 5 0 0 0-7.1-.1l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1',
  lock: 'M6 10h12v10H6V10Zm3 0V7a3 3 0 0 1 6 0v3',
  'map-marker': 'M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  pencil: 'm4 16-1 5 5-1L20 8l-4-4L4 16Zm9-9 4 4',
  shield: 'M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z',
  sitemap: 'M12 4v5m0 0H6v4m6-4h6v4M6 13v4m12-4v4M4 17h4m8 0h4M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM4 11a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm16 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
  'sign-out': 'M10 17l5-5-5-5m5 5H3m9-9h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7',
  'sliders-h': 'M4 6h16M4 12h16M4 18h16M8 4v4m8 2v4m-5 6v4',
  tag: 'm20 13-7 7-10-10V4h6l11 9ZM7 7h.01',
  times: 'M6 6l12 12M18 6 6 18',
  truck: 'M3 6h11v10H3V6Zm11 4h4l3 3v3h-7V10Zm-8 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm11 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  user: 'M20 21a8 8 0 0 0-16 0m12-12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-7a4 4 0 0 1 0 8m4 9v-2a4 4 0 0 0-3-3.9',
  wallet: 'M4 6h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Zm0 0V4a2 2 0 0 1 2-2h12v4m10 5h-5a2 2 0 1 0 0 4h5',
  wrench: 'm14.7 6.3 3 3M4 20l7.3-7.3m0 0a4.5 4.5 0 1 1 6.4-6.4l-2.1 2.1 2.1 2.1 2.1-2.1A4.5 4.5 0 0 1 13.3 13L6 20H4v-2l7.3-7.3Z',
  bolt: 'm13 2-9 12h7l-1 8 9-12h-7l1-8Z'
};

@Component({
  selector: 'app-icon',
  template: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path [attr.d]="path()" /></svg>',
  styles: `:host { display: inline-flex; width: 1em; height: 1em; flex: 0 0 auto; align-items: center; justify-content: center; vertical-align: -.125em; } svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  readonly name = input('info-circle');
  readonly path = computed(() => ICON_PATHS[this.name()] ?? ICON_PATHS['info-circle']);
}
