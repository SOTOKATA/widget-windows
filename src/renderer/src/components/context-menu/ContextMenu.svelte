<script lang="ts">
    import {tick} from "svelte";
    import type { ContextMenuData } from "./ContextMenuData";
    import type { ContextMenuItem } from "./contextMenu";

    let menuOpen = $state(false);
    let menuX = $state(0);
    let menuY = $state(0);
    let menuElement: HTMLElement;

    async function openContextMenu(event: MouseEvent) {
        event.preventDefault();

        menuX = event.clientX;
        menuY = event.clientY;

        menuOpen = true;

        await tick();

        const rect = menuElement.getBoundingClientRect();

        menuX = Math.min(
            event.clientX,
            window.innerWidth - rect.width - 8
        );

        menuY = Math.min(
            event.clientY,
            window.innerHeight - rect.height - 8
        );
    }

    function closeContextMenu() {
        menuOpen = false;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape')
            closeContextMenu();
    }

    interface Props {
        openContextMenu: ((mouseEvent: MouseEvent) => void) | undefined;
        data?: ContextMenuData;
    }

    let {
        openContextMenu: openMenu = $bindable(),
        data = { items: [], data: [] }
    }: Props = $props();

    openMenu = (mouseEvent: MouseEvent) => openContextMenu(mouseEvent);

    function invokeAction(action: ((data: any) => void) | undefined) {
        closeContextMenu();
        action?.(data.data);
    }
</script>

<svelte:window
    onclick={closeContextMenu}
    onkeydown={handleKeydown}
    onresize={closeContextMenu}
/>

{#if menuOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_interactive_supports_focus -->
    <div
            bind:this={menuElement}
            class="fixed z-50 overflow-visible"
            style:left="{menuX}px"
            style:top="{menuY}px"
            onclick={(event) => event.stopPropagation()}
            role="menu"
    >
        <ul
            class="menu bg-black/90 rounded-box w-56 border border-base-300 p-1 shadow-xl overflow-visible"
        >
            {#each data.items as item}
                {#if item.subItems}
                    {@render writeSubItems(item)}
                {:else}
                    {@render writeItem(item)}
                {/if}
            {/each}
        </ul>
    </div>
{/if}

{#snippet writeSubItems(item: ContextMenuItem)}
    <li>
        <details class="dropdown dropdown-right">
            <summary>
                <div class="flex flex-row gap-1 justify-start items-center text-xs font-semibold">
                    {#if item.icon}<item.icon size={14} />{/if}{item.label}
                </div>
            </summary>

            <ul class="dropdown-content menu bg-base-100 rounded-box z-[60] w-40 p-2 shadow-xl border border-base-300">
                {#each item.subItems ?? [] as subItem}
                    {@render writeItem(subItem)}
                {/each}
            </ul>
        </details>
    </li>
{/snippet}

{#snippet writeItem(item: ContextMenuItem)}
    <li><button
        class="btn btn-sm btn-ghost flex flex-row gap-1 justify-start items-center"
        onclick={() => invokeAction(item.action)}
    >
        {#if item.icon}<item.icon size={14} />{/if}
        {item.label}
    </button></li>
{/snippet}
