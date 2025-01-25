import {fail, redirect } from '@sveltejs/kit';
import pb from '$lib/db';




export async function load({cookies} : {cookies: any}){
     if(cookies.get('user')){ // hvis cookie med nøkkel "user" eksisterer er personen fortsatt loget inn og dermed send til todo sidne
        redirect(308, '/todos')
    }
}




export const actions = {
    // lag bruker
    createAcounte: async ({ request, cookies }: { request: Request; cookies: any }) => {

        if (pb.authStore.isValid) { //fjerner autoresering hvis allerded existernde for sikkerhets skyld
            pb.authStore.clear();
        }

        const data: FormData = await request.formData(); // henter ut form data
   
        try {
            //skjekker om passord har riktig legdeg og at det sam svarer med bekrefteleses passordet.
            if(String(data.get('password'))?.length<8) throw Error("Password must atleast be 8 characters");
            if(data.get("password") != data.get("passwordConfirm")) throw Error("Password conformation failed");
        } catch (error) {
            return fail(400, {
                error: (error as Error).message
            })
        }

        const datac: { // data for ny bruker
            password: FormDataEntryValue | null;
            passwordConfirm: FormDataEntryValue | null;
            email: FormDataEntryValue | null;
            emailVisibility: boolean;
            verified: boolean;
            name: FormDataEntryValue | null;
        } = {
            "password": data.get("password"),
            "passwordConfirm": data.get("passwordConfirm"),
            "email": data.get("email"),
            "emailVisibility": true,
            "verified": false,
            "name": data.get("name")
        }; 

        try {
            await pb.collection('users').create(datac); // lager ny bruker
        } catch (error) {
            return fail(400, {
                error: "Something went wrong: It looks like there is already a user with this email."
            })
        }
        
        try {
            // Sørger for at brukeren blir loget inn med en gang 
            await pb.collection('users').authWithPassword(data.get('email') as string, data.get('password') as string);
            cookies.set('user', pb.authStore.record?.id as string, { path:'/' }); // setter en cookie som lagrer bruker id
            cookies.set('username', pb.authStore.record?.name as string, { path:'/' }); // // setter en cookie som lagrer bruker id
        } catch (error) {
            return fail(400, {
                error: (error as Error).message
            });
        }

        redirect(308, '/todos');
        
    },
    // Login
    login: async ({ request, cookies }: { request: Request; cookies: any }) => {

        const data: FormData = await request.formData();
        
        try {
            await pb.collection('users').authWithPassword(data.get('email') as string, data.get('password') as string); // autentiserer ved bruk av email og passord, brukes for å hente bruker id og navn
            cookies.set('user', pb.authStore.record?.id as string, { path:'/' }); // setter en cookie som lagrer bruker id
            cookies.set('username', pb.authStore.record?.name as string, { path:'/' }); // setter en cookie som lagrer bruker id
        } catch (error) {
            return fail(400, {
                error2: "Wrong email or passord"
            });
        }

        redirect(308, '/todos');
    }
};