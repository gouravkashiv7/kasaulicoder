# Blog 18 draft: Do You Need an llms.txt File?

Status: DRAFT for Gourav's review. Not published. Nothing here has been added to the database.

## Fields for the admin form

- **title:** Do You Need an llms.txt File? What the Evidence Says
- **slug:** `do-you-need-llms-txt`
- **tagline:** It is being sold as the way to get noticed by AI. A study of 137,000 websites and Google's own guide tell a calmer story.
- **description (SEO, 155 chars max):** What llms.txt is, whether AI tools actually read it, what Google says about it, and when a small business should or should not bother adding one.
- **writtenBy:** Gourav Kashiv
- **mainImageUrl:** `/blog-covers/do-you-need-llms-txt.png` (1600x900, file is in `public/blog-covers/`; editable source is the `.svg` beside it)
- **status:** inactive until approved
- **Primary keyword:** do I need llms.txt
- **Secondary keywords:** what is llms.txt, llms.txt SEO, does llms.txt work, llms.txt vs robots.txt, llms.txt for small business
- **Alt headline options:** "llms.txt Explained: Useful File or Wasted Afternoon?" or "llms.txt: What It Is, Who Reads It, and Whether You Need One"

## Research notes (not part of the post)

Searched on 25 Nov 2026 for "llms.txt does it work". Two sources were read in full:

1. Ahrefs, "We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read" (15 June 2026): https://ahrefs.com/blog/llmstxt-study/
2. Google Search Central, "Optimizing your website for generative AI features on Google Search" (last updated 10 July 2026): https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

**Why this topic:** llms.txt is one of the most argued-about SEO topics of 2026, and agencies are selling it as a service. Most articles either promote it or dismiss it without data.

**Limits of the evidence (stated in the post):** the Ahrefs study covers websites that use an Ahrefs product. Ahrefs itself says these owners are more technical than average, so its 28% adoption figure is an upper bound. Other studies in the search results gave lower adoption figures (roughly 6% to 10%) with different samples; they were not read in full and are not quoted.

**Fact check list before publishing:**
1. Numbers from Ahrefs: 137,210 domains studied; 28% publish the file; 97% of those files got no requests in May 2026; about 19.5% of the requests that did arrive came from named AI tools. Please re-open the study and confirm these before publishing.
2. The John Mueller remark ("not done for search") is quoted from the Ahrefs article, not from Mueller directly. The post says so.
3. Google's wording about llms.txt is paraphrased from its guide. Re-read the "what you don't need to do" section on the day you publish.
4. The statement that llms.txt was proposed by Jeremy Howard in 2024 comes from the Ahrefs article.

**Claims about us (confirm before publishing):**
- NEW: We do not add an llms.txt file to client sites by default, and we do not charge for one as an SEO service. Please confirm this is how you want to work.
- NEW: This website (kasaulicoder.com) has no llms.txt file. True on 25 Nov 2026; check before publishing.

**Rendering note:** the blog page does not render Markdown tables, so this post uses lists only.

---

## Post content (paste this into the `content` field)

# Do You Need an llms.txt File? What the Evidence Says

If you have read anything about AI and websites this year, you have probably met **llms.txt**. Some agencies now sell it as a must-have. Others call it useless.

We think you should decide from evidence, so here is what the file is, who actually reads it, and what we do on the sites we build.

## What llms.txt is

It is a plain text file that sits at the top of your website, at `yoursite.com/llms.txt`. It is written in Markdown, a simple way of formatting text. It gives a short summary of what your site is about and a list of links to your most important pages.

"LLM" stands for *large language model*, the kind of AI behind tools such as ChatGPT, Gemini and Claude. The idea, proposed in 2024 by the researcher Jeremy Howard, was to give these tools a quick map of a site so they do not have to read every page.

Two things it is **not**:

- It is **not** like `robots.txt`. It does not block anything or give permission for anything.
- It is **not** an official standard. No major AI company has committed to using it.

## Does anything actually read it?

In June 2026, the SEO company Ahrefs published a study of 137,210 websites. It looked at real server records to see what was requesting these files. The main findings:

- **28%** of the sites had an llms.txt file.
- **97%** of those files were not requested even once during May 2026. Not by a bot, not by a person.
- Of the few requests that did arrive, about **one in five** came from named AI tools. Many of the rest came from SEO audit tools and from services built to check for llms.txt files.

Ahrefs is open about the limits. These are sites that use an Ahrefs product, so their owners are more technical than most. The 28% is likely higher than the web as a whole. And "requested" does not mean "used": a bot can fetch a file and do nothing with it.

Still, the picture is hard to miss. Most of these files are written and then never read.

## What Google says

Google's guide for website owners deals with this directly. It says you do not need to create an llms.txt file, or any other special AI file, to appear in Google Search or its AI answers, because Google Search does not use them.

It is equally clear on the other side: having the file will not hurt you. In Google's words, it will "neither harm nor help" your visibility.

The Ahrefs article also reports a comment from John Mueller of Google, who described the file as "not done for search" and more of a short-term aid for AI coding tools reading developer documentation.

## So who is it for?

The same study gives a hint. Among the AI tools that did fetch the file, coding assistants were near the top.

That makes sense. If you publish **technical documentation**, such as instructions for developers who connect to your software, an AI coding tool may use llms.txt to find the right page quickly.

So the honest answer depends on what your website is:

- **A business website, shop, clinic, hotel or portfolio:** you do not need it. Your time is better spent on the pages people read.
- **A software product with developer documentation:** it is reasonable to add one. It is cheap to make and some coding tools do read it.

## What we do

We do not add llms.txt to the sites we build by default, and we do not sell it as an SEO service. Our own website does not have one.

If a client has developer documentation, we will suggest it and explain why. If a client simply wants one, we will add it, and say plainly that it is unlikely to change how they appear in search.

Things can change. If an AI company announces that it reads the file, the advice changes too, and we will update this post.

## What to do with the time you save

If your goal is to be found, in normal search or in AI answers, these matter far more:

1. **Check `robots.txt`.** This is the file that really does control which bots can visit. Make sure it is not blocking the ones you want.
2. **Make sure your pages are indexed.** Google Search Console shows this for free.
3. **Make the site fast and easy to use on a phone.**
4. **Write from your own experience.** Real examples, real prices, real problems solved.
5. **Keep your Google Business Profile correct.**

We cover these in [How to show up in Google's AI answers](/blogs/how-to-show-up-in-google-ai-answers).

## Questions to ask if someone sells you llms.txt

- Which AI tools read this file today, and how do you know?
- How will we measure whether it made a difference?
- What else is in the price?

A fair seller will have calm answers. If the answer is "everyone is doing it", you have your answer too.

## The short version

- llms.txt is a small summary file for AI tools. It is not a standard and it does not control anything.
- In a study of 137,210 sites, 97% of these files were never requested in a whole month.
- Google says the file neither helps nor harms you in Search.
- It can be worth adding if you publish developer documentation.
- For most businesses, the basics of a clear, fast, well-indexed site matter much more.

**Not sure what your site needs?** Have a look at our [SEO and digital growth](/services#seo-digital-growth) work, or [send us your website](/contact) and we will tell you what we would fix first.

## Sources

- Ahrefs: [We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read](https://ahrefs.com/blog/llmstxt-study/) (15 June 2026)
- Google Search Central: [Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

*Written by Gourav Kashiv, KasauliCoder.*
