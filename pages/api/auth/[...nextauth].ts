import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import { Backend_URL } from "@/app/lib/Constants"


export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith",
        },
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const {email, password} = credentials;

        const res = await fetch(`${Backend_URL}/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            email,
            password
          }),
          headers: {
            "Content-Type": "application/json",
          }
          
        });


      if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to log in"); 
      }
        const user = await res.json();
        return user;
      }
    })
  ],
  pages: {
    signIn: '/',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
    maxAge: 60 * 60
  },
  jwt: {
    maxAge: 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({token, user}) {
      if(user) {
        return { ...token, ...user,};
      }

      return token
    },

    async session({token, session}) {
      session.user = token.user;
      session.backendTokens = token.backendTokens;

      return session;
    }
  }

};

export default NextAuth(authOptions);