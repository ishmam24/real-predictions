// ============================================================================
// AUTO-GENERATED from the live FPL API by scripts/generate-pl-data.mjs
// Real current-season Premier League teams (with crests), squads, and the
// upcoming gameweek's fixtures (top 5 auto-picked by the prominence model).
// Regenerate with: node scripts/generate-pl-data.mjs
// This stands in for the database in the prototype; Supabase replaces it later.
// ============================================================================
import type { Team, Player, Fixture, Gameweek, LeaderboardRow } from "./types";

export const teams: Team[] = [
  {
    "id": "ars",
    "name": "Arsenal",
    "tla": "ARS",
    "color": "#EF0107",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t3.svg"
  },
  {
    "id": "avl",
    "name": "Aston Villa",
    "tla": "AVL",
    "color": "#95BFE5",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t7.svg"
  },
  {
    "id": "bou",
    "name": "Bournemouth",
    "tla": "BOU",
    "color": "#DA291C",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t91.svg"
  },
  {
    "id": "bre",
    "name": "Brentford",
    "tla": "BRE",
    "color": "#E30613",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t94.svg"
  },
  {
    "id": "bha",
    "name": "Brighton",
    "tla": "BHA",
    "color": "#0057B8",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t36.svg"
  },
  {
    "id": "che",
    "name": "Chelsea",
    "tla": "CHE",
    "color": "#034694",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t8.svg"
  },
  {
    "id": "cov",
    "name": "Coventry City",
    "tla": "COV",
    "color": "#59B7E4",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t9.svg"
  },
  {
    "id": "cry",
    "name": "Crystal Palace",
    "tla": "CRY",
    "color": "#1B458F",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t31.svg"
  },
  {
    "id": "eve",
    "name": "Everton",
    "tla": "EVE",
    "color": "#003399",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t11.svg"
  },
  {
    "id": "ful",
    "name": "Fulham",
    "tla": "FUL",
    "color": "#1a1a1a",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t54.svg"
  },
  {
    "id": "hul",
    "name": "Hull City",
    "tla": "HUL",
    "color": "#F5A12D",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t88.svg"
  },
  {
    "id": "ips",
    "name": "Ipswich Town",
    "tla": "IPS",
    "color": "#3A64A3",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t40.svg"
  },
  {
    "id": "lee",
    "name": "Leeds",
    "tla": "LEE",
    "color": "#1D428A",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t2.svg"
  },
  {
    "id": "liv",
    "name": "Liverpool",
    "tla": "LIV",
    "color": "#C8102E",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t14.svg"
  },
  {
    "id": "mci",
    "name": "Man City",
    "tla": "MCI",
    "color": "#6CABDD",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t43.svg"
  },
  {
    "id": "mun",
    "name": "Man Utd",
    "tla": "MUN",
    "color": "#DA291C",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t1.svg"
  },
  {
    "id": "new",
    "name": "Newcastle",
    "tla": "NEW",
    "color": "#241F20",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t4.svg"
  },
  {
    "id": "nfo",
    "name": "Nott'm Forest",
    "tla": "NFO",
    "color": "#DD0000",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t17.svg"
  },
  {
    "id": "tot",
    "name": "Spurs",
    "tla": "TOT",
    "color": "#132257",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t6.svg"
  },
  {
    "id": "sun",
    "name": "Sunderland",
    "tla": "SUN",
    "color": "#EB172B",
    "crestUrl": "https://resources.premierleague.com/premierleague/badges/rb/t56.svg"
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

export const currentGameweek: Gameweek = {
  "id": "gw1",
  "number": 1,
  "title": "Gameweek 1",
  "deadline": "2026-08-21T17:30:00Z",
  "status": "open",
  "fixtureIds": [
    "f1",
    "f2",
    "f3",
    "f4",
    "f5"
  ]
};

export const fixtures: Fixture[] = [
  {
    "id": "f1",
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
    "gameweekId": "gw1",
    "homeTeamId": "bre",
    "awayTeamId": "tot",
    "kickoff": "2026-08-22T16:30:00Z",
    "status": "scheduled",
    "homeScore": null,
    "awayScore": null,
    "potmPlayerId": null
  }
];

export const rivalRows: LeaderboardRow[] = [
  {
    "userId": "u_sam",
    "displayName": "Sam",
    "avatarEmoji": "🦊",
    "favouriteTeamId": "liv",
    "totalPoints": 41,
    "exactScores": 6,
    "rank": 0
  },
  {
    "userId": "u_priya",
    "displayName": "Priya",
    "avatarEmoji": "🐝",
    "favouriteTeamId": "ars",
    "totalPoints": 38,
    "exactScores": 5,
    "rank": 0
  },
  {
    "userId": "u_marco",
    "displayName": "Marco",
    "avatarEmoji": "🐺",
    "favouriteTeamId": "mci",
    "totalPoints": 33,
    "exactScores": 4,
    "rank": 0
  },
  {
    "userId": "u_kemi",
    "displayName": "Kemi",
    "avatarEmoji": "🦁",
    "favouriteTeamId": "che",
    "totalPoints": 29,
    "exactScores": 3,
    "rank": 0
  },
  {
    "userId": "u_dan",
    "displayName": "Dan",
    "avatarEmoji": "🐢",
    "favouriteTeamId": "tot",
    "totalPoints": 22,
    "exactScores": 2,
    "rank": 0
  }
];

// ---- convenience lookups ---------------------------------------------------
export const teamById = (id: string) => teams.find((t) => t.id === id)!;
export const playerById = (id: string) => players.find((p) => p.id === id);
export const squadFor = (teamId: string) => players.filter((p) => p.teamId === teamId);
export const fixtureById = (id: string) => fixtures.find((f) => f.id === id)!;
