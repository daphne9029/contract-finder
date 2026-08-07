import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const ALLOWED_DOMAIN = 'tsagroup.com.tw'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const hd = (profile as { hd?: string } | undefined)?.hd
      return hd === ALLOWED_DOMAIN
    },
  },
  pages: {
    error: '/auth-error',
  },
}
