import type { ExpressiveCodeConfig, LicenseConfig, NavBarConfig, ProfileConfig, SiteConfig } from './types/config';
import { LinkPreset } from './types/config';

export const siteConfig: SiteConfig = {
  title: "dccif's Blog",
  subtitle: '记录一些心得',
  lang: 'zh_CN',
  themeColor: { hue: 250, fixed: false },
  banner: {
    enable: true,
    src: 'assets/images/banner.webp',
    position: 'center',
    credit: { enable: false, text: '', url: '' },
  },
  toc: { enable: true, depth: 3 },
  favicon: [{ src: '/assets/favicon-32x32.png', sizes: '32x32' }, { src: '/assets/favicon-16x16.png', sizes: '16x16' }],
};
export const navBarConfig: NavBarConfig = {
  links: [LinkPreset.Home, LinkPreset.Archive, LinkPreset.About,
    { name: 'GitHub', url: 'https://github.com/dccif', external: true }],
};
export const profileConfig: ProfileConfig = {
  avatar: 'assets/images/avatar.webp',
  name: 'Barry He',
  bio: '记录技术、生活与偶尔的灵感。',
  links: [{ name: 'GitHub', icon: 'fa6-brands:github', url: 'https://github.com/dccif' }],
};
export const licenseConfig: LicenseConfig = {
  enable: true, name: 'CC BY-NC-SA 4.0', url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
};
export const expressiveCodeConfig: ExpressiveCodeConfig = { theme: 'github-dark' };
