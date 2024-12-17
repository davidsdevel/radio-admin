'use server'

import { signIn } from "@/auth"


export async function googleLogin() {
    await signIn("google");
}


export async function facebookLogin() {
    await signIn("facebook");
}