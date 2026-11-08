// One version line for this package — `npx @iyulab/tauri-kit-dev versions --config versions.config.js [--bump <x.y.z>]`
// checks that the files agree, or moves them all at once (the changelog's Unreleased section released under it).
export default {
  files: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
}
