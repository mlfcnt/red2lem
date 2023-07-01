<script lang="ts">
	import subreddits from '../subreddits.json';

	let formattedSubList: string[] = [];

	const handleSubmit = (subList: string) => {
		console.log(subList);
		formattedSubList = subList.replace('https://www.reddit.com/r/', '').split('+');
	};

	const getLemmyEquivalent = (subreddit: string) => {
		const lemmyLink = subreddits.subs
			.find((x) => x.name.replace('r/', '').toLowerCase() === subreddit.toLowerCase())
			?.links.find((x) => x.service === 'lemmy')?.url;
		return lemmyLink || '';
	};
</script>

<h1>Reddit to Lemmy</h1>

<form
	on:submit={(e) => {
		e.preventDefault();
		handleSubmit(e.currentTarget.url.value);
	}}
>
	<label for="url">Paste here</label>
	<textarea name="url" id="url" cols="30" rows="10" />
	<button type="submit">Generate</button>

	<h2>Sub list</h2>
	<ul>
		{#each formattedSubList as sub}
			<li>
				{sub} : {getLemmyEquivalent(sub)}
			</li>
		{/each}
	</ul>
</form>
