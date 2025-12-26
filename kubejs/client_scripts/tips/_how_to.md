# Why

The mod which this modpack relies on, aptly named [Tips](https://modrinth.com/mod/tips), stores _each individual tip_ as a single file. This allows modpack creators to override specific tips, customize when, where, and for how long they appear. As a drawback, it makes writing multiple tips considerably more tedious, especially if you've never done it before.

I wrote a custom parser that, while severely limited in scope, _should_ make this process easier. The format described here is what said parser utilizes.


# Format description

> [!NOTE]
> Any mention of "text component" refers to Minecraft's own [**text components**](https://minecraft.wiki/w/Text_component_format/Before_Java_Edition_1.21.5), which are used across the game to stylize text.

Tips are stored as text files formatted in [JSON](https://simple.wikipedia.org/wiki/JSON). Each file contains the following entries:

`title` is the **text component** that will appear above every tip of this file. We can use this as a signature. If unsure, change only the `text` and `color` to your liking.

`helpful` is optional. If set to `true`, all listed tips are considered helpful and remain on screen for longer than normal.

`tips` is a list of **text components**, each representing a single tip that will be displayed. Each tip is separated by a comma.

> [!IMPORTANT]
> The JSON format needs a comma after each element **except the last**.
> Because of how easy it is to miss commas _(without the right text editor)_,
> I would suggest adding commas right between lines, like this:
> ```json
>	"tips": [
>		{"text": "Tip 1"}
>		,
>		{"text": "Tip 2", "italic": true}
>		,
>		{"text": "Tip 3", "bold": true}
>	]
> ```
> To check if the file is formatted correctly, copy and paste the file's contents in [JSONLint](https://jsonlint.com/), click on **Validate JSON** and see what it says!

As a general point of reference, check out the [_example.json](https://github.com/Mickeon/bubble-cobble-redux/blob/main/kubejs/client_scripts/tips/_example.json). This file is not actually used. It exists purely for demonstration.


# Adding a new tip

New tips can be inserted into the file's `tips` list.
If you want text to be stylized nicely, you may also take advantage of **text components**. There are several websites that make creating them a breeze.

- If using https://text.datapackhub.net/:
	- Look at the bottom-left
	- Click on **1.21.9+** and select **pre-1.21.5**
	- Ignore the warning, click on **Change version**
	- Begin writing whatever is in your mind
	- When you're done, click on the <img src="https://i.gyazo.com/53eb1ffb6d30e8461bd8e878b8ce4d39.png" width="16"/> icon on the bottom-left to copy the resulting **text component** to your clipboard
- If using https://minecraft.tools/en/json_text.php:
	- Begin writing whatever is in your mind
	- When you're done, scroll down
	- Click on **Generate JSON Text**
	- Copy the resulting **text component** from **JSON SYNTAX FOR MINECRAFT JAVA EDITION (1.16+)** to your clipboard

Then, in your file, look at the `tips` list.
Add a comma **after the last element in the list**, then paste what you have in the clipboard **as a single element** in the list.

<img src="https://i.gyazo.com/b712d141ca540d150bfed381cc213b18.gif">


When editing, you may notice that **text components** are quite powerful and feature-packed. However, tips are limited by their implementation, as well as the used Minecraft version. Beware of the following limitations:
- **Shadow color** is not supported
- **Click** events (open URLs) are not supported
- **Hover** events are not supported
- **Selectors** and other context-dependent features are not supported
- Lines of text will wrap around if they're too long
	- They cover **35%** (roughly 1/3) of the screen's width
	- Dividing text with new lines (`\n`) *is* supported
	- There is no vertical limit...

The rest should be fair game.


## Tips on... adding tips

First I must state that, at the end of the day, we're all buddies. The mere fact that tips are written for each other is endearing on its own.
Still, keep in mind, these "tips" are bound to repeat and, for the most part, are not going to be helpful in the slightest. So make them worth. **Quality over quantity**. Give us a sensible chuckle.

- Think about how [Forspoken](https://www.youtube.com/watch?v=1zo3jPUPbeI) would have written these so you can vehemently shoot yourself down while putting them on paper
- Write them like suggestions, popups, or notifications at most. Should be easy, right?
- Avoid humiliating and generally demeaning messages
	- That is to say, _"You are mentally ill"_ is not nice
- Avoid repetitive tips copied straight from other media
	- Yes, I know you played _Fallout 4_. Maybe these are amusing to read once, but the amusement quickly wears off when 10 derived from the same game appear in succession.
- Genuinely helpful tips, even in their quirkiness, **are** encouraged
	- You may get a feeling for writing them as you play
