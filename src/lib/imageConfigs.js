export const siteSettingsImageConfigs = {
  headerImage: {
    fileName: 'header',
    savePath: 'public/assets/images/site'
  },
  footerImage: {
    fileName: 'footer',
    savePath: 'public/assets/images/site'
  },
  favicon: {
    fileName: 'favicon',
    savePath: 'public/assets/images/site'
  },
  watermark: {
    fileName: 'watermark',
    savePath: 'public/assets/images/site'
  },
  siteLoader: {
    fileName: 'loader',
    savePath: 'public/assets/images/site'
  },
  adsBanner: {
    fileName: 'ads-banner',
    savePath: 'public/assets/images/site'
  }
};

export const newsImageConfigs = (newsTitle) => ({
  file: {
    fileName: newsTitle,
    prefix: 'watermarked_img',
    savePath: 'public/assets/images'
  },
  large: {
    fileName: newsTitle,
    prefix: 'lg_img',
    savePath: 'public/assets/images'
  },
  medium: {
    fileName: newsTitle,
    prefix: 'md_img',
    savePath: 'public/assets/images'
  },
  small: {
    fileName: newsTitle,
    prefix: 'sm_img',
    savePath: 'public/assets/images'
  }
});

export const profileImageConfig = (userId) => ({
  profileImage: {
    fileName: `user-${userId}`,
    prefix: 'profile',
    savePath: 'public/assets/images/users/profiles'
  }
});