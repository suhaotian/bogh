<img src="./web/app/[lang]/icons//logo.jpeg" alt="logo" width="96" style="margin: 0 auto 30px;display:block; border-radius: 12px"/>

# Bulk operations for GitHub

Bulk operations for GitHub, features:

- [x] Bulk archive repos
- [x] Bulk delete repos
- [x] Bulk cancel stars
- [x] Bulk cancel watchs
- [ ] Bulk delete branches

## How to use

Open website https://bulk-operations-gh.tsdk.dev

Or

> Don't forget install the `git-lfs`

**Clone the repo, `pnpm install` dependencies, run `pnpm start` and open the url**

## Questions

<details open>
  <summary>1. How to get Access Token of GitHub?</summary>

Create a personal `Access Token` at https://github.com/settings/tokens/new?scopes=repo,delete_repo,user,notifications

</details>

<details>
  <summary>2. Is that safe to use the website?</summary>

Yes, the Access Token only stored in your browser, except you and GitHub, nobody knows your token.

BTW, you can just clone the source code, run in the local.

</details>

## Screenshots

![screenshot](./screenshot.jpg)

## Thanks

- ChakraUI for UI components https://chakra-ui.com/
- Octokit for the GitHub API https://github.com/octokit/octokit.js
- Next.js for the React framework https://github.com/vercel/next.js
- Use-one for state management https://github.com/suhaotian/use-one
