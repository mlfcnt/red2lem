<script lang="ts">
	import { Textarea } from '$components/ui/textarea';
	import { Button } from '$components/ui/button';
	import { Input } from '$components/ui/input';
	import { fetchSubreddits } from '$lib/helpers/fetch-subreddits';

	type Mapped = {
		reddit: string;
		lemmy: string;
		official: boolean;
	};

	let subreddits: any = {};

	$: {
		fetchSubreddits().then((data) => (subreddits = data));
	}

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

	const handleSubmit = (subList: string, instance: string) => {
		const formattedSubList = subList.replace('https://www.reddit.com/r/', '').split('+');
		mapped = formattedSubList
			.map((sub) => {
				const lemmyEquivalent = getLemmyEquivalent(sub);
				if (!lemmyEquivalent.url) {
					return {
						reddit: sub,
						lemmy: '',
						official: false
					};
				}
				const linkInstance = lemmyEquivalent.url.split('://')[1]?.split('/')[0];
				const lemmySubname = lemmyEquivalent.url.split('/c/')[1];
				return {
					reddit: sub,
					lemmy: `https://${instance}/c/${lemmySubname}@${linkInstance}`,
					official: lemmyEquivalent.official ?? false
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
			.find((x: any) => x.name.replace('r/', '').toLowerCase() === subreddit.toLowerCase())
			?.links.find((x: any) => x.service === 'lemmy');
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
		handleSubmit(e.currentTarget.url.value, e.currentTarget.instance.value);
	}}
>
	<div class="m-4">
		<ol>To get your list of subscribed subreddits :</ol>
		<li>
			go to <a href="https://www.reddit.com/subreddits/" target="_blank"
				>https://www.reddit.com/subreddits/</a
			>
		</li>
		<li>Right click on <b>multireddit of your subscriptions</b> (right side of screen)</li>
		<li>Copy the link</li>
	</div>

	<label for="url">Paste the link here</label>
	<Textarea
		name="url"
		id="url"
		cols="30"
		rows="10"
		class="m-4"
		required
		value="https://www.reddit.com/r/2healthbars+2meirl4meirl+4chan+AbruptChaos+AdultNeeds+ageprogresspics+AlaskanMalamute+alexa+alienationps4+AlinaLopez+Amadani+AMADisasters+amazfit+AmazfitBip+AncientAliens+Android+androidapps+AndroidGaming+AnimalsBeingConfused+AnimalTextGifs+AnissaKate+announcements+AntimatterDimensions+apexlegends+arcticmonkeys+ArmoryAndMachine2+arresteddevelopment+Art+ArtBattle+ArtisanVideos+asaakira+AshesofCreation+ashleysinclair+AskOuija+AskReddit+askscience+Asmongold+asmr+assholedesign+Astronomy+ATBGE+AteTheOnion+AwardSpeechEdits+awesomerobots+aww+babyelephantgifs+backpacking+BadRocketLeagueGoals+badUIbattles+BaPCSalesEurope+Barry+baymusic+beadsprites+behindthegifs+bestof+bestofrapgenius+BestOfReports+beta+betterCallSaul+BetterEveryLoop+beyondtwosouls+BikiniBottomTwitter+bindingofisaac+bing+blog+bloodborne+blues+bluesguitarist+blunderyears+bodyweightfitness+books+Borderlands+Bossfight+BrailleSkateboarding+breakingbad+brooklynninenine+buildapc+buildapcsales+buildapcsalesuk+c137+CampingandHiking+cardboard+CarolinaSweets+CarSexPorn+CelebrityFeet+Celebs+ChatGPT+ChildrenFallingOver+chiliadmystery+chromeos+circlejerk+ClickerHeroes+CNNmemes+coloringcorruptions+Colorization+CombatFootage+combinedgifs+ComedyCemetery+comedyheaven+Competitiveoverwatch+confuseddoggos+ConfusedTravolta+conspiracy+continuityporn+CookieClicker+coolguides+CozyPlaces+CrappyDesign+creepy+creepyasterisks+CrewsCrew+CultOfTheLamb+cumsluts+curvy+CustomPlayerCutscene+cyberpunkgame+dailyprogrammer+dancehall+DaniDaniels+dankchristianmemes+dankmemes+darkestdungeon+DarkSouls2+darksouls3+dataisbeautiful+deadcells+DeathStranding+DeepIntoYouTube+DestinyTheGame+Dexter+DHMIS+Diablo+diablo4+didsomebodysaychiliad+digitalnomad+DillionHarper+DiscJam+discoveredspecies+disneyvacation+dndmemes+DNSL+Documentaries+donaldglover+Downwell+DrDisrespectLive+Drizzy+DrosteEffect+Drumkits+drupal+dub+EarthPorn+edmundm+eldertrees+electronic_cigarette+Enhancement+Entrepreneur+europe+Evalovia+explainlikeimfive+facesitting+fakehistoryporn+FallGuysGame+feet+fightporn+FilthyFrank+FingeredGame+Fireteams+firstworldanarchists+Fitness+footbaww+FootFetish+footjobs+FortNiteBR+freeuse+Fuck2016+futureworldleaders+Futurology+gadgets+GameDeals+gamedetectives+gamedev+GamePhysics+GamersBeingBros+Games+Gamingcirclejerk+GetMotivated+GhanaSaysGoodbye+GifRecipes+gifs+GifTournament+GinaValentina+glitch_art+Glitch_in_the_Matrix+GlobalOffensive+GodofWar+gonewild+gonewildcolor+gonewildcurvy+GoogleCardboard+gorillaz+GrandTheftAutoV+GregoryVillemin+GrowCastle+GuitarHero+Hadouken+HailCorporate+HaleyReed+hearthstone+Helldivers+Heroes+HidoriRose+HighQualityGifs+hiking+Hiphopcirclejerk+hiphopheads+HipHopImages+HipHopTMZ+history+HistoryPorn+HitBoxPorn+hmmm+HogwartsLegacyGaming+holdmyfries+HolUp+horizon+HouseOfCards+houseplants+HumansBeingBros+husky+hydraulicpresschannel+IAmA+iamveryrandom+IdiotsFightingThings+idledice+idleon+idleslayer+ilerminaty+incremental_games+IndieGaming+instantbarbarians+InteriorDesign+InternetIsBeautiful+iQuit+IRLSideQuests+islam+ITcrowd+ItemShop+IWantOut+jackryan+JapaneseGameShows+javascript+Jcole+JimSterling+JosephineJackson+JustCause+Justfuckmyshitup+KalinaRyu+Kanye+Keratoconus+kickstarter+KidsAreFuckingStupid+kindafunny+KingdomHearts+kittensgame+KotakuInAction+lastimages+LatinaMilfs+latinas+lawbreakers+leahgotti+learnprogramming+LearnUselessTalents+leaves+led_zeppelin+LeftHanging+LenaPaul+lexiluna+LGOLED+lifeisstrange+LifeProTips+Ligue1+likeus+LineageOS+lingerie+LinkedInLunatics+listentothis+LiterallyUnbelievable+LittleCaprice+LivestreamFails+LobosJr+LOSC+lossofalovedone+lost+luciomains+lutsgames+Maidsex+makinghiphop+maleficent2333+malelivingspace+Marvel+marvelstudios+MechanicalKeyboards+MedievalThings+meirl+Metal+metalgearsolid+midnightsuns+mildlyinfuriating+mildlyinteresting+millionairemakers+MonsterHunter+MonthlyProgram+movies+Music+mxvsatv+MyPeopleNeedMe+NatureIsFuckingLit+natureismetal+necrodancer+NegativeWithGold+neovim+netflix+NetflixSpaceForce+nevertellmetheodds+news+NextbitRobin+nexus5x+nier+nintendo+NintendoSwitch+NLSSCircleJerk+NMSGalacticHub+nomanshigh+NoMansSkyCircleJerk+NoMansSkyTheGame+NoMoreBamboozles+nonononoyes+nonose+Norsemen+northernlion+nosleep+nostalgia+NostalgiaFapping+NotMyJob+nottheonion+NovaLauncher+nplusplus+NSFW411+nsfwasmr+nsfwcosplay+NuclearThrone+OctobersVeryOwn+ofcoursethatsathing+offmychest+oldpeoplefacebook+OldSchoolCool+OlliOlli+oneplus+OutOfTheLoop+OVERSUMO+OverwatchCirclejerk+OverwatchTMZ+OverwatchUniversity+Ozark+PandR+PartyParrot+passionx+pathofexile+PathOfExileBuilds+pathwaytomoresuccess+patientgamers+pcgaming+pcmasterrace+PeopleFuckingDying+peopleofwalmart+PERSoNA+Persona5+philosophy+PickAnAndroidForMe+pinkfloyd+PixelArt+PlaysOfTheYear+PlayStationPlus+pokemongo+porninaminute+potionseller+PouncingFoxes+powerwashingporn+Prematurecelebration+Prisonwallet+privacy+ProgrammerHorror+ProgrammerHumor+programminghorror+projectsession+PS4+PS4circlejerk+PS4Deals+PS4Tournaments+PS5+ps5deals+PSW+psychology+Psychonaut+Qult_Headquarters+radicalheights+raining+rareinsults+ReactForReddit+reactiongifs+reactjs+ReaganFoxx+reallifedoodles+realmoms+RebelGalaxy+reddeadfashion+reddeadmysteries+reddeadredemption+redditsync+redesign+redneckengineering+reggae+RelayForReddit+RemyLaCroix+RepressedGoneWild+rickandmorty+RidersRepublic+RidersRepublicSecrets+RileyReid+RLFashionAdvice+RnBHeads+RocketLeague+RocketLeagueEsports+RocketLeagueExchange+RocketLeagueFriends+rocketleaguesideswipe+roguelikedev+roguelikes+RoomPorn+RoseMonroe_+rust+SameGrassButGreener+samsunggalaxy+science+ScienceIsAmazing+ScottishPeopleTwitter+SCP+shestillsucking+ShitAmericansSay+Shitty_Car_Mods+shittyaskscience+shittybirdnests+shittyconspiracy+shittykickstarters+shittyreactiongifs+shittyrobots+ShittyTodayILearned+shockwaveporn+Showerthoughts+SideProject+skateboarding+SkaterXL+SkaterXLModding+SkyeBlueModel+slavs_squatting+slaythespire+SnowTheGame+soccer+sodadungeon+softwaregore+solotravel+southpark+space+speedrun+sports+sportsarefun+spotify+Stadia+StardewValley+Steep+StraightGirlsPlaying+StrangerThings+SubredditDrama+SubredditSimMeta+SubredditSimulator+SubSimulatorGPT2+SubSimulatorGPT2Meta+Substratum+Supermeatboy+sweatysex+SymmetraMains+SyncforLemmy+syncforreddit+syriancivilwar+tattoos+technicallythetruth+technology+techsupport+telescopes+television+textdoor+thanosdidnothingwrong+Tharsis+ThatPeelingFeeling+The_Bogdanoff+The_Crew+TheBoys+TheEndIsNigh+TheGoodPlace+TheStopGirl+TheWeeknd+TheWitness+theworldisflat+ThickThighs+ThingsCutInHalfPorn+thisismylifenow+THPS+tifu+TigerKing+TIHI+tiltshift+timeshiftedmemes+tippytaps+titanfall+titleporn+todayilearned+toomanypillows+TPB+trashyboner+TrialsGames+trippinthroughtime+Trophies+TrueTicTacToe+twitchplayspokemon+TwoPointHospital+TwoXChromosomes+typescript+u_Ariababeboobs+u_avanicks+u_CougarandtheCub+u_diet_marshmallow+u_est-mcmxcvii+u_fun-sized-asian+u_Gold-Fun4301+u_iitmythrowaway+u_jaileen1993+u_knightrider69x+u_Lola_Ward+u_MagicalPurpleKat+u_MiniLoona+u_missheels07+u_Ms_Honey_Jo_Clark+u_OneShySubmissive+u_PetiteKelliLove+u_shittymorph+u_slutty_damania+u_TheGoldenGilf+u_thembothot+u_TheSophiaRodriguez+u_Time_Lengthiness4389+u_TinyArabBaby+u_toffeelily+Ubuntu+UFOs+ultrawidemasterrace+unchartedmultiplayer+undelete+Undertale+UnexpectedThugLife+unknownvideos+UnnecessaryQuotes+UnresolvedMysteries+UpliftingNews+VALORANT+ValorantCompetitive+VampireSurvivors+Vaping+victoriasnooks+videos+vita+vscode+Warframe+watch_dogs+web_design+webdev+WebVR+weeabootales+Wellthatsucks+WEPES+wethebest+WeWantPlates+whitepeoplegifs+wholesomememes+WidescreenWallpaper+WikiLeaks+Windows10+windowshots+windowsinsiders+witcher+WizardofLegend+woahdude+worldnews+worstof+wowthanksimcured+WritingPrompts+WTF+xboxone+xdacirclejerk+Xiaomi+yakuzagames+YakuzaZero+ye_irl+youdontsurf+YoungThug+youseeingthisshit+youtube+ZaryaMains+zelda"
	/>
	<label for="instance">Lemmy instance</label>
	<Input
		name="instance"
		id="instance"
		class="m-4"
		placeholder="ex: lemmy.world, programming.dev, reddthat.com, ..."
		required
		value="programming.dev"
	/>
	<div class="flex justify-end">
		<Button type="submit">Generate</Button>
	</div>

	<!-- only display the rest if found or notFound -->
	{#if found.length || notFound.length}
		<p>
			This "equivalents list" is made possible by <a href="https://sub.rehab/" target="_blank"
				>https://sub.rehab/</a
			>
			and is updated regularly
		</p>

		<h2 class="text-3xl m-2">Subs list</h2>
		<h3 class="text-2xl my-4">Equivalent Found</h3>
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
		<h3 class="text-2xl my-4">Equivalent not found</h3>
		<ul>
			{#each notFound as f}
				<li>
					{f.reddit}
				</li>
			{/each}
		</ul>
	{/if}
</form>

<style>
	:global(body) {
		max-width: 80%;
		margin: auto;
	}
</style>
