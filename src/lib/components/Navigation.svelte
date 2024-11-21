<script lang="ts">
  import { page } from '$app/stores';

  let items = [
  // {
  //   text: 'Home',
  //   url: '/',
  // },
  // {
  //   text: 'Lenders',
  //   url: '/lenders',
  // },
  {
    text: 'New Deal',
    url: '/',
  },
  {
    text: 'PDF Parse',
    url: '/pdfparse',
  },
  // {
  //   text: 'Help',
  //   url: '/help',
  // },
];

</script>
{#each items as item}
      <a
					class="btn btn-sm variant-ghost-surface m-1"
					href="{item.url}"
          class:active={$page.url.pathname === item.url}
				>
					{item.text}
				</a>
{/each}
    

