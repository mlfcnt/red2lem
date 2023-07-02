<script lang="ts">
	import { Textarea } from '$components/ui/textarea';
	import { Button } from '$components/ui/button';
	import subreddits from '../subreddits.json';

	type Mapped = {
		reddit: string;
		lemmy: string;
		official: boolean;
	};

	let mapped: Mapped[] = [];
	let notFound: Pick<Mapped, 'reddit'>[] = [];
	let found: Mapped[] = [];

	$: found = mapped
		.filter((x) => x.lemmy.length)
		.map((x) => ({
			reddit: x.reddit,
			lemmy: x.lemmy,
			official: x.official
		}));

	$: notFound = mapped.filter((x) => !x.lemmy).map((x) => ({ reddit: x.reddit }));

	console.log({ found, notFound });

	const handleSubmit = (subList: string) => {
		const formattedSubList = subList.replace('https://www.reddit.com/r/', '').split('+');
		mapped = formattedSubList
			.map((sub) => {
				const lemmyEquivalent = getLemmyEquivalent(sub);
				return {
					reddit: sub,
					lemmy: lemmyEquivalent.url,
					official: lemmyEquivalent.official
				};
			})
			// sort so the ones without lemmy equivalent are at the end
			// the ones with lemmy equivalent are at the top, sorted alphabetically
			.sort((a, b) => {
				if (a.lemmy && b.lemmy) {
					return a.reddit.localeCompare(b.reddit);
				}
				if (a.lemmy) {
					return -1;
				}
				if (b.lemmy) {
					return 1;
				}
				return 0;
			});
	};

	const getLemmyEquivalent = (subreddit: string) => {
		const lemmyLink = subreddits.subs
			.find((x) => x.name.replace('r/', '').toLowerCase() === subreddit.toLowerCase())
			?.links.find((x) => x.service === 'lemmy');
		return {
			url: lemmyLink?.url || '',
			official: lemmyLink?.official
		};
	};
</script>

<h1 class="text-center text-3xl pt-4">Reddit to Lemmy</h1>

<form
	on:submit={(e) => {
		e.preventDefault();
		handleSubmit(e.currentTarget.url.value);
	}}
>
	<div class="m-4">
		<ol>To get the list :</ol>
		<li>
			go to <a href="https://www.reddit.com/subreddits/" target="_blank"
				>https://www.reddit.com/subreddits/</a
			>
		</li>
		<li>Right click on <b>multireddit of your subscriptions</b> (right side of screen)</li>
		<li>Copy the link</li>
	</div>

	<label for="url">Paste the link here</label>
	<Textarea name="url" id="url" cols="30" rows="10" class="m-4" />
	<div class="flex justify-end">
		<Button type="submit">Generate</Button>
	</div>

	<h2 class="text-3xl m-2">Subs list</h2>
	<h3 class="text-2xl m-4">Equivalent Found</h3>
	<ul>
		{#each found as f}
			<li>
				{f.reddit} : <a href={f.lemmy} target="_blank">{f.lemmy}</a>
				{#if f.official}
					<span class="text-green-500">Official</span>
				{/if}
			</li>
		{/each}
	</ul>
	<h3 class="text-2xl m-4">Equivalent not found</h3>
	<ul>
		{#each notFound as f}
			<li>
				{f.reddit}
			</li>
		{/each}
	</ul>
</form>

<style>
	:global(body) {
		max-width: 80%;
		margin: auto;
	}
</style>
