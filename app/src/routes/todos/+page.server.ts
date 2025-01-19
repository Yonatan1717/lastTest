import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

const pb: PocketBase = new PocketBase("http://127.0.0.1:8090");

export async function load({ cookies }: { cookies: any }): Promise<{ results?: any[], name: string }> {
    
    let user: string | null = cookies.get('user');

    if (user) {
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
    create: async ({cookies, request} : {cookies: any, request: Request}): Promise<void> => {
        if(!cookies.get('user')) return;
        const data: FormData =  await request.formData();
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