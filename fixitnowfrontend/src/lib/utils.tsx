"use server"

import { cacheLife } from "next/cache";

export async function TimeStamp() {
    "use cache";
    cacheLife("weeks");
    return <time>{new Date().getFullYear()} </time>
}