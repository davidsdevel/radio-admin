import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const config = {
	session: {
		strategy: 'jwt',
	},
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        //TODO: Verify email access
        return profile.email_verified && profile.email.endsWith("@gmail.com")
      }
      return true // Do different verification for other providers that don't have `email_verified`
    },
  },
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    })
  ]
};

export const { handlers, signIn, signOut, auth } = NextAuth(config)
