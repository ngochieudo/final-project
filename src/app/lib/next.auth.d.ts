import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      image: string;
      email: string;
      createdAt: Date;
      updatedAt: Date;
      favoriteIds: [];
      isAdmin: boolean;
    };

    backendTokens: {
        accessToken: string;
        refreshToken: string;
    }
  }
} 

import { JWT } from 'next-auth/jwt';

declare module "next-auth/jwt"{
    interface JWT {
        user: {
            id: string;
            name: string;
            image: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            favoriteIds: [];
            isAdmin: boolean;
          };
      
          backendTokens: {
              accessToken: string;
              refreshToken: string;
          }
    }
}