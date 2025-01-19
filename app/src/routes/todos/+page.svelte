<!-- <script lang="ts">
    import { enhance } from '$app/forms';
    let {data} : {data:any} = $props();

    let deleted: string[] = $state([])
</script>

<form method="POST" action="?/create" use:enhance>
    <label>
        create acount
        <input name="description" placeholder="new todo">
    </label>
</form>

<form method="POST" action="?/logout" use:enhance>
    <label>
        log out
        <input type="submit">
    </label>
</form>

<ul>
    {#each data.results.filter((id:string) => !deleted.includes(id)) as todo (todo.id)}
    <li>{todo.description}
        <form method="POST" action="?/delete" use:enhance={()=>{
            deleted = [...deleted, todo.id];
            return async ({update}:{update: any}) => {
                await update();
                deleted = deleted.filter((id) => id !== todo.id);
            }
        }}>
            <input type="hidden" name="id" value="{todo.id}">
            <button aria-label="done">Done</button>
        </form></li>
    {/each}
</ul> -->

<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import { enhance } from '$app/forms';
    let {data} : {data:any} = $props();

    let deleted: string[] = $state([])
    import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
 
</script>
 
<h1 style="width: fit-content;margin-left:auto;margin-right:auto;margin-top:60px; font-size:xx-large">{data.name.toUpperCase()}'s Todo list</h1>
<div class="sentreralt">
<Card.Root class="w-[350px]">
  <Card.Header>
    <Card.Title class="text-center">New todo</Card.Title>
    <Card.Description class="text-center">Add a new todo</Card.Description>
  </Card.Header>
  <Card.Content>
    <form method="POST" action="?/create" use:enhance>
      <div class="grid w-full items-center gap-4">
        <div class="flex flex-col space-y-1.5">
          <Label for="description">description</Label>
          <Input id="name" autocomplete="off" name="description" placeholder="new todo"/>
        </div>
        <Button type="submit">Add</Button>
      </div>
    </form>
  </Card.Content>
</Card.Root>
    
   <Table.Root style="margin-top:40px">
    <Table.Caption>
        {#if data.results[0] !== undefined}
            Looks like you some have something to finsh
        {:else}
            All done good job<p style:opacity=0.3>but you can always do more 🫡</p>
        {/if}
    </Table.Caption>
    <Table.Header>
     <Table.Row>
      <Table.Head >Todo</Table.Head>
      <Table.Head class="w-[50px]">Status</Table.Head>
     </Table.Row>
    </Table.Header>
    <Table.Body>
    {#each data.results.filter((id:string) => !deleted.includes(id)) as todo (todo.id)}
      <Table.Row>
       <Table.Cell class="font-medium">{todo.description}</Table.Cell>
       <Table.Cell>
        <form method="POST" action="?/delete" use:enhance={()=>{
            deleted = [...deleted, todo.id];
            return async ({update}:{update: any}) => {
                await update();
                deleted = deleted.filter((id) => id !== todo.id);
            }
        }}>
    
        <input type="hidden" name="id" value="{todo.id}">
        <Button type="submit">Done</Button>
        </form>
        </Table.Cell>
      </Table.Row>
     {/each}
    </Table.Body>
   </Table.Root> 

   <form method="POST" action="?/logout" use:enhance>
    <Button class="logoutt" type="submit">logout</Button>
    </form>
</div>

    
