# Studio Typo – iOS-app

De iOS-app is dezelfde app als de website, verpakt met **Capacitor** en aangevuld met echte iPhone-functies:

- **Bewaren in Foto's** (transparante PNG rechtstreeks in de fotorol)
- **Delen** via het deelmenu (Instagram, Berichten, AirDrop…)
- **Trillingen (haptics)** bij bewaren en kopen
- **Studio Typo Pro** via in-app aankopen (RevenueCat + StoreKit)
- **Volledig offline**: alle lettertypes, foto's en ontwerpen zitten in de app

Alles wat in de app verandert, pas je aan in `public/index.html`. Daarna `npm run ios:sync` en opnieuw bouwen in Xcode.

---

## Vanavond: stap voor stap

### 1. Eenmalig klaarzetten (±20 min)
1. Installeer **Xcode** uit de Mac App Store en open het één keer (accepteer de licentie, laat de extra onderdelen installeren).
2. Installeer **Node.js** (LTS) van nodejs.org, als je dat nog niet hebt. Controleer in Terminal: `node -v`
3. Haal de code binnen:
   ```bash
   git clone https://github.com/Qbraem/TypoStudio.git
   cd TypoStudio
   ```

### 2. Het Xcode-project maken (1 commando)
```bash
npm run ios:setup
```
Dit installeert Capacitor en de plugins, maakt de map `ios/` aan, zet het app-icoon, de splashscreen, de toestemming voor Foto's en de schermstanden (iPhone + iPad) juist.

### 3. Op je eigen iPhone zetten (gratis, zonder developer-account)
1. `npm run ios:open` – Xcode opent.
2. Klik links op **App** (blauw icoon) → tab **Signing & Capabilities**.
3. Bij **Team**: kies *Add an Account…* en log in met je gewone Apple ID. Kies daarna je naam ("Personal Team").
4. Verbind je iPhone met een kabel (of via hetzelfde wifi-netwerk), kies hem bovenaan als bestemming en klik op ▶︎.
5. Eerste keer op de iPhone: *Instellingen → Algemeen → VPN en apparaatbeheer* → je Apple ID vertrouwen. Zet ook *Instellingen → Privacy en beveiliging → Ontwikkelaarsmodus* aan als iOS dat vraagt.

> Met een gratis account werkt de app 7 dagen; daarna gewoon opnieuw op ▶︎ klikken.
> Aankopen (Pro) werken pas na stap 5. Tot dan zie je in de app de gratis versie.

### 4. Na een wijziging in de app
```bash
git pull
npm run ios:sync
```
en in Xcode opnieuw op ▶︎.

---

## Later: publiceren in de App Store

### 5. Account en aankopen (eenmalig)
1. **Apple Developer Program** (€99/jaar): developer.apple.com/programs
2. **App Store Connect** → *Agreements, Tax, and Banking*: overeenkomst voor betaalde apps tekenen, bank- en belastinggegevens invullen. Vraag ook het **Small Business Program** aan (15% commissie i.p.v. 30%).
3. **App Store Connect → Apps → +**: nieuwe app, bundle-ID `be.qbraem.studiotypo`, naam *Studio Typo*.
4. **In-app aankopen** aanmaken:
   | Type | Product-ID | Prijs |
   |---|---|---|
   | Auto-renewable subscription (groep "Studio Typo Pro") | `studiotypo_pro_yearly` | €12,99 / jaar, met introductieaanbod 1 week gratis |
   | Non-consumable | `studiotypo_pro_lifetime` | €24,99 (lanceringsprijs, later €41,99) |
5. **RevenueCat** (gratis tot $2.500 omzet/maand): app.revenuecat.com
   - Nieuw project → iOS-app koppelen (bundle-ID + In-App Purchase key uit App Store Connect).
   - **Entitlement** `pro` aanmaken en beide producten eraan koppelen.
   - **Offering** "default" met twee packages: *Annual* en *Lifetime*.
   - Kopieer de **public Apple API key** (`appl_…`) en zet die in `public/index.html` bij `RC_API_KEY`.
6. In Xcode bij *Signing & Capabilities*: je betaalde team kiezen en **+ Capability → In-App Purchase** toevoegen.
7. Testen met een **Sandbox-account** (App Store Connect → Users and Access → Sandbox).

### 6. Indienen
- Xcode: *Product → Archive* → *Distribute App* → App Store Connect.
- Screenshots staan klaar in `appstore/screenshots/`, teksten in `appstore/metadata.md`.
- Privacybeleid: https://studio-typo.onrender.com/privacy.html — Gebruiksvoorwaarden: https://studio-typo.onrender.com/terms.html

---

## Technisch overzicht
| Bestand | Wat |
|---|---|
| `public/` | De volledige app (ook de website op Render) |
| `public/fonts/` | Alle lettertypes, lokaal (SIL OFL / Apache) |
| `capacitor.config.json` | App-ID, naam, splashscreen, statusbalk |
| `scripts/ios-setup.sh` | Maakt en configureert het Xcode-project |
| `resources/ios/` | App-icoon (1024×1024) en splashscreen |
| `server.js` | Website + Trending-API (Upstash) op Render |
