# Plán: Obrazovky pre menu položky

## Kontext
App má dashboard (PREHĽAD FARMY) a bottom nav s menu drawerom obsahujúcim 5 položiek: Zákazníci, Objednávky, Nákupy, Zabijačka, Štatistiky. Kliknutie na položku zatvorí drawer ale nič neotvorí. Cieľom je každej položke priradiť plnohodnotnú obrazovku.

## Prístup
Jednoduchý in-app router cez `useState` — žiadna externá knižnica. Stav `activePage` (`null` = dashboard, alebo string s názvom stránky) riadi čo sa renderuje. Animácia slide-in sprava (CSS transform + transition).

## Štruktúra

### 1. Router state
```tsx
const [activePage, setActivePage] = useState<string | null>(null);
```

Menu položky pri kliknutí: `setMenuOpen(false); setActivePage("zakaznici")` atď.

### 2. PageShell komponent (znovupoužiteľný wrapper)
- Back šípka + nadpis + obsah
- Rovnaký status bar a safe-area padding ako dashboard
- Pevný bottom nav ostáva viditeľný na všetkých stránkach

### 3. Obsah každej stránky (mockup dáta)

| Stránka | Kľúčový obsah |
|---|---|
| **Zákazníci** | Zoznam zákazníkov s menom, telefónom, počtom ks, stavom objednávky. Search bar navrchu. |
| **Objednávky** | Zoznam objednávok s menom zákazníka, množstvom, dátumom, stavom (čakajúca / potvrdená / doručená). Farebné badge stavy. |
| **Nákupy** | Zoznam výdavkov — krmivo, lieky, materiál. Celková suma, filter podľa kategórie (tab chips). |
| **Zabijačka** | Zoznam plánovaných porážok s dátumom, turnusom, počtom ks. Countdown do najbližšej. |
| **Štatistiky** | Jednoduché bar/line grafy (CSS, nie Recharts) — úhyn po týždňoch, tržby po mesiacoch, využitie kapacity. |

### 4. Navigácia
- Back tlačidlo (`←`) v headeri stránky → `setActivePage(null)`
- Bottom nav ostáva funkčný (ÚHYN, MENU, VÝDAVOK) na všetkých stránkach
- Aktívna stránka zobrazí meno v menu draweri zvýraznené

## Súbory na úpravu
- `src/App.tsx` — jediný súbor, pridať: router state, PageShell, 5 page komponentov, update menu onClick handlerov

## Overenie
Kliknúť na MENU → kliknúť na každú položku → stránka sa otvorí, back šípka sa vráti na dashboard, bottom nav funguje na všetkých stránkach.
