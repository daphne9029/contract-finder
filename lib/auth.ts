import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// 先只開放給這個信箱，之後要開放給全公司網域時，
// 把這裡換回檢查 profile.hd === 'tsagroup.com.tw' 即可
const ALLOWED_EMAILS = ['daphneyou@tsagroup.com.tw']

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const email = (profile as { email?: string } | undefined)?.email
      return !!email && ALLOWED_EMAILS.includes(email)
    },
  },
  pages: {
    error: '/auth-error',
  },
}
