<script lang="ts">
    import {onMount, type Snippet} from "svelte";
    import { Keymap } from "../../typescript/keymap";

    interface Props {
        children: Snippet;
        footer?: Snippet;
        size?: Sizes,
        title: string;
        canClose?: boolean;
        id: string;
        self?: HTMLDialogElement;
        "h-full"?: boolean;
    }

    let {
        children,
        title,
        size = 'md',
        canClose = true,
        footer,
        id,
        "h-full": isFullHeight,
        self = $bindable()
    }: Props = $props();

    type Sizes = 'sm' | 'md' | 'lg';

    const sizes: Record<Sizes, string> = {
        sm: "w-11/12 max-w-sm",
        md: "w-11/12 max-w-lg",
        lg: "w-11/12 max-w-3xl"
    };

    let closeForm: HTMLFormElement | undefined = $state();

    onMount(() => {
        const keymap = new Keymap();

        keymap.register({
            key: "ESC",
            allowInInput: false,
            handler: () => closeForm?.requestSubmit()
        });
    })
</script>

<dialog {id} class="modal bg-transparent!" bind:this={self}>
    {#if canClose}
        <form method="dialog" class="modal-backdrop bg-transparent!">
            <button>close</button>
        </form>
    {/if}

    <div class="modal-box rounded-sm bg-black/90 {sizes[size]} {isFullHeight ? 'h-full' :
    'max-h-[85vh] flex flex-col overflow-hidden'}">
        {#if canClose}
            <form method="dialog" bind:this={closeForm}>
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10">✕</button>
            </form>
        {/if}

        <div class="flex flex-col gap-3 h-full min-h-0">
            <h3 class="text-lg font-bold shrink-0">{title}</h3>

            <div class="flex flex-col gap-3 flex-1 min-h-0 pr-1">
                {@render children?.()}
            </div>

            {#if footer}
                <div class="flex flex-col gap-1.5 mt-3 shrink-0">
                    <div class="flex flex-row justify-end gap-3">
                        {@render footer()}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</dialog>
