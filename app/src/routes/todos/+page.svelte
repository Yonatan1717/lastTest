<script lang="ts">
  
  import * as Table from "$lib/components/ui/table/index.js";
  import { enhance } from '$app/forms';
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import {fly} from "svelte/transition";
  
  let {data, form} : {data:any, form: any} = $props();
  let deleted: string[] = $state([])

</script>
 
<h1 style="width: fit-content;margin-left:auto;margin-right:auto;margin-top:60px; font-size:xx-large">{data.name.toUpperCase()}'s Todo list</h1>
<div class="sentreralt">
  <Card.Root class="w-[350px]">
    <Card.Header>
      <Card.Title class="text-center">New todo</Card.Title>
      <!-- <Card.Description class="text-center"></Card.Description> -->
    </Card.Header>
    <Card.Content>
      <form method="POST" action="?/create" use:enhance>
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-1.5">
            <Textarea id="name" autocomplete="off" name="description" placeholder="Description"/>
          </div>
          {#if form?.error}
                <p style="color:red; font-size:small">{form.error}</p>
          {/if}
          <Button type="submit" class="font-bold">Add</Button>
        </div>
      </form>
    </Card.Content>
  </Card.Root>

  <!-- todo liste -->

  <Table.Root style="margin-top:40px; overflow:hidden;">
  <Table.Caption>
      {#if data.results[0] !== undefined}
        Looks like you have something to finish 🤔
      {:else}
          All done good job<p style:opacity=0.3>but you can always do more 🫡</p>
      {/if}
  </Table.Caption>
  <Table.Header>
    <Table.Row>
    <Table.Head >Todo</Table.Head>
    <Table.Head class="w-[50px] text-center"></Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
  {#each data.results.filter((id:string) => !deleted.includes(id)) as todo (todo.id)}
    <Table.Row>
      <Table.Cell style="max-width: 350px;" class="font-medium"><p  out:fly={{duration:1000, x:350}} in:fly={{duration:1000, x:-650}}>{todo.description}</p></Table.Cell>
      <Table.Cell>
      <form method="POST" action="?/delete" use:enhance={()=>{
          deleted = [...deleted, todo.id];
          return async ({update}:{update: any}) => {
              await update();
              deleted = deleted.filter((id) => id !== todo.id);
          }
      }}>
  
      <input type="hidden" name="id" value="{todo.id}">
      <button class="w-[20px] h-[20px] check" style="background:none" type="submit">🗑</button>
      </form>
      </Table.Cell>
    </Table.Row>
    {/each}
  </Table.Body>
  </Table.Root> 

  <form method="POST" action="?/logout" use:enhance>
  <Button class="logoutt font-bold" type="submit">logout</Button>
  </form>
</div>

    
