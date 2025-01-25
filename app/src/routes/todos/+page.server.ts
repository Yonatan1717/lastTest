import { fail, redirect } from '@sveltejs/kit';
import pb from '$lib/db';

  

export async function load({ cookies }: { cookies: any }): Promise<{ results?: any[], name: string }> {
    
    let user: string | null = cookies.get('user'); // henter ut bruker id

    if (user) { // hvis cookien existerer hent tilhørende todo for brukern og retuner den 
        const results: any[] = await pb.collection("todos").getFullList(200, {
            filter: `user="${user}"`
        });
        console.log(results);
        return {
            results,
            name: cookies.get("username")
        };
    }
    
    redirect(308, '/');
}


export const actions = {
    create: async ({cookies, request} : {cookies: any, request: Request}): Promise<void | object> => {
        if(!cookies.get('user')) return;
        const data: FormData =  await request.formData();
        try {
            if(String(data.get("description")).replaceAll(" ", "") == "") throw Error("Nothing to add.")
        } catch (error) {
            return fail(400, {
                error: (error as Error).message
            })
        }
        const crateData : {
            description: FormDataEntryValue | null,
            user: string
        } = {
            "description": data.get('description'),
            "user": cookies.get('user')
        }
        await pb.collection('todos').create(crateData);
    }, 
    logout: async ({cookies} : {cookies: any}): Promise<void> =>{
        cookies.delete('user', {path: '/'});
        cookies.delete('username', {path: '/'});
        redirect(308, '/');
    },
    delete: async ({request}: {request: Request}) : Promise<void> =>{
        const data: FormData = await request.formData();
        const id: any = data.get('id');
        await pb.collection('todos').delete(id);
    }
}