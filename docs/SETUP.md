# Setup and Testing

This project does not install Node.js by itself. If `npm` is not available in the terminal, PowerShell may show an error like this:

```text
npm: The term 'npm' is not recognized as a name of a cmdlet, function, script file, or executable program.
```

## Requirements

- Node.js with `npm` available in the terminal.
- Commands should be run from the repository root.

## No-Install Diagnostics

This command only checks the environment and project files:

```powershell
.\scripts\check-environment.ps1
```

## Run Web

After `npm -v` works:

```powershell
npm install
npm run web
```

## Run iOS

On Windows, iOS development normally requires one of these routes:

- Expo Go on an iPhone using the Expo QR code.
- A Mac for the iOS simulator.
- EAS Build for generating an iOS build.

With Node.js and `npm` available:

```powershell
npm run ios
```

## Real Translation

By default, the app uses demo translations for the initial catalog. To use LibreTranslate:

```powershell
Copy-Item .env.example .env
```

Edit `.env` if you need to change the URL or configure an API key.

## Real Audio

The app accepts a direct audio URL in the "Real audio URL" field. Use legally hosted files with CORS enabled for web playback.

Expected example formats:

- `.mp3`
- `.m4a`
- `.wav`

## What Not To Commit

- Do not commit `.env`.
- Do not commit `node_modules`.
- Do not use lyrics or audio without permission in a public app.
