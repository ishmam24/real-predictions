// ============================================================================
// `teams` and `players` below are refreshed from the live FPL API by
// scripts/generate-pl-data.mjs (real current-season clubs with crests, and
// full squads) — safe to rerun any time, e.g. after a transfer window; it
// only splices those two blocks and never touches anything else in this file.
//
// `gameweeks` and `fixtures` are hand-maintained instead, one gameweek at a
// time: pick the top 5 with getNextGameweek() + selectTopFixtures (src/lib/fpl.ts
// / prominence.ts — the same algorithm the admin "auto-pick" screen uses), add
// the block below, then publish it to the live DB with scripts/publish-gameweek.mjs.
//
// This stands in for the database in the prototype; Supabase replaces it later.
// ============================================================================
import type { Team, Player, Fixture, Gameweek } from "./types";

export const teams: Team[] = [
  {
    "id": "ars",
    "name": "Arsenal",
    "tla": "ARS",
    "color": "#EF0107",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t3.png"
  },
  {
    "id": "avl",
    "name": "Aston Villa",
    "tla": "AVL",
    "color": "#95BFE5",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t7.png"
  },
  {
    "id": "bou",
    "name": "Bournemouth",
    "tla": "BOU",
    "color": "#DA291C",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t91.png"
  },
  {
    "id": "bre",
    "name": "Brentford",
    "tla": "BRE",
    "color": "#E30613",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t94.png"
  },
  {
    "id": "bha",
    "name": "Brighton",
    "tla": "BHA",
    "color": "#0057B8",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t36.png"
  },
  {
    "id": "che",
    "name": "Chelsea",
    "tla": "CHE",
    "color": "#034694",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t8.png"
  },
  {
    "id": "cov",
    "name": "Coventry City",
    "tla": "COV",
    "color": "#59B7E4",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t9.png"
  },
  {
    "id": "cry",
    "name": "Crystal Palace",
    "tla": "CRY",
    "color": "#1B458F",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t31.png"
  },
  {
    "id": "eve",
    "name": "Everton",
    "tla": "EVE",
    "color": "#003399",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t11.png"
  },
  {
    "id": "ful",
    "name": "Fulham",
    "tla": "FUL",
    "color": "#1a1a1a",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t54.png"
  },
  {
    "id": "hul",
    "name": "Hull City",
    "tla": "HUL",
    "color": "#F5A12D",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t88.png"
  },
  {
    "id": "ips",
    "name": "Ipswich Town",
    "tla": "IPS",
    "color": "#3A64A3",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t40.png"
  },
  {
    "id": "lee",
    "name": "Leeds",
    "tla": "LEE",
    "color": "#1D428A",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t2.png"
  },
  {
    "id": "liv",
    "name": "Liverpool",
    "tla": "LIV",
    "color": "#C8102E",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t14.png"
  },
  {
    "id": "mci",
    "name": "Man City",
    "tla": "MCI",
    "color": "#6CABDD",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t43.png"
  },
  {
    "id": "mun",
    "name": "Man Utd",
    "tla": "MUN",
    "color": "#DA291C",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t1.png"
  },
  {
    "id": "new",
    "name": "Newcastle",
    "tla": "NEW",
    "color": "#241F20",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t4.png"
  },
  {
    "id": "nfo",
    "name": "Nott'm Forest",
    "tla": "NFO",
    "color": "#DD0000",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t17.png"
  },
  {
    "id": "tot",
    "name": "Spurs",
    "tla": "TOT",
    "color": "#132257",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t6.png"
  },
  {
    "id": "sun",
    "name": "Sunderland",
    "tla": "SUN",
    "color": "#EB172B",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/70/t56.png"
  }
];

export const players: Player[] = [
  {
    "id": "p2",
    "teamId": "ars",
    "name": "Arrizabalaga",
    "position": "GK"
  },
  {
    "id": "p452",
    "teamId": "ars",
    "name": "Bruno G.",
    "position": "MID"
  },
  {
    "id": "p8",
    "teamId": "ars",
    "name": "Calafiori",
    "position": "DEF"
  },
  {
    "id": "p20",
    "teamId": "ars",
    "name": "Dowman",
    "position": "MID"
  },
  {
    "id": "p14",
    "teamId": "ars",
    "name": "Eze",
    "position": "MID"
  },
  {
    "id": "p23",
    "teamId": "ars",
    "name": "Fábio Vieira",
    "position": "MID"
  },
  {
    "id": "p27",
    "teamId": "ars",
    "name": "G.Jesus",
    "position": "FWD"
  },
  {
    "id": "p4",
    "teamId": "ars",
    "name": "Gabriel",
    "position": "DEF"
  },
  {
    "id": "p25",
    "teamId": "ars",
    "name": "Gyökeres",
    "position": "FWD"
  },
  {
    "id": "p26",
    "teamId": "ars",
    "name": "Havertz",
    "position": "FWD"
  },
  {
    "id": "p9",
    "teamId": "ars",
    "name": "Hincapie",
    "position": "DEF"
  },
  {
    "id": "p5",
    "teamId": "ars",
    "name": "J.Timber",
    "position": "DEF"
  },
  {
    "id": "p7",
    "teamId": "ars",
    "name": "Lewis-Skelly",
    "position": "MID"
  },
  {
    "id": "p16",
    "teamId": "ars",
    "name": "Madueke",
    "position": "MID"
  },
  {
    "id": "p18",
    "teamId": "ars",
    "name": "Martinelli",
    "position": "MID"
  },
  {
    "id": "p17",
    "teamId": "ars",
    "name": "Merino",
    "position": "MID"
  },
  {
    "id": "p3",
    "teamId": "ars",
    "name": "Meslier",
    "position": "GK"
  },
  {
    "id": "p11",
    "teamId": "ars",
    "name": "Mosquera",
    "position": "DEF"
  },
  {
    "id": "p24",
    "teamId": "ars",
    "name": "Nelson",
    "position": "MID"
  },
  {
    "id": "p22",
    "teamId": "ars",
    "name": "Nwaneri",
    "position": "MID"
  },
  {
    "id": "p15",
    "teamId": "ars",
    "name": "Ødegaard",
    "position": "MID"
  },
  {
    "id": "p1",
    "teamId": "ars",
    "name": "Raya",
    "position": "GK"
  },
  {
    "id": "p13",
    "teamId": "ars",
    "name": "Rice",
    "position": "MID"
  },
  {
    "id": "p12",
    "teamId": "ars",
    "name": "Saka",
    "position": "MID"
  },
  {
    "id": "p6",
    "teamId": "ars",
    "name": "Saliba",
    "position": "DEF"
  },
  {
    "id": "p557",
    "teamId": "ars",
    "name": "Tzolis",
    "position": "MID"
  },
  {
    "id": "p10",
    "teamId": "ars",
    "name": "White",
    "position": "DEF"
  },
  {
    "id": "p19",
    "teamId": "ars",
    "name": "Zubimendi",
    "position": "MID"
  },
  {
    "id": "p38",
    "teamId": "avl",
    "name": "A.García",
    "position": "DEF"
  },
  {
    "id": "p56",
    "teamId": "avl",
    "name": "Abraham",
    "position": "FWD"
  },
  {
    "id": "p52",
    "teamId": "avl",
    "name": "Alysson",
    "position": "MID"
  },
  {
    "id": "p44",
    "teamId": "avl",
    "name": "Bailey",
    "position": "MID"
  },
  {
    "id": "p46",
    "teamId": "avl",
    "name": "Barkley",
    "position": "MID"
  },
  {
    "id": "p35",
    "teamId": "avl",
    "name": "Bogarde",
    "position": "MID"
  },
  {
    "id": "p41",
    "teamId": "avl",
    "name": "Buendía",
    "position": "MID"
  },
  {
    "id": "p50",
    "teamId": "avl",
    "name": "Burrowes",
    "position": "MID"
  },
  {
    "id": "p32",
    "teamId": "avl",
    "name": "Cash",
    "position": "DEF"
  },
  {
    "id": "p30",
    "teamId": "avl",
    "name": "Digne",
    "position": "DEF"
  },
  {
    "id": "p160",
    "teamId": "avl",
    "name": "Garnacho",
    "position": "MID"
  },
  {
    "id": "p51",
    "teamId": "avl",
    "name": "George Hemmings",
    "position": "MID"
  },
  {
    "id": "p54",
    "teamId": "avl",
    "name": "Gomes",
    "position": "MID"
  },
  {
    "id": "p49",
    "teamId": "avl",
    "name": "Iling Jr",
    "position": "MID"
  },
  {
    "id": "p47",
    "teamId": "avl",
    "name": "Kamara",
    "position": "MID"
  },
  {
    "id": "p31",
    "teamId": "avl",
    "name": "Konsa",
    "position": "DEF"
  },
  {
    "id": "p37",
    "teamId": "avl",
    "name": "Lindelöf",
    "position": "DEF"
  },
  {
    "id": "p29",
    "teamId": "avl",
    "name": "M.Bizot",
    "position": "GK"
  },
  {
    "id": "p36",
    "teamId": "avl",
    "name": "Maatsen",
    "position": "DEF"
  },
  {
    "id": "p582",
    "teamId": "avl",
    "name": "Madjo",
    "position": "FWD"
  },
  {
    "id": "p53",
    "teamId": "avl",
    "name": "Manzambi",
    "position": "MID"
  },
  {
    "id": "p28",
    "teamId": "avl",
    "name": "Martinez",
    "position": "GK"
  },
  {
    "id": "p45",
    "teamId": "avl",
    "name": "McGinn",
    "position": "MID"
  },
  {
    "id": "p33",
    "teamId": "avl",
    "name": "Mings",
    "position": "DEF"
  },
  {
    "id": "p39",
    "teamId": "avl",
    "name": "Nedeljkovic",
    "position": "DEF"
  },
  {
    "id": "p48",
    "teamId": "avl",
    "name": "Onana",
    "position": "MID"
  },
  {
    "id": "p34",
    "teamId": "avl",
    "name": "Pau",
    "position": "DEF"
  },
  {
    "id": "p55",
    "teamId": "avl",
    "name": "Watkins",
    "position": "FWD"
  },
  {
    "id": "p129",
    "teamId": "bha",
    "name": "Ayari",
    "position": "MID"
  },
  {
    "id": "p131",
    "teamId": "bha",
    "name": "Baleba",
    "position": "MID"
  },
  {
    "id": "p114",
    "teamId": "bha",
    "name": "Boscagli",
    "position": "DEF"
  },
  {
    "id": "p128",
    "teamId": "bha",
    "name": "Buonanotte",
    "position": "MID"
  },
  {
    "id": "p117",
    "teamId": "bha",
    "name": "Coppola",
    "position": "DEF"
  },
  {
    "id": "p119",
    "teamId": "bha",
    "name": "Costinha",
    "position": "DEF"
  },
  {
    "id": "p115",
    "teamId": "bha",
    "name": "De Cuyper",
    "position": "DEF"
  },
  {
    "id": "p116",
    "teamId": "bha",
    "name": "Dunk",
    "position": "DEF"
  },
  {
    "id": "p113",
    "teamId": "bha",
    "name": "F.Kadıoğlu",
    "position": "DEF"
  },
  {
    "id": "p139",
    "teamId": "bha",
    "name": "Ferguson",
    "position": "FWD"
  },
  {
    "id": "p125",
    "teamId": "bha",
    "name": "Georginio",
    "position": "FWD"
  },
  {
    "id": "p127",
    "teamId": "bha",
    "name": "Gomez",
    "position": "MID"
  },
  {
    "id": "p124",
    "teamId": "bha",
    "name": "Groß",
    "position": "MID"
  },
  {
    "id": "p123",
    "teamId": "bha",
    "name": "Hinshelwood",
    "position": "MID"
  },
  {
    "id": "p132",
    "teamId": "bha",
    "name": "Howell",
    "position": "MID"
  },
  {
    "id": "p118",
    "teamId": "bha",
    "name": "Igor",
    "position": "DEF"
  },
  {
    "id": "p138",
    "teamId": "bha",
    "name": "Kostoulas",
    "position": "FWD"
  },
  {
    "id": "p122",
    "teamId": "bha",
    "name": "Minteh",
    "position": "MID"
  },
  {
    "id": "p121",
    "teamId": "bha",
    "name": "Mitoma",
    "position": "MID"
  },
  {
    "id": "p126",
    "teamId": "bha",
    "name": "O'Riley",
    "position": "MID"
  },
  {
    "id": "p134",
    "teamId": "bha",
    "name": "Oriola",
    "position": "MID"
  },
  {
    "id": "p111",
    "teamId": "bha",
    "name": "Steele",
    "position": "GK"
  },
  {
    "id": "p328",
    "teamId": "bha",
    "name": "Struijk",
    "position": "DEF"
  },
  {
    "id": "p120",
    "teamId": "bha",
    "name": "Svoboda",
    "position": "DEF"
  },
  {
    "id": "p137",
    "teamId": "bha",
    "name": "Tzimas",
    "position": "FWD"
  },
  {
    "id": "p109",
    "teamId": "bha",
    "name": "Verbruggen",
    "position": "GK"
  },
  {
    "id": "p504",
    "teamId": "bha",
    "name": "Vuskovic",
    "position": "DEF"
  },
  {
    "id": "p133",
    "teamId": "bha",
    "name": "Watson",
    "position": "MID"
  },
  {
    "id": "p130",
    "teamId": "bha",
    "name": "Wieffer",
    "position": "DEF"
  },
  {
    "id": "p135",
    "teamId": "bha",
    "name": "Yohanna",
    "position": "MID"
  },
  {
    "id": "p73",
    "teamId": "bou",
    "name": "Adams",
    "position": "MID"
  },
  {
    "id": "p77",
    "teamId": "bou",
    "name": "Adli",
    "position": "MID"
  },
  {
    "id": "p74",
    "teamId": "bou",
    "name": "Brooks",
    "position": "MID"
  },
  {
    "id": "p75",
    "teamId": "bou",
    "name": "Christie",
    "position": "MID"
  },
  {
    "id": "p71",
    "teamId": "bou",
    "name": "Cook",
    "position": "MID"
  },
  {
    "id": "p59",
    "teamId": "bou",
    "name": "Dennis",
    "position": "GK"
  },
  {
    "id": "p62",
    "teamId": "bou",
    "name": "Diakité",
    "position": "DEF"
  },
  {
    "id": "p80",
    "teamId": "bou",
    "name": "Enes Ünal",
    "position": "FWD"
  },
  {
    "id": "p79",
    "teamId": "bou",
    "name": "Evanilson",
    "position": "FWD"
  },
  {
    "id": "p58",
    "teamId": "bou",
    "name": "Forster",
    "position": "GK"
  },
  {
    "id": "p72",
    "teamId": "bou",
    "name": "Gannon-Doak",
    "position": "MID"
  },
  {
    "id": "p60",
    "teamId": "bou",
    "name": "Hill",
    "position": "DEF"
  },
  {
    "id": "p65",
    "teamId": "bou",
    "name": "J.Araujo",
    "position": "DEF"
  },
  {
    "id": "p70",
    "teamId": "bou",
    "name": "Kluivert",
    "position": "MID"
  },
  {
    "id": "p78",
    "teamId": "bou",
    "name": "Kroupi.Jr",
    "position": "MID"
  },
  {
    "id": "p63",
    "teamId": "bou",
    "name": "Milosavljević",
    "position": "DEF"
  },
  {
    "id": "p57",
    "teamId": "bou",
    "name": "Petrović",
    "position": "GK"
  },
  {
    "id": "p67",
    "teamId": "bou",
    "name": "Rayan",
    "position": "MID"
  },
  {
    "id": "p81",
    "teamId": "bou",
    "name": "Rodríguez",
    "position": "FWD"
  },
  {
    "id": "p573",
    "teamId": "bou",
    "name": "Sanchez",
    "position": "DEF"
  },
  {
    "id": "p69",
    "teamId": "bou",
    "name": "Scott",
    "position": "MID"
  },
  {
    "id": "p566",
    "teamId": "bou",
    "name": "Silva",
    "position": "DEF"
  },
  {
    "id": "p64",
    "teamId": "bou",
    "name": "Smith",
    "position": "DEF"
  },
  {
    "id": "p66",
    "teamId": "bou",
    "name": "Soler",
    "position": "DEF"
  },
  {
    "id": "p68",
    "teamId": "bou",
    "name": "Tavernier",
    "position": "MID"
  },
  {
    "id": "p76",
    "teamId": "bou",
    "name": "Tóth.A",
    "position": "MID"
  },
  {
    "id": "p61",
    "teamId": "bou",
    "name": "Truffert",
    "position": "DEF"
  },
  {
    "id": "p87",
    "teamId": "bre",
    "name": "Ajer",
    "position": "DEF"
  },
  {
    "id": "p105",
    "teamId": "bre",
    "name": "Anthony",
    "position": "MID"
  },
  {
    "id": "p100",
    "teamId": "bre",
    "name": "Carvalho",
    "position": "MID"
  },
  {
    "id": "p84",
    "teamId": "bre",
    "name": "Collins",
    "position": "DEF"
  },
  {
    "id": "p96",
    "teamId": "bre",
    "name": "Damsgaard",
    "position": "MID"
  },
  {
    "id": "p103",
    "teamId": "bre",
    "name": "Dasilva",
    "position": "MID"
  },
  {
    "id": "p107",
    "teamId": "bre",
    "name": "Furo",
    "position": "FWD"
  },
  {
    "id": "p89",
    "teamId": "bre",
    "name": "Henry",
    "position": "DEF"
  },
  {
    "id": "p90",
    "teamId": "bre",
    "name": "Hickey",
    "position": "DEF"
  },
  {
    "id": "p98",
    "teamId": "bre",
    "name": "Janelt",
    "position": "MID"
  },
  {
    "id": "p97",
    "teamId": "bre",
    "name": "Jensen",
    "position": "MID"
  },
  {
    "id": "p92",
    "teamId": "bre",
    "name": "Ji-soo",
    "position": "DEF"
  },
  {
    "id": "p88",
    "teamId": "bre",
    "name": "Kayode",
    "position": "DEF"
  },
  {
    "id": "p82",
    "teamId": "bre",
    "name": "Kelleher",
    "position": "GK"
  },
  {
    "id": "p86",
    "teamId": "bre",
    "name": "Lewis-Potter",
    "position": "MID"
  },
  {
    "id": "p99",
    "teamId": "bre",
    "name": "Milambo",
    "position": "MID"
  },
  {
    "id": "p95",
    "teamId": "bre",
    "name": "O.Dango",
    "position": "MID"
  },
  {
    "id": "p91",
    "teamId": "bre",
    "name": "Pinnock",
    "position": "DEF"
  },
  {
    "id": "p565",
    "teamId": "bre",
    "name": "Sangaré",
    "position": "MID"
  },
  {
    "id": "p94",
    "teamId": "bre",
    "name": "Schade",
    "position": "MID"
  },
  {
    "id": "p93",
    "teamId": "bre",
    "name": "Schuster",
    "position": "DEF"
  },
  {
    "id": "p106",
    "teamId": "bre",
    "name": "Thiago",
    "position": "FWD"
  },
  {
    "id": "p83",
    "teamId": "bre",
    "name": "Valdimarsson",
    "position": "GK"
  },
  {
    "id": "p85",
    "teamId": "bre",
    "name": "Van den Berg",
    "position": "DEF"
  },
  {
    "id": "p108",
    "teamId": "bre",
    "name": "Wilson",
    "position": "FWD"
  },
  {
    "id": "p102",
    "teamId": "bre",
    "name": "Yarmoliuk",
    "position": "MID"
  },
  {
    "id": "p151",
    "teamId": "che",
    "name": "Acheampong",
    "position": "DEF"
  },
  {
    "id": "p561",
    "teamId": "che",
    "name": "Anselmino",
    "position": "DEF"
  },
  {
    "id": "p146",
    "teamId": "che",
    "name": "B.Badiashile",
    "position": "DEF"
  },
  {
    "id": "p568",
    "teamId": "che",
    "name": "Barco",
    "position": "MID"
  },
  {
    "id": "p159",
    "teamId": "che",
    "name": "Caicedo",
    "position": "MID"
  },
  {
    "id": "p143",
    "teamId": "che",
    "name": "Chalobah",
    "position": "DEF"
  },
  {
    "id": "p583",
    "teamId": "che",
    "name": "Chavarria",
    "position": "DEF"
  },
  {
    "id": "p149",
    "teamId": "che",
    "name": "Colwill",
    "position": "DEF"
  },
  {
    "id": "p163",
    "teamId": "che",
    "name": "D.Essugo",
    "position": "MID"
  },
  {
    "id": "p167",
    "teamId": "che",
    "name": "Delap",
    "position": "FWD"
  },
  {
    "id": "p153",
    "teamId": "che",
    "name": "Disasi",
    "position": "DEF"
  },
  {
    "id": "p170",
    "teamId": "che",
    "name": "Emegha",
    "position": "FWD"
  },
  {
    "id": "p155",
    "teamId": "che",
    "name": "Enzo",
    "position": "MID"
  },
  {
    "id": "p157",
    "teamId": "che",
    "name": "Estêvão",
    "position": "MID"
  },
  {
    "id": "p145",
    "teamId": "che",
    "name": "Fofana",
    "position": "DEF"
  },
  {
    "id": "p158",
    "teamId": "che",
    "name": "Gittens",
    "position": "MID"
  },
  {
    "id": "p144",
    "teamId": "che",
    "name": "Gusto",
    "position": "DEF"
  },
  {
    "id": "p148",
    "teamId": "che",
    "name": "Hato",
    "position": "DEF"
  },
  {
    "id": "p101",
    "teamId": "che",
    "name": "Henderson",
    "position": "MID"
  },
  {
    "id": "p142",
    "teamId": "che",
    "name": "James",
    "position": "DEF"
  },
  {
    "id": "p165",
    "teamId": "che",
    "name": "João Pedro",
    "position": "FWD"
  },
  {
    "id": "p141",
    "teamId": "che",
    "name": "Jörgensen",
    "position": "GK"
  },
  {
    "id": "p200",
    "teamId": "che",
    "name": "Lacroix",
    "position": "DEF"
  },
  {
    "id": "p161",
    "teamId": "che",
    "name": "Lavia",
    "position": "MID"
  },
  {
    "id": "p150",
    "teamId": "che",
    "name": "M.Sarr",
    "position": "DEF"
  },
  {
    "id": "p168",
    "teamId": "che",
    "name": "Marc Guiu",
    "position": "FWD"
  },
  {
    "id": "p169",
    "teamId": "che",
    "name": "Mheuka",
    "position": "FWD"
  },
  {
    "id": "p578",
    "teamId": "che",
    "name": "Mudryk",
    "position": "MID"
  },
  {
    "id": "p166",
    "teamId": "che",
    "name": "N.Jackson",
    "position": "FWD"
  },
  {
    "id": "p156",
    "teamId": "che",
    "name": "Neto",
    "position": "MID"
  },
  {
    "id": "p152",
    "teamId": "che",
    "name": "Palestra",
    "position": "DEF"
  },
  {
    "id": "p154",
    "teamId": "che",
    "name": "Palmer",
    "position": "MID"
  },
  {
    "id": "p560",
    "teamId": "che",
    "name": "Penders",
    "position": "GK"
  },
  {
    "id": "p164",
    "teamId": "che",
    "name": "Quenda",
    "position": "MID"
  },
  {
    "id": "p40",
    "teamId": "che",
    "name": "Rogers",
    "position": "MID"
  },
  {
    "id": "p140",
    "teamId": "che",
    "name": "Sánchez",
    "position": "GK"
  },
  {
    "id": "p147",
    "teamId": "che",
    "name": "Tosin",
    "position": "DEF"
  },
  {
    "id": "p136",
    "teamId": "che",
    "name": "Welbeck",
    "position": "FWD"
  },
  {
    "id": "p182",
    "teamId": "cov",
    "name": "Amenda",
    "position": "DEF"
  },
  {
    "id": "p192",
    "teamId": "cov",
    "name": "Andrews",
    "position": "MID"
  },
  {
    "id": "p197",
    "teamId": "cov",
    "name": "Bassette",
    "position": "FWD"
  },
  {
    "id": "p178",
    "teamId": "cov",
    "name": "Bidwell",
    "position": "DEF"
  },
  {
    "id": "p191",
    "teamId": "cov",
    "name": "Borges Rodrigues",
    "position": "MID"
  },
  {
    "id": "p181",
    "teamId": "cov",
    "name": "Brau",
    "position": "DEF"
  },
  {
    "id": "p176",
    "teamId": "cov",
    "name": "Dasilva",
    "position": "DEF"
  },
  {
    "id": "p171",
    "teamId": "cov",
    "name": "Dovin",
    "position": "GK"
  },
  {
    "id": "p187",
    "teamId": "cov",
    "name": "Eccles",
    "position": "MID"
  },
  {
    "id": "p184",
    "teamId": "cov",
    "name": "Grimes",
    "position": "MID"
  },
  {
    "id": "p584",
    "teamId": "cov",
    "name": "Hamer",
    "position": "MID"
  },
  {
    "id": "p177",
    "teamId": "cov",
    "name": "Kesler-Hayden",
    "position": "DEF"
  },
  {
    "id": "p174",
    "teamId": "cov",
    "name": "Kitching",
    "position": "DEF"
  },
  {
    "id": "p179",
    "teamId": "cov",
    "name": "Latibeaudiere",
    "position": "DEF"
  },
  {
    "id": "p196",
    "teamId": "cov",
    "name": "Markelo",
    "position": "FWD"
  },
  {
    "id": "p186",
    "teamId": "cov",
    "name": "Mason-Clark",
    "position": "MID"
  },
  {
    "id": "p104",
    "teamId": "cov",
    "name": "Onyeka",
    "position": "MID"
  },
  {
    "id": "p183",
    "teamId": "cov",
    "name": "Rudoni",
    "position": "MID"
  },
  {
    "id": "p110",
    "teamId": "cov",
    "name": "Rushworth",
    "position": "GK"
  },
  {
    "id": "p185",
    "teamId": "cov",
    "name": "Sakamoto",
    "position": "MID"
  },
  {
    "id": "p189",
    "teamId": "cov",
    "name": "Shepherd",
    "position": "MID"
  },
  {
    "id": "p195",
    "teamId": "cov",
    "name": "Simms",
    "position": "FWD"
  },
  {
    "id": "p190",
    "teamId": "cov",
    "name": "Tchaouna",
    "position": "MID"
  },
  {
    "id": "p173",
    "teamId": "cov",
    "name": "Thomas",
    "position": "DEF"
  },
  {
    "id": "p194",
    "teamId": "cov",
    "name": "Thomas-Asante",
    "position": "FWD"
  },
  {
    "id": "p188",
    "teamId": "cov",
    "name": "Torp",
    "position": "MID"
  },
  {
    "id": "p175",
    "teamId": "cov",
    "name": "van Ewijk",
    "position": "DEF"
  },
  {
    "id": "p172",
    "teamId": "cov",
    "name": "Wilson",
    "position": "GK"
  },
  {
    "id": "p180",
    "teamId": "cov",
    "name": "Woolfenden",
    "position": "DEF"
  },
  {
    "id": "p193",
    "teamId": "cov",
    "name": "Wright",
    "position": "FWD"
  },
  {
    "id": "p575",
    "teamId": "cov",
    "name": "Yirenkyi",
    "position": "MID"
  },
  {
    "id": "p199",
    "teamId": "cry",
    "name": "Benitez",
    "position": "GK"
  },
  {
    "id": "p203",
    "teamId": "cry",
    "name": "Canvot",
    "position": "DEF"
  },
  {
    "id": "p220",
    "teamId": "cry",
    "name": "Cardines",
    "position": "DEF"
  },
  {
    "id": "p206",
    "teamId": "cry",
    "name": "Chadi Riad",
    "position": "DEF"
  },
  {
    "id": "p215",
    "teamId": "cry",
    "name": "Devenny",
    "position": "MID"
  },
  {
    "id": "p218",
    "teamId": "cry",
    "name": "Doucouré",
    "position": "MID"
  },
  {
    "id": "p221",
    "teamId": "cry",
    "name": "Drakes-Thomas",
    "position": "MID"
  },
  {
    "id": "p216",
    "teamId": "cry",
    "name": "Esse",
    "position": "MID"
  },
  {
    "id": "p42",
    "teamId": "cry",
    "name": "Guessand",
    "position": "MID"
  },
  {
    "id": "p198",
    "teamId": "cry",
    "name": "Henderson",
    "position": "GK"
  },
  {
    "id": "p212",
    "teamId": "cry",
    "name": "Hughes",
    "position": "MID"
  },
  {
    "id": "p219",
    "teamId": "cry",
    "name": "J.Rak-Sakyi",
    "position": "MID"
  },
  {
    "id": "p214",
    "teamId": "cry",
    "name": "Kamada",
    "position": "MID"
  },
  {
    "id": "p213",
    "teamId": "cry",
    "name": "Lerma",
    "position": "MID"
  },
  {
    "id": "p217",
    "teamId": "cry",
    "name": "M.França",
    "position": "MID"
  },
  {
    "id": "p223",
    "teamId": "cry",
    "name": "Mateta",
    "position": "FWD"
  },
  {
    "id": "p555",
    "teamId": "cry",
    "name": "Matthews",
    "position": "GK"
  },
  {
    "id": "p241",
    "teamId": "cry",
    "name": "McNeil",
    "position": "MID"
  },
  {
    "id": "p207",
    "teamId": "cry",
    "name": "Mingueza",
    "position": "DEF"
  },
  {
    "id": "p204",
    "teamId": "cry",
    "name": "Mitchell",
    "position": "DEF"
  },
  {
    "id": "p201",
    "teamId": "cry",
    "name": "Muñoz",
    "position": "DEF"
  },
  {
    "id": "p224",
    "teamId": "cry",
    "name": "Nketiah",
    "position": "FWD"
  },
  {
    "id": "p202",
    "teamId": "cry",
    "name": "Richards",
    "position": "DEF"
  },
  {
    "id": "p208",
    "teamId": "cry",
    "name": "Sarr",
    "position": "MID"
  },
  {
    "id": "p205",
    "teamId": "cry",
    "name": "Sosa",
    "position": "DEF"
  },
  {
    "id": "p222",
    "teamId": "cry",
    "name": "Strand Larsen",
    "position": "FWD"
  },
  {
    "id": "p577",
    "teamId": "cry",
    "name": "Tomiyasu",
    "position": "DEF"
  },
  {
    "id": "p225",
    "teamId": "cry",
    "name": "Uche",
    "position": "FWD"
  },
  {
    "id": "p210",
    "teamId": "cry",
    "name": "Wharton",
    "position": "MID"
  },
  {
    "id": "p211",
    "teamId": "cry",
    "name": "Yeremy",
    "position": "MID"
  },
  {
    "id": "p243",
    "teamId": "eve",
    "name": "Alcaraz",
    "position": "MID"
  },
  {
    "id": "p244",
    "teamId": "eve",
    "name": "Armstrong",
    "position": "MID"
  },
  {
    "id": "p235",
    "teamId": "eve",
    "name": "Aznou",
    "position": "DEF"
  },
  {
    "id": "p249",
    "teamId": "eve",
    "name": "Barry",
    "position": "FWD"
  },
  {
    "id": "p248",
    "teamId": "eve",
    "name": "Beto",
    "position": "FWD"
  },
  {
    "id": "p230",
    "teamId": "eve",
    "name": "Branthwaite",
    "position": "DEF"
  },
  {
    "id": "p236",
    "teamId": "eve",
    "name": "Dewsbury-Hall",
    "position": "MID"
  },
  {
    "id": "p245",
    "teamId": "eve",
    "name": "Dibling",
    "position": "MID"
  },
  {
    "id": "p239",
    "teamId": "eve",
    "name": "Garner",
    "position": "MID"
  },
  {
    "id": "p242",
    "teamId": "eve",
    "name": "George",
    "position": "MID"
  },
  {
    "id": "p247",
    "teamId": "eve",
    "name": "Hackney",
    "position": "MID"
  },
  {
    "id": "p240",
    "teamId": "eve",
    "name": "Iroegbunam",
    "position": "MID"
  },
  {
    "id": "p209",
    "teamId": "eve",
    "name": "Johnson",
    "position": "MID"
  },
  {
    "id": "p231",
    "teamId": "eve",
    "name": "Keane",
    "position": "DEF"
  },
  {
    "id": "p228",
    "teamId": "eve",
    "name": "King",
    "position": "GK"
  },
  {
    "id": "p233",
    "teamId": "eve",
    "name": "Mykolenko",
    "position": "DEF"
  },
  {
    "id": "p237",
    "teamId": "eve",
    "name": "Ndiaye",
    "position": "MID"
  },
  {
    "id": "p21",
    "teamId": "eve",
    "name": "Nørgaard",
    "position": "MID"
  },
  {
    "id": "p232",
    "teamId": "eve",
    "name": "O'Brien",
    "position": "DEF"
  },
  {
    "id": "p234",
    "teamId": "eve",
    "name": "Patterson",
    "position": "DEF"
  },
  {
    "id": "p226",
    "teamId": "eve",
    "name": "Pickford",
    "position": "GK"
  },
  {
    "id": "p246",
    "teamId": "eve",
    "name": "Röhl",
    "position": "MID"
  },
  {
    "id": "p229",
    "teamId": "eve",
    "name": "Tarkowski",
    "position": "DEF"
  },
  {
    "id": "p227",
    "teamId": "eve",
    "name": "Travers",
    "position": "GK"
  },
  {
    "id": "p253",
    "teamId": "ful",
    "name": "Andersen",
    "position": "DEF"
  },
  {
    "id": "p257",
    "teamId": "ful",
    "name": "Bassey",
    "position": "DEF"
  },
  {
    "id": "p265",
    "teamId": "ful",
    "name": "Berge",
    "position": "MID"
  },
  {
    "id": "p264",
    "teamId": "ful",
    "name": "Bobb",
    "position": "MID"
  },
  {
    "id": "p266",
    "teamId": "ful",
    "name": "Cairney",
    "position": "MID"
  },
  {
    "id": "p258",
    "teamId": "ful",
    "name": "Castagne",
    "position": "DEF"
  },
  {
    "id": "p580",
    "teamId": "ful",
    "name": "Charles",
    "position": "MID"
  },
  {
    "id": "p569",
    "teamId": "ful",
    "name": "García",
    "position": "FWD"
  },
  {
    "id": "p261",
    "teamId": "ful",
    "name": "Iwobi",
    "position": "MID"
  },
  {
    "id": "p255",
    "teamId": "ful",
    "name": "J.Cuenca",
    "position": "DEF"
  },
  {
    "id": "p263",
    "teamId": "ful",
    "name": "Kevin",
    "position": "MID"
  },
  {
    "id": "p268",
    "teamId": "ful",
    "name": "King",
    "position": "MID"
  },
  {
    "id": "p272",
    "teamId": "ful",
    "name": "Kusi-Asare",
    "position": "FWD"
  },
  {
    "id": "p251",
    "teamId": "ful",
    "name": "Lecomte",
    "position": "GK"
  },
  {
    "id": "p250",
    "teamId": "ful",
    "name": "Leno",
    "position": "GK"
  },
  {
    "id": "p252",
    "teamId": "ful",
    "name": "McNally",
    "position": "GK"
  },
  {
    "id": "p271",
    "teamId": "ful",
    "name": "Muniz",
    "position": "FWD"
  },
  {
    "id": "p570",
    "teamId": "ful",
    "name": "Palacios",
    "position": "MID"
  },
  {
    "id": "p270",
    "teamId": "ful",
    "name": "Reed",
    "position": "MID"
  },
  {
    "id": "p254",
    "teamId": "ful",
    "name": "Robinson",
    "position": "DEF"
  },
  {
    "id": "p269",
    "teamId": "ful",
    "name": "Sessegnon",
    "position": "DEF"
  },
  {
    "id": "p262",
    "teamId": "ful",
    "name": "Smith Rowe",
    "position": "MID"
  },
  {
    "id": "p256",
    "teamId": "ful",
    "name": "Tete",
    "position": "DEF"
  },
  {
    "id": "p279",
    "teamId": "hul",
    "name": "Ajayi",
    "position": "DEF"
  },
  {
    "id": "p296",
    "teamId": "hul",
    "name": "Akintola",
    "position": "MID"
  },
  {
    "id": "p286",
    "teamId": "hul",
    "name": "Belloumi",
    "position": "MID"
  },
  {
    "id": "p299",
    "teamId": "hul",
    "name": "Burstow",
    "position": "FWD"
  },
  {
    "id": "p274",
    "teamId": "hul",
    "name": "Butland",
    "position": "GK"
  },
  {
    "id": "p275",
    "teamId": "hul",
    "name": "Cartwright",
    "position": "GK"
  },
  {
    "id": "p280",
    "teamId": "hul",
    "name": "Coyle",
    "position": "DEF"
  },
  {
    "id": "p289",
    "teamId": "hul",
    "name": "Crooks",
    "position": "MID"
  },
  {
    "id": "p298",
    "teamId": "hul",
    "name": "Destan",
    "position": "FWD"
  },
  {
    "id": "p288",
    "teamId": "hul",
    "name": "Dowell",
    "position": "MID"
  },
  {
    "id": "p281",
    "teamId": "hul",
    "name": "Drameh",
    "position": "DEF"
  },
  {
    "id": "p277",
    "teamId": "hul",
    "name": "Egan",
    "position": "DEF"
  },
  {
    "id": "p282",
    "teamId": "hul",
    "name": "Giles",
    "position": "DEF"
  },
  {
    "id": "p297",
    "teamId": "hul",
    "name": "Gyabi",
    "position": "MID"
  },
  {
    "id": "p574",
    "teamId": "hul",
    "name": "Hjertø-Dahl",
    "position": "MID"
  },
  {
    "id": "p278",
    "teamId": "hul",
    "name": "Hughes",
    "position": "DEF"
  },
  {
    "id": "p283",
    "teamId": "hul",
    "name": "Jacob",
    "position": "DEF"
  },
  {
    "id": "p293",
    "teamId": "hul",
    "name": "Kamara",
    "position": "MID"
  },
  {
    "id": "p276",
    "teamId": "hul",
    "name": "Lo-Tutala",
    "position": "GK"
  },
  {
    "id": "p291",
    "teamId": "hul",
    "name": "Matazo",
    "position": "MID"
  },
  {
    "id": "p295",
    "teamId": "hul",
    "name": "McBurnie",
    "position": "FWD"
  },
  {
    "id": "p284",
    "teamId": "hul",
    "name": "McCarthy",
    "position": "DEF"
  },
  {
    "id": "p285",
    "teamId": "hul",
    "name": "McNair",
    "position": "DEF"
  },
  {
    "id": "p287",
    "teamId": "hul",
    "name": "Millar",
    "position": "MID"
  },
  {
    "id": "p563",
    "teamId": "hul",
    "name": "Morita",
    "position": "MID"
  },
  {
    "id": "p292",
    "teamId": "hul",
    "name": "Ömür",
    "position": "MID"
  },
  {
    "id": "p273",
    "teamId": "hul",
    "name": "Phillips",
    "position": "GK"
  },
  {
    "id": "p290",
    "teamId": "hul",
    "name": "Slater",
    "position": "MID"
  },
  {
    "id": "p576",
    "teamId": "hul",
    "name": "Stroud",
    "position": "MID"
  },
  {
    "id": "p556",
    "teamId": "hul",
    "name": "Targett",
    "position": "DEF"
  },
  {
    "id": "p572",
    "teamId": "hul",
    "name": "Tzolakis",
    "position": "GK"
  },
  {
    "id": "p294",
    "teamId": "hul",
    "name": "Zambrano",
    "position": "MID"
  },
  {
    "id": "p320",
    "teamId": "ips",
    "name": "Akpom",
    "position": "FWD"
  },
  {
    "id": "p322",
    "teamId": "ips",
    "name": "Al-Hamadi",
    "position": "FWD"
  },
  {
    "id": "p311",
    "teamId": "ips",
    "name": "Burns",
    "position": "MID"
  },
  {
    "id": "p302",
    "teamId": "ips",
    "name": "Button",
    "position": "GK"
  },
  {
    "id": "p313",
    "teamId": "ips",
    "name": "Clarke",
    "position": "MID"
  },
  {
    "id": "p305",
    "teamId": "ips",
    "name": "Davis",
    "position": "DEF"
  },
  {
    "id": "p259",
    "teamId": "ips",
    "name": "Diop",
    "position": "DEF"
  },
  {
    "id": "p316",
    "teamId": "ips",
    "name": "Emersonn",
    "position": "FWD"
  },
  {
    "id": "p315",
    "teamId": "ips",
    "name": "Fatawu",
    "position": "MID"
  },
  {
    "id": "p571",
    "teamId": "ips",
    "name": "Florentino",
    "position": "MID"
  },
  {
    "id": "p308",
    "teamId": "ips",
    "name": "Furlong",
    "position": "DEF"
  },
  {
    "id": "p306",
    "teamId": "ips",
    "name": "Greaves",
    "position": "DEF"
  },
  {
    "id": "p317",
    "teamId": "ips",
    "name": "Hirst",
    "position": "FWD"
  },
  {
    "id": "p307",
    "teamId": "ips",
    "name": "Johnson",
    "position": "DEF"
  },
  {
    "id": "p303",
    "teamId": "ips",
    "name": "Kipré",
    "position": "DEF"
  },
  {
    "id": "p267",
    "teamId": "ips",
    "name": "Lukić",
    "position": "MID"
  },
  {
    "id": "p562",
    "teamId": "ips",
    "name": "Maeda",
    "position": "MID"
  },
  {
    "id": "p310",
    "teamId": "ips",
    "name": "Matusiwa",
    "position": "MID"
  },
  {
    "id": "p323",
    "teamId": "ips",
    "name": "McAteer",
    "position": "MID"
  },
  {
    "id": "p324",
    "teamId": "ips",
    "name": "Mehmeti",
    "position": "MID"
  },
  {
    "id": "p309",
    "teamId": "ips",
    "name": "Núñez",
    "position": "MID"
  },
  {
    "id": "p304",
    "teamId": "ips",
    "name": "O'Shea",
    "position": "DEF"
  },
  {
    "id": "p314",
    "teamId": "ips",
    "name": "Ogbene",
    "position": "MID"
  },
  {
    "id": "p301",
    "teamId": "ips",
    "name": "Palmer",
    "position": "GK"
  },
  {
    "id": "p318",
    "teamId": "ips",
    "name": "Philogene",
    "position": "MID"
  },
  {
    "id": "p564",
    "teamId": "ips",
    "name": "Scherpen",
    "position": "GK"
  },
  {
    "id": "p319",
    "teamId": "ips",
    "name": "Szmodics",
    "position": "MID"
  },
  {
    "id": "p312",
    "teamId": "ips",
    "name": "Taylor",
    "position": "MID"
  },
  {
    "id": "p554",
    "teamId": "ips",
    "name": "Van Oevelen",
    "position": "GK"
  },
  {
    "id": "p321",
    "teamId": "ips",
    "name": "Walle Egeli",
    "position": "FWD"
  },
  {
    "id": "p300",
    "teamId": "ips",
    "name": "Walton",
    "position": "GK"
  },
  {
    "id": "p337",
    "teamId": "lee",
    "name": "Aaronson",
    "position": "MID"
  },
  {
    "id": "p338",
    "teamId": "lee",
    "name": "Ampadu",
    "position": "MID"
  },
  {
    "id": "p327",
    "teamId": "lee",
    "name": "Bijol",
    "position": "DEF"
  },
  {
    "id": "p330",
    "teamId": "lee",
    "name": "Bogle",
    "position": "DEF"
  },
  {
    "id": "p333",
    "teamId": "lee",
    "name": "Bornauw",
    "position": "DEF"
  },
  {
    "id": "p346",
    "teamId": "lee",
    "name": "Calvert-Lewin",
    "position": "FWD"
  },
  {
    "id": "p340",
    "teamId": "lee",
    "name": "Gelhardt",
    "position": "MID"
  },
  {
    "id": "p341",
    "teamId": "lee",
    "name": "Gnonto",
    "position": "MID"
  },
  {
    "id": "p344",
    "teamId": "lee",
    "name": "Gruev",
    "position": "MID"
  },
  {
    "id": "p331",
    "teamId": "lee",
    "name": "Gudmundsson",
    "position": "DEF"
  },
  {
    "id": "p342",
    "teamId": "lee",
    "name": "Harrison",
    "position": "MID"
  },
  {
    "id": "p343",
    "teamId": "lee",
    "name": "James",
    "position": "MID"
  },
  {
    "id": "p332",
    "teamId": "lee",
    "name": "Justin",
    "position": "DEF"
  },
  {
    "id": "p339",
    "teamId": "lee",
    "name": "Longstaff",
    "position": "MID"
  },
  {
    "id": "p349",
    "teamId": "lee",
    "name": "Mateo Joseph",
    "position": "FWD"
  },
  {
    "id": "p334",
    "teamId": "lee",
    "name": "Muharemović",
    "position": "DEF"
  },
  {
    "id": "p347",
    "teamId": "lee",
    "name": "Nmecha",
    "position": "FWD"
  },
  {
    "id": "p336",
    "teamId": "lee",
    "name": "Okafor",
    "position": "MID"
  },
  {
    "id": "p326",
    "teamId": "lee",
    "name": "Perri",
    "position": "GK"
  },
  {
    "id": "p348",
    "teamId": "lee",
    "name": "Piroe",
    "position": "FWD"
  },
  {
    "id": "p329",
    "teamId": "lee",
    "name": "Rodon",
    "position": "DEF"
  },
  {
    "id": "p335",
    "teamId": "lee",
    "name": "Stach",
    "position": "MID"
  },
  {
    "id": "p345",
    "teamId": "lee",
    "name": "Tanaka",
    "position": "MID"
  },
  {
    "id": "p385",
    "teamId": "lee",
    "name": "Trafford",
    "position": "GK"
  },
  {
    "id": "p260",
    "teamId": "lee",
    "name": "Wilson",
    "position": "MID"
  },
  {
    "id": "p350",
    "teamId": "liv",
    "name": "A.Becker",
    "position": "GK"
  },
  {
    "id": "p579",
    "teamId": "liv",
    "name": "Araujo",
    "position": "DEF"
  },
  {
    "id": "p376",
    "teamId": "liv",
    "name": "Bajcetic",
    "position": "MID"
  },
  {
    "id": "p360",
    "teamId": "liv",
    "name": "Bradley",
    "position": "DEF"
  },
  {
    "id": "p373",
    "teamId": "liv",
    "name": "C.Jones",
    "position": "MID"
  },
  {
    "id": "p370",
    "teamId": "liv",
    "name": "Chiesa",
    "position": "MID"
  },
  {
    "id": "p382",
    "teamId": "liv",
    "name": "Danns",
    "position": "FWD"
  },
  {
    "id": "p355",
    "teamId": "liv",
    "name": "Davies",
    "position": "GK"
  },
  {
    "id": "p380",
    "teamId": "liv",
    "name": "Ekitiké",
    "position": "FWD"
  },
  {
    "id": "p383",
    "teamId": "liv",
    "name": "Elliott",
    "position": "MID"
  },
  {
    "id": "p374",
    "teamId": "liv",
    "name": "Endo",
    "position": "MID"
  },
  {
    "id": "p357",
    "teamId": "liv",
    "name": "Frimpong",
    "position": "DEF"
  },
  {
    "id": "p367",
    "teamId": "liv",
    "name": "Gakpo",
    "position": "MID"
  },
  {
    "id": "p359",
    "teamId": "liv",
    "name": "Gomez",
    "position": "DEF"
  },
  {
    "id": "p371",
    "teamId": "liv",
    "name": "Gravenberch",
    "position": "MID"
  },
  {
    "id": "p379",
    "teamId": "liv",
    "name": "Isak",
    "position": "FWD"
  },
  {
    "id": "p362",
    "teamId": "liv",
    "name": "Jacquet",
    "position": "DEF"
  },
  {
    "id": "p354",
    "teamId": "liv",
    "name": "Jaros",
    "position": "GK"
  },
  {
    "id": "p358",
    "teamId": "liv",
    "name": "Kerkez",
    "position": "DEF"
  },
  {
    "id": "p381",
    "teamId": "liv",
    "name": "Koumas",
    "position": "MID"
  },
  {
    "id": "p363",
    "teamId": "liv",
    "name": "Leoni",
    "position": "DEF"
  },
  {
    "id": "p361",
    "teamId": "liv",
    "name": "Lucky",
    "position": "DEF"
  },
  {
    "id": "p372",
    "teamId": "liv",
    "name": "Mac Allister",
    "position": "MID"
  },
  {
    "id": "p351",
    "teamId": "liv",
    "name": "Mamardashvili",
    "position": "GK"
  },
  {
    "id": "p378",
    "teamId": "liv",
    "name": "McConnell",
    "position": "MID"
  },
  {
    "id": "p377",
    "teamId": "liv",
    "name": "Munoz",
    "position": "MID"
  },
  {
    "id": "p369",
    "teamId": "liv",
    "name": "Ngumoha",
    "position": "MID"
  },
  {
    "id": "p375",
    "teamId": "liv",
    "name": "Nyoni",
    "position": "MID"
  },
  {
    "id": "p353",
    "teamId": "liv",
    "name": "Pecsi",
    "position": "GK"
  },
  {
    "id": "p365",
    "teamId": "liv",
    "name": "Ramsay",
    "position": "DEF"
  },
  {
    "id": "p368",
    "teamId": "liv",
    "name": "Szoboszlai",
    "position": "MID"
  },
  {
    "id": "p364",
    "teamId": "liv",
    "name": "Tsimikas",
    "position": "DEF"
  },
  {
    "id": "p356",
    "teamId": "liv",
    "name": "Virgil",
    "position": "DEF"
  },
  {
    "id": "p366",
    "teamId": "liv",
    "name": "Wirtz",
    "position": "MID"
  },
  {
    "id": "p352",
    "teamId": "liv",
    "name": "Woodman",
    "position": "GK"
  },
  {
    "id": "p392",
    "teamId": "mci",
    "name": "Aït-Nouri",
    "position": "DEF"
  },
  {
    "id": "p394",
    "teamId": "mci",
    "name": "Alleyne",
    "position": "DEF"
  },
  {
    "id": "p481",
    "teamId": "mci",
    "name": "Anderson",
    "position": "MID"
  },
  {
    "id": "p386",
    "teamId": "mci",
    "name": "Bettinelli",
    "position": "GK"
  },
  {
    "id": "p399",
    "teamId": "mci",
    "name": "Cherki",
    "position": "MID"
  },
  {
    "id": "p400",
    "teamId": "mci",
    "name": "Doku",
    "position": "MID"
  },
  {
    "id": "p384",
    "teamId": "mci",
    "name": "Donnarumma",
    "position": "GK"
  },
  {
    "id": "p407",
    "teamId": "mci",
    "name": "Echeverri",
    "position": "MID"
  },
  {
    "id": "p398",
    "teamId": "mci",
    "name": "Foden",
    "position": "MID"
  },
  {
    "id": "p238",
    "teamId": "mci",
    "name": "Grealish",
    "position": "MID"
  },
  {
    "id": "p388",
    "teamId": "mci",
    "name": "Guéhi",
    "position": "DEF"
  },
  {
    "id": "p391",
    "teamId": "mci",
    "name": "Gvardiol",
    "position": "DEF"
  },
  {
    "id": "p411",
    "teamId": "mci",
    "name": "Haaland",
    "position": "FWD"
  },
  {
    "id": "p393",
    "teamId": "mci",
    "name": "Khusanov",
    "position": "DEF"
  },
  {
    "id": "p406",
    "teamId": "mci",
    "name": "Kovačić",
    "position": "MID"
  },
  {
    "id": "p395",
    "teamId": "mci",
    "name": "Lewis",
    "position": "DEF"
  },
  {
    "id": "p401",
    "teamId": "mci",
    "name": "Marmoush",
    "position": "FWD"
  },
  {
    "id": "p389",
    "teamId": "mci",
    "name": "Matheus N.",
    "position": "DEF"
  },
  {
    "id": "p410",
    "teamId": "mci",
    "name": "Monga",
    "position": "MID"
  },
  {
    "id": "p409",
    "teamId": "mci",
    "name": "Mukasa",
    "position": "MID"
  },
  {
    "id": "p405",
    "teamId": "mci",
    "name": "N.Gonzalez",
    "position": "MID"
  },
  {
    "id": "p387",
    "teamId": "mci",
    "name": "O'Reilly",
    "position": "DEF"
  },
  {
    "id": "p408",
    "teamId": "mci",
    "name": "Phillips",
    "position": "MID"
  },
  {
    "id": "p404",
    "teamId": "mci",
    "name": "Reijnders",
    "position": "MID"
  },
  {
    "id": "p402",
    "teamId": "mci",
    "name": "Rodrigo",
    "position": "MID"
  },
  {
    "id": "p390",
    "teamId": "mci",
    "name": "Rúben",
    "position": "DEF"
  },
  {
    "id": "p403",
    "teamId": "mci",
    "name": "Savinho",
    "position": "MID"
  },
  {
    "id": "p397",
    "teamId": "mci",
    "name": "Semenyo",
    "position": "MID"
  },
  {
    "id": "p396",
    "teamId": "mci",
    "name": "Vitor Reis",
    "position": "DEF"
  },
  {
    "id": "p431",
    "teamId": "mun",
    "name": "Amad",
    "position": "MID"
  },
  {
    "id": "p424",
    "teamId": "mun",
    "name": "Amass",
    "position": "DEF"
  },
  {
    "id": "p162",
    "teamId": "mun",
    "name": "Andrey Santos",
    "position": "MID"
  },
  {
    "id": "p426",
    "teamId": "mun",
    "name": "B.Fernandes",
    "position": "MID"
  },
  {
    "id": "p413",
    "teamId": "mun",
    "name": "Bayindir",
    "position": "GK"
  },
  {
    "id": "p437",
    "teamId": "mun",
    "name": "Bendito Mantato",
    "position": "MID"
  },
  {
    "id": "p436",
    "teamId": "mun",
    "name": "Collyer",
    "position": "MID"
  },
  {
    "id": "p428",
    "teamId": "mun",
    "name": "Cunha",
    "position": "MID"
  },
  {
    "id": "p417",
    "teamId": "mun",
    "name": "Dalot",
    "position": "DEF"
  },
  {
    "id": "p325",
    "teamId": "mun",
    "name": "Darlow",
    "position": "GK"
  },
  {
    "id": "p416",
    "teamId": "mun",
    "name": "De Ligt",
    "position": "DEF"
  },
  {
    "id": "p415",
    "teamId": "mun",
    "name": "Dorgu",
    "position": "MID"
  },
  {
    "id": "p438",
    "teamId": "mun",
    "name": "Fletcher",
    "position": "MID"
  },
  {
    "id": "p425",
    "teamId": "mun",
    "name": "Fredricson",
    "position": "DEF"
  },
  {
    "id": "p414",
    "teamId": "mun",
    "name": "Heaton",
    "position": "GK"
  },
  {
    "id": "p421",
    "teamId": "mun",
    "name": "Heaven",
    "position": "DEF"
  },
  {
    "id": "p434",
    "teamId": "mun",
    "name": "J.Fletcher",
    "position": "MID"
  },
  {
    "id": "p435",
    "teamId": "mun",
    "name": "Lacey",
    "position": "MID"
  },
  {
    "id": "p412",
    "teamId": "mun",
    "name": "Lammens",
    "position": "GK"
  },
  {
    "id": "p418",
    "teamId": "mun",
    "name": "Maguire",
    "position": "DEF"
  },
  {
    "id": "p432",
    "teamId": "mun",
    "name": "Mainoo",
    "position": "MID"
  },
  {
    "id": "p419",
    "teamId": "mun",
    "name": "Martinez",
    "position": "DEF"
  },
  {
    "id": "p422",
    "teamId": "mun",
    "name": "Mazraoui",
    "position": "DEF"
  },
  {
    "id": "p427",
    "teamId": "mun",
    "name": "Mbeumo",
    "position": "MID"
  },
  {
    "id": "p430",
    "teamId": "mun",
    "name": "Mount",
    "position": "MID"
  },
  {
    "id": "p441",
    "teamId": "mun",
    "name": "Obi",
    "position": "FWD"
  },
  {
    "id": "p429",
    "teamId": "mun",
    "name": "Rashford",
    "position": "MID"
  },
  {
    "id": "p439",
    "teamId": "mun",
    "name": "Šeško",
    "position": "FWD"
  },
  {
    "id": "p423",
    "teamId": "mun",
    "name": "Shaw",
    "position": "DEF"
  },
  {
    "id": "p43",
    "teamId": "mun",
    "name": "Tielemans",
    "position": "MID"
  },
  {
    "id": "p433",
    "teamId": "mun",
    "name": "Ugarte",
    "position": "MID"
  },
  {
    "id": "p420",
    "teamId": "mun",
    "name": "Yoro",
    "position": "DEF"
  },
  {
    "id": "p440",
    "teamId": "mun",
    "name": "Zirkzee",
    "position": "FWD"
  },
  {
    "id": "p451",
    "teamId": "new",
    "name": "A.Murphy",
    "position": "DEF"
  },
  {
    "id": "p559",
    "teamId": "new",
    "name": "Bamba",
    "position": "MID"
  },
  {
    "id": "p453",
    "teamId": "new",
    "name": "Barnes",
    "position": "MID"
  },
  {
    "id": "p447",
    "teamId": "new",
    "name": "Botman",
    "position": "DEF"
  },
  {
    "id": "p448",
    "teamId": "new",
    "name": "Burn",
    "position": "DEF"
  },
  {
    "id": "p454",
    "teamId": "new",
    "name": "Elanga",
    "position": "MID"
  },
  {
    "id": "p443",
    "teamId": "new",
    "name": "Gillespie",
    "position": "GK"
  },
  {
    "id": "p449",
    "teamId": "new",
    "name": "Hall",
    "position": "DEF"
  },
  {
    "id": "p567",
    "teamId": "new",
    "name": "Horníček",
    "position": "GK"
  },
  {
    "id": "p457",
    "teamId": "new",
    "name": "J.Murphy",
    "position": "MID"
  },
  {
    "id": "p456",
    "teamId": "new",
    "name": "J.Ramsey",
    "position": "MID"
  },
  {
    "id": "p444",
    "teamId": "new",
    "name": "Jaouen",
    "position": "GK"
  },
  {
    "id": "p458",
    "teamId": "new",
    "name": "Joelinton",
    "position": "MID"
  },
  {
    "id": "p459",
    "teamId": "new",
    "name": "L.Miley",
    "position": "MID"
  },
  {
    "id": "p450",
    "teamId": "new",
    "name": "Livramento",
    "position": "DEF"
  },
  {
    "id": "p466",
    "teamId": "new",
    "name": "Neave",
    "position": "FWD"
  },
  {
    "id": "p465",
    "teamId": "new",
    "name": "Osula",
    "position": "FWD"
  },
  {
    "id": "p442",
    "teamId": "new",
    "name": "Pope",
    "position": "GK"
  },
  {
    "id": "p446",
    "teamId": "new",
    "name": "Schär",
    "position": "DEF"
  },
  {
    "id": "p462",
    "teamId": "new",
    "name": "Steur",
    "position": "MID"
  },
  {
    "id": "p445",
    "teamId": "new",
    "name": "Thiaw",
    "position": "DEF"
  },
  {
    "id": "p461",
    "teamId": "new",
    "name": "Touré",
    "position": "MID"
  },
  {
    "id": "p460",
    "teamId": "new",
    "name": "Willock",
    "position": "MID"
  },
  {
    "id": "p464",
    "teamId": "new",
    "name": "Wissa",
    "position": "FWD"
  },
  {
    "id": "p463",
    "teamId": "new",
    "name": "Woltemade",
    "position": "FWD"
  },
  {
    "id": "p477",
    "teamId": "nfo",
    "name": "Abbott",
    "position": "DEF"
  },
  {
    "id": "p473",
    "teamId": "nfo",
    "name": "Aina",
    "position": "DEF"
  },
  {
    "id": "p492",
    "teamId": "nfo",
    "name": "Awoniyi",
    "position": "FWD"
  },
  {
    "id": "p485",
    "teamId": "nfo",
    "name": "Bakwa",
    "position": "MID"
  },
  {
    "id": "p479",
    "teamId": "nfo",
    "name": "Bindon",
    "position": "DEF"
  },
  {
    "id": "p581",
    "teamId": "nfo",
    "name": "Diomande",
    "position": "DEF"
  },
  {
    "id": "p487",
    "teamId": "nfo",
    "name": "Dominguez",
    "position": "MID"
  },
  {
    "id": "p480",
    "teamId": "nfo",
    "name": "Gibbs-White",
    "position": "MID"
  },
  {
    "id": "p482",
    "teamId": "nfo",
    "name": "Hudson-Odoi",
    "position": "MID"
  },
  {
    "id": "p484",
    "teamId": "nfo",
    "name": "Hutchinson",
    "position": "MID"
  },
  {
    "id": "p491",
    "teamId": "nfo",
    "name": "Igor Jesus",
    "position": "FWD"
  },
  {
    "id": "p474",
    "teamId": "nfo",
    "name": "Jair Cunha",
    "position": "DEF"
  },
  {
    "id": "p468",
    "teamId": "nfo",
    "name": "John",
    "position": "GK"
  },
  {
    "id": "p493",
    "teamId": "nfo",
    "name": "Kalimuendo",
    "position": "FWD"
  },
  {
    "id": "p486",
    "teamId": "nfo",
    "name": "McAtee",
    "position": "MID"
  },
  {
    "id": "p471",
    "teamId": "nfo",
    "name": "Milenković",
    "position": "DEF"
  },
  {
    "id": "p470",
    "teamId": "nfo",
    "name": "Morato",
    "position": "DEF"
  },
  {
    "id": "p472",
    "teamId": "nfo",
    "name": "Murillo",
    "position": "DEF"
  },
  {
    "id": "p469",
    "teamId": "nfo",
    "name": "N.Williams",
    "position": "DEF"
  },
  {
    "id": "p483",
    "teamId": "nfo",
    "name": "Ndoye",
    "position": "MID"
  },
  {
    "id": "p478",
    "teamId": "nfo",
    "name": "Netz",
    "position": "DEF"
  },
  {
    "id": "p476",
    "teamId": "nfo",
    "name": "O.Richards",
    "position": "DEF"
  },
  {
    "id": "p488",
    "teamId": "nfo",
    "name": "Sangaré",
    "position": "MID"
  },
  {
    "id": "p475",
    "teamId": "nfo",
    "name": "Savona",
    "position": "DEF"
  },
  {
    "id": "p558",
    "teamId": "nfo",
    "name": "Schlager",
    "position": "MID"
  },
  {
    "id": "p467",
    "teamId": "nfo",
    "name": "Sels",
    "position": "GK"
  },
  {
    "id": "p490",
    "teamId": "nfo",
    "name": "Wood",
    "position": "FWD"
  },
  {
    "id": "p489",
    "teamId": "nfo",
    "name": "Yates",
    "position": "MID"
  },
  {
    "id": "p546",
    "teamId": "sun",
    "name": "Adingra",
    "position": "MID"
  },
  {
    "id": "p535",
    "teamId": "sun",
    "name": "Alderete",
    "position": "DEF"
  },
  {
    "id": "p551",
    "teamId": "sun",
    "name": "Angulo",
    "position": "MID"
  },
  {
    "id": "p532",
    "teamId": "sun",
    "name": "Ballard",
    "position": "DEF"
  },
  {
    "id": "p552",
    "teamId": "sun",
    "name": "Brobbey",
    "position": "FWD"
  },
  {
    "id": "p543",
    "teamId": "sun",
    "name": "Diarra",
    "position": "MID"
  },
  {
    "id": "p542",
    "teamId": "sun",
    "name": "E.Le Fée",
    "position": "MID"
  },
  {
    "id": "p531",
    "teamId": "sun",
    "name": "Ellborg",
    "position": "GK"
  },
  {
    "id": "p538",
    "teamId": "sun",
    "name": "Hjelde",
    "position": "DEF"
  },
  {
    "id": "p534",
    "teamId": "sun",
    "name": "Hume",
    "position": "DEF"
  },
  {
    "id": "p553",
    "teamId": "sun",
    "name": "Isidor",
    "position": "FWD"
  },
  {
    "id": "p550",
    "teamId": "sun",
    "name": "Jocelin.T",
    "position": "MID"
  },
  {
    "id": "p540",
    "teamId": "sun",
    "name": "Masuaku",
    "position": "DEF"
  },
  {
    "id": "p541",
    "teamId": "sun",
    "name": "Meunier",
    "position": "DEF"
  },
  {
    "id": "p533",
    "teamId": "sun",
    "name": "Mukiele",
    "position": "DEF"
  },
  {
    "id": "p547",
    "teamId": "sun",
    "name": "Mundle",
    "position": "MID"
  },
  {
    "id": "p539",
    "teamId": "sun",
    "name": "O'Nien",
    "position": "DEF"
  },
  {
    "id": "p530",
    "teamId": "sun",
    "name": "Patterson",
    "position": "GK"
  },
  {
    "id": "p536",
    "teamId": "sun",
    "name": "Reinildo",
    "position": "DEF"
  },
  {
    "id": "p548",
    "teamId": "sun",
    "name": "Rigg",
    "position": "MID"
  },
  {
    "id": "p529",
    "teamId": "sun",
    "name": "Roefs",
    "position": "GK"
  },
  {
    "id": "p545",
    "teamId": "sun",
    "name": "Sadiki",
    "position": "MID"
  },
  {
    "id": "p537",
    "teamId": "sun",
    "name": "Seelt",
    "position": "DEF"
  },
  {
    "id": "p549",
    "teamId": "sun",
    "name": "Talbi",
    "position": "MID"
  },
  {
    "id": "p544",
    "teamId": "sun",
    "name": "Xhaka",
    "position": "MID"
  },
  {
    "id": "p495",
    "teamId": "tot",
    "name": "Austin",
    "position": "GK"
  },
  {
    "id": "p516",
    "teamId": "tot",
    "name": "Bentancur",
    "position": "MID"
  },
  {
    "id": "p520",
    "teamId": "tot",
    "name": "Bergvall",
    "position": "MID"
  },
  {
    "id": "p509",
    "teamId": "tot",
    "name": "Byfield",
    "position": "DEF"
  },
  {
    "id": "p501",
    "teamId": "tot",
    "name": "Danso",
    "position": "DEF"
  },
  {
    "id": "p508",
    "teamId": "tot",
    "name": "Davies",
    "position": "DEF"
  },
  {
    "id": "p497",
    "teamId": "tot",
    "name": "Dubravka",
    "position": "GK"
  },
  {
    "id": "p525",
    "teamId": "tot",
    "name": "Fernandes",
    "position": "MID"
  },
  {
    "id": "p519",
    "teamId": "tot",
    "name": "Gallagher",
    "position": "MID"
  },
  {
    "id": "p522",
    "teamId": "tot",
    "name": "Gray",
    "position": "MID"
  },
  {
    "id": "p496",
    "teamId": "tot",
    "name": "Kinsky",
    "position": "GK"
  },
  {
    "id": "p512",
    "teamId": "tot",
    "name": "Kudus",
    "position": "MID"
  },
  {
    "id": "p521",
    "teamId": "tot",
    "name": "Kulusevski",
    "position": "MID"
  },
  {
    "id": "p515",
    "teamId": "tot",
    "name": "Maddison",
    "position": "MID"
  },
  {
    "id": "p523",
    "teamId": "tot",
    "name": "Moore",
    "position": "MID"
  },
  {
    "id": "p517",
    "teamId": "tot",
    "name": "Odobert",
    "position": "MID"
  },
  {
    "id": "p524",
    "teamId": "tot",
    "name": "Olusesi",
    "position": "MID"
  },
  {
    "id": "p518",
    "teamId": "tot",
    "name": "P.M.Sarr",
    "position": "MID"
  },
  {
    "id": "p499",
    "teamId": "tot",
    "name": "Pedro Porro",
    "position": "DEF"
  },
  {
    "id": "p507",
    "teamId": "tot",
    "name": "Phillips",
    "position": "DEF"
  },
  {
    "id": "p527",
    "teamId": "tot",
    "name": "Richarlison",
    "position": "FWD"
  },
  {
    "id": "p502",
    "teamId": "tot",
    "name": "Robertson",
    "position": "DEF"
  },
  {
    "id": "p500",
    "teamId": "tot",
    "name": "Romero",
    "position": "DEF"
  },
  {
    "id": "p510",
    "teamId": "tot",
    "name": "Rowswell",
    "position": "DEF"
  },
  {
    "id": "p528",
    "teamId": "tot",
    "name": "Scarlett",
    "position": "FWD"
  },
  {
    "id": "p498",
    "teamId": "tot",
    "name": "Senesi",
    "position": "DEF"
  },
  {
    "id": "p526",
    "teamId": "tot",
    "name": "Solanke",
    "position": "FWD"
  },
  {
    "id": "p511",
    "teamId": "tot",
    "name": "Souza",
    "position": "DEF"
  },
  {
    "id": "p505",
    "teamId": "tot",
    "name": "Spence",
    "position": "DEF"
  },
  {
    "id": "p514",
    "teamId": "tot",
    "name": "Tel",
    "position": "MID"
  },
  {
    "id": "p455",
    "teamId": "tot",
    "name": "Tonali",
    "position": "MID"
  },
  {
    "id": "p506",
    "teamId": "tot",
    "name": "Udogie",
    "position": "DEF"
  },
  {
    "id": "p503",
    "teamId": "tot",
    "name": "Van de Ven",
    "position": "DEF"
  },
  {
    "id": "p112",
    "teamId": "tot",
    "name": "Van Hecke",
    "position": "DEF"
  },
  {
    "id": "p494",
    "teamId": "tot",
    "name": "Vicario",
    "position": "GK"
  },
  {
    "id": "p513",
    "teamId": "tot",
    "name": "Xavi",
    "position": "MID"
  }
];

// Every gameweek published so far, oldest first. `currentGameweek` (below) is
// always the last, still-open one — the rest are history (see /history).
export const gameweeks: Gameweek[] = [
  {
    "id": "gw1",
    "number": 1,
    "title": "Gameweek 1",
    "deadline": "2026-08-21T17:30:00Z",
    "status": "completed",
    "fixtureIds": [
      "f1",
      "f2",
      "f3",
      "f4",
      "f5"
    ]
  },
  {
    "id": "gw2",
    "number": 2,
    "title": "Gameweek 2",
    "deadline": "2026-08-28T17:30:00Z",
    "status": "open",
    "fixtureIds": [
      "f6",
      "f7",
      "f8",
      "f9",
      "f10"
    ]
  }
];

export const currentGameweek: Gameweek = gameweeks[gameweeks.length - 1];

export const fixtures: Fixture[] = [
  {
    "id": "f1",
    "externalId": 10,
    "gameweekId": "gw1",
    "homeTeamId": "ful",
    "awayTeamId": "che",
    "kickoff": "2026-08-24T19:00:00Z",
    "status": "scheduled",
    "homeScore": null,
    "awayScore": null,
    "potmPlayerId": null
  },
  {
    "id": "f2",
    "externalId": 9,
    "gameweekId": "gw1",
    "homeTeamId": "new",
    "awayTeamId": "liv",
    "kickoff": "2026-08-23T15:30:00Z",
    "status": "scheduled",
    "homeScore": null,
    "awayScore": null,
    "potmPlayerId": null
  },
  {
    "id": "f3",
    "externalId": 1,
    "gameweekId": "gw1",
    "homeTeamId": "ars",
    "awayTeamId": "cov",
    "kickoff": "2026-08-21T19:00:00Z",
    "status": "scheduled",
    "homeScore": null,
    "awayScore": null,
    "potmPlayerId": null
  },
  {
    "id": "f4",
    "externalId": 4,
    "gameweekId": "gw1",
    "homeTeamId": "hul",
    "awayTeamId": "mun",
    "kickoff": "2026-08-22T11:30:00Z",
    "status": "scheduled",
    "homeScore": null,
    "awayScore": null,
    "potmPlayerId": null
  },
  {
    "id": "f5",
    "externalId": 2,
    "gameweekId": "gw1",
    "homeTeamId": "bre",
    "awayTeamId": "tot",
    "kickoff": "2026-08-22T16:30:00Z",
    "status": "scheduled",
    "homeScore": null,
    "awayScore": null,
    "potmPlayerId": null
  },
  {
    "id": "f6",
    "externalId": 15,
    "gameweekId": "gw2",
    "homeTeamId": "tot",
    "awayTeamId": "new",
    "kickoff": "2026-08-29T16:30:00Z",
    "status": "scheduled",
    "homeScore": null,
    "awayScore": null,
    "potmPlayerId": null
  },
  {
    "id": "f7",
    "externalId": 14,
    "gameweekId": "gw2",
    "homeTeamId": "liv",
    "awayTeamId": "nfo",
    "kickoff": "2026-08-29T11:30:00Z",
    "status": "scheduled",
    "homeScore": null,
    "awayScore": null,
    "potmPlayerId": null
  },
  {
    "id": "f8",
    "externalId": 16,
    "gameweekId": "gw2",
    "homeTeamId": "che",
    "awayTeamId": "bha",
    "kickoff": "2026-08-30T13:00:00Z",
    "status": "scheduled",
    "homeScore": null,
    "awayScore": null,
    "potmPlayerId": null
  },
  {
    "id": "f9",
    "externalId": 20,
    "gameweekId": "gw2",
    "homeTeamId": "avl",
    "awayTeamId": "ars",
    "kickoff": "2026-08-31T19:00:00Z",
    "status": "scheduled",
    "homeScore": null,
    "awayScore": null,
    "potmPlayerId": null
  },
  {
    "id": "f10",
    "externalId": 11,
    "gameweekId": "gw2",
    "homeTeamId": "cry",
    "awayTeamId": "mci",
    "kickoff": "2026-08-28T19:00:00Z",
    "status": "scheduled",
    "homeScore": null,
    "awayScore": null,
    "potmPlayerId": null
  }
];

// ---- convenience lookups ---------------------------------------------------
export const teamById = (id: string) => teams.find((t) => t.id === id)!;
export const playerById = (id: string) => players.find((p) => p.id === id);
export const squadFor = (teamId: string) => players.filter((p) => p.teamId === teamId);
