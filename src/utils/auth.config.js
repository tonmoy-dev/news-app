export const authConfig = {
  session: {
    strategy: 'jwt',
  },
  providers: [],
  // Trust host depending on environment
  // trustHost: process.env.NODE_ENV === 'production',
  trustHost: true,
  // debug: process.env.NODE_ENV === 'development',
}