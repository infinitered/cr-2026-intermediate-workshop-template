# Intermediate Workshop - Chain React 2026

Template for the Chain React 2026 Intermediate Workshop. This is your starting point for the workshop!

## How to get ready for the workshop.

1. Fork and clone this repo. You'll start working right on `main`.
2. Run `pnpm install` to restore your dependencies.
3. Run `npx expo run:ios` to test on an iOS simulator.
4. Run `npx expo run:android` to test on an Android emulator.
5. If both of those work, then you're in great shape for the workshop.

If something doesn't work, check the prerequisites below.

Generally, following the [Expo Local App Development requirements](https://docs.expo.dev/guides/local-app-development/) guide should be sufficient to get your Mac prepped for the workshop.

### Just before the worshop...

Just before the workshop, we recommend syncing your fork to pull the latest upstream, just in case we make any changes or fixes later on. Then run the following to make sure everything is up-to-date:

1. Run `pnpm install`
2. Run `npx expo prebuild --clean` to sync any native project changes
3. Run `npx expo run:ios`
4. Run `npx expo run:android`

## Prerequisites

- A local development environment ready for native iOS and Android React Native / Expo development, capable of running the `npx expo run:ios` and `npx expo run:android`, including recent versions of:
  - Xcode (version 26.4+)
  - Watchman
  - Cocoapods
  - JDK 17
  - Android Studio
  - iOS simulator
  - Android emulator
  - If you're not sure if you have all of these or if you have the right versions, check the [Expo Local App Development requirements](https://docs.expo.dev/guides/local-app-development/) for details on how to install these tools in order to enable local native development with the Expo CLI.
- Other general development tools:
  - [Node LTS version (22+)](https://pnpm.io/installation)
  - Visual Studio Code
  - Git (Github Desktop works great)
- Hardware:
  - A Mac is highly recommended for the full experience. You will not be able to do some of the exercises without access to an iOS device or simulator.
  - Simulators/emulators will work just fine for all the exercises, but bringing an Android or iOS device to test on is great, too!
- [pnpm](https://pnpm.io/installation)

**Want to run on a device?** If you want to do some or all of the workshop on a device, you can also test with `npx expo run:ios --device` and/or `npx expo run:android --device`.

## Doing the workshop exercises

You'll start working on `main` on your fork of the starter template.

The lessons live in a [companion repo](https://github.com/infinitered/cr-2026-intermediate-workshop-lessons).

> This link might not be available yet, but will be accessible just before the workshop.

You'll start on module `01`, then proceed to `02`, etc. Each module file has objectives, helpful resources, steps to follow, code to write. Of course, the teachers will be there to provide background and guide you through it.
