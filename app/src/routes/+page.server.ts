import {fail, redirect } from '@sveltejs/kit';
import pb from '$lib/db';




export async function load({cookies} : {cookies: any}){
    console.log('VITE_POCKETBASE_URL:', import.meta.env.VITE_POCKETBASE_URL);
    const apiUrl = import.meta.env.VITE_POCKETBASE_URL;
    const endpoint = `${apiUrl}/api/collections/users/records`;
    console.log('Full URL:', endpoint);

    if(cookies.get('user')){
        redirect(308, '/todos')
    }
}




export const actions = {
    createAcounte: async ({ request, cookies }: { request: Request; cookies: any }) => {

        if (pb.authStore.isValid) {
            pb.authStore.clear();
        }

        const data: FormData = await request.formData();
        console.log(data);
   
        try {
            if(String(data.get('password'))?.length<8) throw Error("Password must atleast be 8 characters");
            if(data.get("password") != data.get("passwordConfirm")) throw Error("Password conformation failed");
        } catch (error) {
            return fail(400, {
                error: (error as Error).message
            })
        }
        const datac: {
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
            await pb.collection('users').create(datac);
        } catch (error) {
            return fail(400, {
                error: (error as Error).message
            })
        }
        
        try {
            await pb.collection('users').authWithPassword(data.get('email') as string, data.get('password') as string);
            cookies.set('user', pb.authStore.record?.id as string, { path:'/' });
            cookies.set('username', pb.authStore.record?.name as string, { path:'/' });
            console.log('done');
        } catch (error) {
            return fail(400, {
                error: (error as Error).message
            });
        }

        redirect(308, '/todos');
        
    },
    login: async ({ request, cookies }: { request: Request; cookies: any }) => {
        const data: FormData = await request.formData();
        await pb.collection('users').authWithPassword(data.get('email') as string, data.get('password') as string);
        cookies.set('user', pb.authStore.record?.id as string, { path:'/' });
        cookies.set('username', pb.authStore.record?.name as string, { path:'/' });
        console.log('done');
        try {
            
        } catch (error) {
            return fail(400, {
                error2: (error as Error).message
            });
        }

        redirect(308, '/todos');
    }
};