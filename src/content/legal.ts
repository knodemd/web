// The privacy policy and the terms of knode.md/privacy and knode.md/terms.
//
// Before publishing, the owners review both with legal advice and then set `reviewed` to true,
// which removes the draft notice. Points to settle in that review:
// - Who the controller is: a person or a company, with a postal address (GDPR art. 13).
// - The contact address for privacy requests (oss@knode.md is used until there is another).
// - Governing law and courts for the terms, and whether consumer-law wording is needed.
// - That the Google section still matches what the Gmail connector does, and that the transfer
//   to AI agents the person connects is accepted by Google's review as a user-facing feature.
// - A public support page with a contact address, which the Slack Marketplace requires.
// - The date in `updated`.

export const legalContact = 'oss@knode.md'

export type LegalDoc = {
  kicker: string
  title: string
  updated: string
  reviewed: boolean
  body: string
}

export const privacy: LegalDoc = {
  kicker: 'Privacy',
  title: 'Privacy policy',
  updated: '2026-11-22',
  reviewed: false,
  body: `
## The short version

Knode runs on your device. Your spaces are files on your disk. There is no Knode account, and no
Knode server receives your notes, your mail, your messages or the tokens you sign in with. Knode
has no analytics, no telemetry and no ads. When you connect a service such as Gmail, Slack or
Telegram, what Knode reads goes straight from that service to your device, and stays there.

This policy covers the Knode app, the \`knode\` command, Knode Service (the background process
both start) and this website. Knode is open source: you can check everything written here in
[its code](https://github.com/knodemd/knode).

## What Knode keeps, and where

- **Your spaces.** Notes, links, attachments and everything Knode imports are written to \`.knode\`
  files and folders on your device, in the places you choose. Knode does not copy them anywhere
  else. If you put a space in a folder that another service syncs (iCloud Drive, Dropbox, a Git
  remote), that service's own policy applies to it.
- **Secrets.** Sign-in tokens, the Telegram session and IMAP app passwords are kept in your
  system's keychain (the macOS Keychain, or the Secret Service on Linux). They are never written
  into a space, a settings file or a log.
- **Settings.** Which sources are on, what you excluded and where each source stopped reading are
  kept in Knode's settings on your device.

Knode keeps all of this for as long as you keep it: nothing expires on its own, and nothing is
kept after you delete it, except in copies you made yourself (backups, synced folders).
Knode reads nothing from a connected service that it does not write into your space or need to
keep reading from where it stopped.

## Sources you connect

A source is off until you switch it on for a space. Once on, it brings in what is new, and you can
exclude any chat, channel, label or folder; an excluded one is not read again. When you connect a
source you choose whether it starts from today or brings in the history it has. Pausing or
disconnecting a source stops it; disconnecting also removes its token from the keychain. What it
already wrote stays in your space until you delete it.

- **Gmail, with Sign in with Google.** Knode asks Google for one permission:
  \`https://www.googleapis.com/auth/gmail.readonly\`, to read your mail and its labels. It cannot
  send, change or delete mail. It reads every label except Spam, Trash and the ones you exclude,
  and writes each mail thread into your space as a note. The sign-in uses Google's flow for
  desktop apps: Google sends Knode a token on your device, and Knode keeps it in the keychain.
- **Mail by IMAP.** With an app password you create at your mail provider, Knode reads the
  folders you allow from the IMAP server. The app password is kept in the keychain.
- **Slack.** Knode is installed in your workspace as an app with a user token and read-only
  permissions: the history and list of the channels, private channels, direct messages and group
  messages you are in (\`channels:history\`, \`groups:history\`, \`im:history\`, \`mpim:history\`,
  \`channels:read\`, \`groups:read\`, \`im:read\`, \`mpim:read\`), and the names of the members of the
  workspace (\`users:read\`). It cannot post, edit or delete anything.
- **Telegram.** Knode signs in to your account with the official Telegram API, using your phone
  number, the code Telegram sends you and, if you set one, your password. It reads the chats you do
  not exclude. Secret chats are not available through the API and are not read. You can end
  Knode's session at any time in Telegram, under Settings > Devices.
- **Sources on your Mac.** Apple Mail, Messages and WhatsApp for Mac are read from their files on
  your Mac, with the Full Disk Access you grant, without any account or network access. Knode reads
  a copy of each database and never writes to it.
- **Imports and agent conversations.** Files and exports you import, and the conversations of the
  AI coding agents you tell Knode to capture, are read from your device.

## Google user data

Knode's use and transfer to any other app of information received from Google APIs will adhere
to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy),
including the Limited Use requirements. In particular:

- Knode uses your Gmail data only to bring your mail into your Knode space on your device, the
  feature you switched on, and to show it to you and to the tools you choose.
- Knode does not transfer it to anyone, except when you yourself pass it on: for example, when an
  AI agent you connected to Knode reads your memory (see below), or when you share or sync a space.
- Knode does not use it for advertising, does not sell it, and does not use it to build or train
  AI or machine-learning models, Knode's or anyone else's.
- Nobody at Knode reads your mail. Knode's maintainers have no access to it: it never reaches
  them.

## AI agents you connect

Knode can give the AI agents you set up (for example through its MCP server) access to your
memory, so they can search and read your notes. What an agent reads is sent by that agent to its
provider and handled under that provider's terms and privacy policy, not Knode's. You choose which
agents to connect and which spaces they can reach, and you can disconnect them at any time.

## When Knode uses the network

Knode itself only connects to:

- the services you connect (Google, your IMAP server, Slack, Telegram, Readwise), to sign in and
  read what you asked for;
- Hugging Face, to download the open model Knode uses for search, once, when it is first needed;
- GitHub and Homebrew, when you install or update Knode with them.

None of these requests carries your notes to Knode. Each service sees the request it receives
(for example your IP address) under its own policy.

## This website

knode.md is a static site hosted by GitHub Pages. It sets no cookies, uses no analytics or
trackers and loads nothing from other sites. GitHub, as the host, processes the technical data of
each visit (such as your IP address) to serve the site; see
[GitHub's privacy statement](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement).

If you write to us or open an issue, we use your message and address only to answer you.

## Your choices and rights

Because your data is on your device, you control it directly: you can read, export, change or
delete any space, and disconnect any source. To revoke Knode's access at the service as well:

- Google: [myaccount.google.com/connections](https://myaccount.google.com/connections)
- Slack: your workspace's app management page, or remove the app from your account
- Telegram: Settings > Devices > end the Knode session

Knode does not hold your personal data, so there is nothing for us to export or delete on your
behalf. If you think otherwise, or have a question about this policy, write to
[${legalContact}](mailto:${legalContact}). You may also complain to your data-protection
authority.

## Children

Knode is not directed at children under 13.

## Changes

We will update this page when what Knode does with data changes, and change the date above. The
history of this page is public in [the site's repository](https://github.com/knodemd/web).
`,
}

export const terms: LegalDoc = {
  kicker: 'Terms',
  title: 'Terms of use',
  updated: '2026-11-22',
  reviewed: false,
  body: `
## What these terms cover

Knode is open source. The Knode app, the \`knode\` command and their code are licensed under the
[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0); that licence, not these terms,
says what you may do with the code. The Knode name, logo and typefaces are covered by the
[Knode Brand License](https://github.com/knodemd/brand-license).

These terms cover your use of this website and of the builds of Knode we publish, including the
services they sign in to on your behalf with Knode's registered apps: Sign in with Google for
Gmail, the Knode app in Slack and Knode's Telegram application. How Knode handles data is in the
[privacy policy](/privacy).

## Using Knode

- Knode runs on your device and is free to use. There is no Knode account to create.
- Connect only accounts, workspaces and chats you are allowed to read, and respect the terms of
  each service you connect (Google, Slack, Telegram, your mail provider) and the policies of your
  organisation. A Slack workspace may require an admin to approve Knode before you can install it.
- Other people's messages that Knode brings into your space are your responsibility: keep them as
  you would keep the messages in the service itself.
- Knode's Google client, Slack app and Telegram \`api_id\` are for Knode's own builds. Do not reuse
  them in other software; if you build Knode yourself, you may use your own (see the
  [docs](/docs)).
- Do not use Knode to break the law, to get around a service's limits or security, or to read
  data you are not entitled to.

## Third-party services

Gmail, Slack, Telegram and the other services Knode connects to are run by their own companies
under their own terms. They can change or end what they offer, or what they allow Knode to do,
and a connector can stop working as a result. Knode is not affiliated with or endorsed by Google,
Slack or Telegram.

## No warranty

Knode is provided "as is", without warranties or conditions of any kind, as the Apache License
2.0 says in its section 7. Keep backups of what matters to you. To the extent the law allows, the
Knode maintainers are not liable for damages arising from the use of Knode or this website, as
section 8 of the licence says.

## Changes and contact

We may update these terms; the date above says when they last changed, and their history is
public in [the site's repository](https://github.com/knodemd/web). Questions:
[${legalContact}](mailto:${legalContact}).
`,
}
