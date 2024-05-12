import NextAuth from "next-auth/next";
import Email from "next-auth/providers/email";

declare module "next-auth"{
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            accessToken: string;
            image: string;
        }
    }
    
}