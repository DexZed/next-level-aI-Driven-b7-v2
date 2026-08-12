"use server"
import { headers } from "next/headers";
import { auth } from "./auth";
import { cacheLife, cacheTag } from "next/cache";


export default async function getUserSession(){
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session;
}