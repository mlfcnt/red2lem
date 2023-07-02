// thanks to https://sub.rehab/ 💖💖

export const fetchSubreddits = async () =>
	fetch('https://raw.githubusercontent.com/GeorgeSG/sub.rehab/master/data/subreddits.json').then(
		(res) => res.json()
	);
