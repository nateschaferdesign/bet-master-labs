export type SportId =
  | "nfl"
  | "nba"
  | "mlb"
  | "nhl"
  | "ncaaf"
  | "ncaab"
  | "wnba"
  | "mls"
  | "epl"
  | "laliga"
  | "bundesliga"
  | "seriea"
  | "ucl"
  | "ufc"
  | "boxing"
  | "tennis"
  | "golf"
  | "f1";

export type SportGroup = "US majors" | "College" | "Soccer" | "Combat" | "Individual";

export type Sport = {
  id: SportId;
  name: string;
  short: string;
  group: SportGroup;
  region: string;
  blurb: string;
};

export const SPORTS: Sport[] = [
  { id: "nfl", name: "NFL", short: "NFL", group: "US majors", region: "United States", blurb: "Spreads, totals, and sides across the regular season and playoffs." },
  { id: "nba", name: "NBA", short: "NBA", group: "US majors", region: "United States", blurb: "Nightly sides, totals, and player props with high sample velocity." },
  { id: "mlb", name: "MLB", short: "MLB", group: "US majors", region: "United States", blurb: "Run lines, totals, and first-five markets across a long season." },
  { id: "nhl", name: "NHL", short: "NHL", group: "US majors", region: "North America", blurb: "Puck lines, totals, and regulation results." },
  { id: "ncaaf", name: "College football", short: "NCAAF", group: "College", region: "United States", blurb: "Saturday slates, conference spreads, and playoff windows." },
  { id: "ncaab", name: "College basketball", short: "NCAAB", group: "College", region: "United States", blurb: "Conference play and March volume with wide line movement." },
  { id: "wnba", name: "WNBA", short: "WNBA", group: "US majors", region: "United States", blurb: "Compact season, tighter books, measurable close-line value." },
  { id: "mls", name: "MLS", short: "MLS", group: "Soccer", region: "United States", blurb: "Moneyline and totals across a travel-heavy domestic calendar." },
  { id: "epl", name: "Premier League", short: "EPL", group: "Soccer", region: "England", blurb: "Weekend slates plus midweek cups with deep market liquidity." },
  { id: "laliga", name: "La Liga", short: "La Liga", group: "Soccer", region: "Spain", blurb: "1X2 and totals with late European-window closes." },
  { id: "bundesliga", name: "Bundesliga", short: "Bundesliga", group: "Soccer", region: "Germany", blurb: "High-event totals and home-field sides." },
  { id: "seriea", name: "Serie A", short: "Serie A", group: "Soccer", region: "Italy", blurb: "Defensive slates where totals and draws carry signal." },
  { id: "ucl", name: "UEFA Champions League", short: "UCL", group: "Soccer", region: "Europe", blurb: "Midweek knockout and league-phase prices." },
  { id: "ufc", name: "UFC", short: "UFC", group: "Combat", region: "Global", blurb: "Fight-night moneylines, methods, and rounds." },
  { id: "boxing", name: "Boxing", short: "Boxing", group: "Combat", region: "Global", blurb: "Card headliners and method markets with thin public books." },
  { id: "tennis", name: "Tennis", short: "Tennis", group: "Individual", region: "Tour", blurb: "Match winners and set spreads across ATP and WTA." },
  { id: "golf", name: "Golf", short: "Golf", group: "Individual", region: "PGA / DP", blurb: "Outrights, top-10s, and matchups on tour weeks." },
  { id: "f1", name: "Formula 1", short: "F1", group: "Individual", region: "World", blurb: "Race winners, podiums, and constructor markets." },
];

export const SPORT_BY_ID = Object.fromEntries(SPORTS.map((s) => [s.id, s])) as Record<SportId, Sport>;

export type Verification = "verified" | "building";

export type Analyst = {
  id: string;
  name: string;
  handle: string;
  city: string;
  sports: SportId[];
  verification: Verification;
  trust: number;
  bets: number;
  wins: number;
  losses: number;
  pushes: number;
  units: number;
  roi: number;
  clv: number;
  bio: string;
};

const NAMES = [
  ["Jordan Hale", "jhale", "Miami"],
  ["Priya Raman", "praman", "Tampa"],
  ["Marcus Cole", "mcole", "Orlando"],
  ["Elena Voss", "evoss", "Jacksonville"],
  ["Nate Okoye", "nokoye", "Atlanta"],
  ["Sofia Alvarez", "salvar", "Miami"],
  ["Owen Briggs", "obriggs", "Charlotte"],
  ["Maya Chen", "mchen", "New York"],
  ["Luis Ortega", "lortega", "Houston"],
  ["Ava Lindholm", "alind", "Minneapolis"],
  ["Theo Park", "tpark", "Los Angeles"],
  ["Riley Quinn", "rquinn", "Chicago"],
  ["Camila Duarte", "cduarte", "São Paulo"],
  ["Jonah West", "jwest", "Dallas"],
  ["Hana Ito", "hito", "Tokyo"],
  ["Declan Moore", "dmoore", "London"],
  ["Amira Hassan", "ahassan", "Chicago"],
  ["Felix Moreau", "fmoreau", "Paris"],
  ["Ivy Navarro", "inav", "Phoenix"],
  ["Seth Walker", "swalker", "Denver"],
  ["Noor Rahman", "nrahman", "Toronto"],
  ["Grace Pell", "gpell", "Boston"],
  ["Andre Silva", "asilva", "Lisbon"],
  ["Keisha Ward", "kward", "Detroit"],
];

const SPORT_FOCUS: SportId[][] = [
  ["nfl", "ncaaf"],
  ["nba", "wnba"],
  ["mlb"],
  ["nhl"],
  ["epl", "ucl"],
  ["laliga", "seriea"],
  ["bundesliga", "epl"],
  ["ufc", "boxing"],
  ["tennis"],
  ["golf"],
  ["f1"],
  ["mls", "epl"],
  ["ncaab", "nba"],
  ["nfl", "nba"],
  ["ucl", "epl", "mls"],
  ["boxing", "ufc"],
  ["ncaaf", "nfl"],
  ["wnba", "nba"],
  ["mlb", "nba"],
  ["nhl", "mlb"],
  ["tennis", "golf"],
  ["f1", "golf"],
  ["seriea", "ucl"],
  ["ncaab", "ncaaf"],
];

function seeded(n: number) {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export const ANALYSTS: Analyst[] = NAMES.map(([name, handle, city], i) => {
  const sports = SPORT_FOCUS[i];
  const bets = 80 + Math.floor(seeded(i + 2) * 420);
  const winRate = 0.49 + seeded(i + 9) * 0.12;
  const wins = Math.round(bets * winRate);
  const pushes = Math.max(1, Math.round(bets * 0.03));
  const losses = Math.max(1, bets - wins - pushes);
  const units = Number((((wins - losses) * (0.7 + seeded(i) * 0.9)) / 10).toFixed(1));
  const roi = Number(((units / (bets * 1.05)) * 100).toFixed(1));
  const clv = Number((-0.4 + seeded(i + 4) * 2.6).toFixed(2));
  const trust = Math.min(98, Math.max(42, Math.round(58 + roi * 1.6 + clv * 6 + (bets > 150 ? 8 : -6))));
  return {
    id: handle,
    name,
    handle: `@${handle}`,
    city,
    sports,
    verification: bets >= 150 && trust >= 62 ? "verified" : "building",
    trust,
    bets,
    wins,
    losses,
    pushes,
    units,
    roi,
    clv,
    bio: `${name.split(" ")[0]} publishes a public book on ${sports.map((s) => SPORT_BY_ID[s].short).join(" / ")} with timestamps and close-line capture.`,
  };
});

export type PickResult = "win" | "loss" | "push" | "pending";

export type PublicPick = {
  id: string;
  analystId: string;
  sport: SportId;
  event: string;
  market: string;
  line: string;
  odds: string;
  result: PickResult;
  units: number;
  postedAt: string;
};

const EVENTS: Record<SportId, string[]> = {
  nfl: ["Dolphins @ Bills", "Chiefs @ Ravens", "Eagles @ Cowboys", "Lions @ Packers"],
  nba: ["Heat @ Celtics", "Nuggets @ Timberwolves", "Lakers @ Warriors", "Knicks @ 76ers"],
  mlb: ["Yankees @ Red Sox", "Dodgers @ Padres", "Braves @ Mets", "Astros @ Rangers"],
  nhl: ["Panthers @ Lightning", "Oilers @ Avalanche", "Rangers @ Devils", "Stars @ Jets"],
  ncaaf: ["Florida @ Georgia", "Alabama @ LSU", "Ohio State @ Michigan", "Miami @ FSU"],
  ncaab: ["Duke @ UNC", "UConn @ Purdue", "Kansas @ Houston", "Florida @ Kentucky"],
  wnba: ["Liberty @ Aces", "Sun @ Lynx", "Sky @ Storm", "Wings @ Fever"],
  mls: ["Inter Miami @ Atlanta", "LAFC @ Sounders", "Crew @ Cincinnati", "NYCFC @ Red Bulls"],
  epl: ["Arsenal v City", "Liverpool v Chelsea", "Spurs v United", "Newcastle v Villa"],
  laliga: ["Real Madrid v Barça", "Atlético v Sevilla", "Sociedad v Bilbao", "Villarreal v Betis"],
  bundesliga: ["Bayern v Dortmund", "Leipzig v Leverkusen", "Frankfurt v Stuttgart", "Gladbach v Union"],
  seriea: ["Inter v Milan", "Juventus v Napoli", "Roma v Lazio", "Atalanta v Fiorentina"],
  ucl: ["City v Real Madrid", "Bayern v Arsenal", "Barça v PSG", "Inter v Leipzig"],
  ufc: ["Jones vs Aspinall", "Islam vs Oliveira", "Shevchenko vs Grasso", "Pereira vs Ankalaev"],
  boxing: ["Crawford vs Spence", "Canelo vs Charlo", "Usyk vs Fury", "Inoue vs Tapales"],
  tennis: ["Alcaraz vs Sinner", "Swiatek vs Gauff", "Djokovic vs Medvedev", "Sabalenka vs Rybakina"],
  golf: ["Masters R3 pairing", "U.S. Open matchup", "Open Championship outright", "Players top 10"],
  f1: ["Monaco GP winner", "Silverstone podium", "Monza constructor", "Spa fastest lap"],
};

const MARKETS = ["Spread", "Total", "Moneyline", "Player prop", "First half", "Team total"];

function pickResult(i: number): PickResult {
  const r = seeded(i + 17);
  if (r < 0.08) return "pending";
  if (r < 0.12) return "push";
  if (r < 0.6) return "win";
  return "loss";
}

export const PICKS: PublicPick[] = ANALYSTS.flatMap((a, ai) =>
  a.sports.flatMap((sport, si) =>
    EVENTS[sport].slice(0, 3).map((event, ei) => {
      const n = ai * 40 + si * 7 + ei;
      const result = pickResult(n);
      const units = Number((0.5 + seeded(n + 3) * 1.5).toFixed(1));
      return {
        id: `${a.id}-${sport}-${ei}`,
        analystId: a.id,
        sport,
        event,
        market: MARKETS[n % MARKETS.length],
        line: n % 2 === 0 ? "-3.5" : "o 221.5",
        odds: n % 3 === 0 ? "-110" : "+105",
        result,
        units: result === "loss" ? -units : result === "win" ? units : 0,
        postedAt: `2026-08-${String(10 + ((n * 3) % 18)).padStart(2, "0")}`,
      };
    }),
  ),
);

export function getAnalyst(id: string) {
  return ANALYSTS.find((a) => a.id === id);
}

export function picksForAnalyst(id: string) {
  return PICKS.filter((p) => p.analystId === id).sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}

export function analystsForSport(id: SportId) {
  return ANALYSTS.filter((a) => a.sports.includes(id)).sort((a, b) => b.trust - a.trust);
}

export function rankedAnalysts(minBets = 150) {
  return ANALYSTS.filter((a) => a.bets >= minBets).sort((a, b) => b.trust - a.trust);
}

export function winPct(a: Analyst) {
  const decided = a.wins + a.losses;
  return decided ? Math.round((a.wins / decided) * 1000) / 10 : 0;
}

export const GROUPS: SportGroup[] = ["US majors", "College", "Soccer", "Combat", "Individual"];
