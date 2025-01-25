<script lang="ts">
    import { Button ,buttonVariants} from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { enhance } from '$app/forms';
    let {form} = $props();
  </script>


<div class="sentreralt">
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-1 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">Sign Up</h1>
          <p class="text-muted-foreground text-balance">
            Enter the required informasjon below to sign up
          </p>
        </div>
        <form method="POST" action="?/createAcounte" use:enhance>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="name">username</Label>
            <Input name="name" id="name" type="name" placeholder="username" required />
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input name="email" id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div class="grid gap-2">
            <!-- <div class="flex items-center"> -->
              <Label for="password">Password</Label>
            <!-- </div> -->
            <Input name="password" id="password" type="password" placeholder="8 charcter+ password" required />
          </div>
          <div class="grid gap-2">
            <!-- <div class="flex items-center"> -->
              <Label for="passwordConfirm">Confirm password</Label>
            <!-- </div> -->
            <Input name="passwordConfirm" id="passwordConfirm" type="password" placeholder="confirm password" required />
          </div>
          {#if form?.error}
              <p style:color="red">{form.error}</p>
          {/if}
          <Button type="submit" class="w-full">sign Up</Button>
        </div>
        </form> 
        <div class="mt-4 text-center text-sm">
          have an account?
          <Dialog.Root>
            <Dialog.Trigger class="link-button"
             >login</Dialog.Trigger>
            <Dialog.Content class="sm:max-w-[425px]">
             <Dialog.Header>
              <Dialog.Title class="text-center text-3xl font-bold">log in</Dialog.Title>
             </Dialog.Header>
             <form method="POST" action="?/login" use:enhance>
             <div class="grid gap-4 py-4">
              <div class="grid gap-2">
                <Label for="email"placeholder="m@example.com">email</Label>
               <Input type="email" name="email" id="email" class="col-span-3" required/>
              </div>
              <div class="grid gap-2">
                <Label for="password" >password</Label>
               <Input type="password" name="password" id="password" class="col-span-3" required/>
              </div>
              {#if form?.error2}
              <p style:color="red">{form.error2}</p>
              {/if}
             </div>
             <Dialog.Footer>
              <Button class="w-full" type="submit">login</Button>
             </Dialog.Footer>
            </form> 
            </Dialog.Content>
           </Dialog.Root>
        </div>
      </div>
    </div>
  </div>
</div>

 
