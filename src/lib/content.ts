import type { CalendarEvent, Circle, Municipality } from "@/lib/types";

export const municipalities: Municipality[] = [
  {
    slug: "cabanelles",
    name: "Cabanelles",
    territory: "Consell de Poble",
    intro:
      "Un municipi de nuclis i paisatges diversos que construeix un espai estable per escoltar-se, coordinar-se i actuar.",
    councilFocus: [
      "Enfortir els vincles entre Cabanelles, Espinavessa, Queixàs, Vilademires i Sant Martí Sesserres",
      "Fer visible la diversitat territorial i prioritzar reptes compartits",
      "Connectar habitatge, vida comunitària i mirada bioregional",
    ],
  },
  {
    slug: "llado",
    name: "Lladó",
    territory: "Consell de Poble",
    intro:
      "Una estructura oberta per passar de conversar sobre el poble a organitzar-nos i coproduir respostes.",
    councilFocus: [
      "Fer accessibles els processos i la informació municipal",
      "Incorporar mirades i sensibilitats diverses al Consell de Poble",
      "Compartir recursos i aprenentatges amb els pobles veïns",
    ],
  },
  {
    slug: "navata",
    name: "Navata",
    territory: "Consell de Poble",
    intro:
      "Un espai que articula persones, entitats i projectes locals i els connecta amb la xarxa territorial d’Iltiŕ.",
    councilFocus: [
      "Obrir espais de deliberació i treball compartit",
      "Acompanyar els cercles locals de Coordinació, Cultura i Habitatge",
      "Construir més autonomia i resiliència comunitària",
    ],
  },
];

const coordinationCircle = (
  municipality: "cabanelles" | "llado" | "navata",
  municipalityName: string,
): Circle => ({
  slug: `${municipality}-coordinacio`,
  name: `Coordinació · ${municipalityName}`,
  shortName: "Coordinació",
  kind: "local",
  municipality,
  theme: "coordinacio",
  summary: `El cercle que cuida el funcionament del Consell de Poble de ${municipalityName}.`,
  purpose:
    "Connectar persones, cercles i institucions; preparar les trobades obertes i garantir que els acords es converteixin en passes concretes.",
  workingOn: [
    "Preparació i seguiment de les trobades obertes",
    "Connexió entre els cercles i el conjunt del Consell de Poble",
    "Mapa de persones, entitats, espais i complicitats",
  ],
  nextSteps: [
    "Ampliar la diversitat de persones implicades",
    "Ordenar els canals interns i el retorn públic",
    "Fer seguiment dels acords i les responsabilitats",
  ],
  documents: [],
  whatsappActive: false,
});

const localCircle = (
  municipality: "cabanelles" | "llado" | "navata",
  municipalityName: string,
  theme: "Cultura" | "Habitatge",
): Circle => {
  const themeSlug = theme === "Cultura" ? "cultura" : "habitatge";
  return {
    slug: `${municipality}-${themeSlug}`,
    name: `${theme} · ${municipalityName}`,
    shortName: theme,
    kind: "local",
    municipality,
    theme: themeSlug,
    summary:
      theme === "Cultura"
        ? `El cercle local que connecta les persones, pràctiques i espais culturals de ${municipalityName}.`
        : `El cercle local per entendre i afrontar col·lectivament les necessitats d’habitatge de ${municipalityName}.`,
    purpose:
      theme === "Cultura"
        ? "Fer que la cultura sigui una part accessible, compartida i arrelada de la vida del poble."
        : "Construir respostes locals que facin possible viure al municipi en condicions dignes i sostenibles.",
    workingOn:
      theme === "Cultura"
        ? [
            "Mapa d’agents, espais i iniciatives culturals",
            "Necessitats i oportunitats de programació compartida",
            "Connexió amb la Sectorial de Cultura de l’Aplec",
          ]
        : [
            "Diagnosi i Pla Local d’Habitatge",
            "Necessitats del veïnat i parc d’habitatge existent",
            "Connexió amb la Sectorial d’Habitatge de l’Aplec",
          ],
    nextSteps: [
      "Consolidar el grup impulsor",
      "Compartir la diagnosi amb el conjunt del poble",
      "Acordar les primeres accions assumibles",
    ],
    documents: [],
    whatsappActive: false,
    linkedCircleSlugs: [`sectorial-${themeSlug}`],
  };
};

const sectorial = (
  slug: string,
  name: string,
  summary: string,
  purpose: string,
  workingOn: string[],
  status: "actiu" | "emergent" = "actiu",
): Circle => ({
  slug: `sectorial-${slug}`,
  name: `Sectorial de ${name}`,
  shortName: name,
  kind: "sectorial",
  theme: slug,
  summary,
  purpose,
  workingOn,
  nextSteps: [
    "Identificar les persones, entitats i recursos relacionats amb el tema",
    "Definir una agenda compartida i assolible",
    "Preparar una aportació concreta a l’Aplec",
  ],
  documents: [],
  whatsappActive: false,
  linkedCircleSlugs:
    slug === "cultura"
      ? ["navata-cultura"]
      : slug === "habitatge"
        ? municipalities.map((municipality) => `${municipality.slug}-habitatge`)
        : [],
  status,
});

export const fallbackCircles: Circle[] = [
  ...municipalities.flatMap((municipality) => [
    coordinationCircle(municipality.slug, municipality.name),
    localCircle(municipality.slug, municipality.name, "Habitatge"),
    ...(municipality.slug === "navata"
      ? [localCircle(municipality.slug, municipality.name, "Cultura")]
      : []),
  ]),
  sectorial(
    "energia",
    "Energia",
    "Un espai per construir una transició energètica rural que protegeixi el paisatge, redueixi dependències i deixi capacitats reals al territori.",
    "Fer la transició energètica des del territori i amb el territori.",
    [
      "Defensa del territori davant models energètics extractius o decidits des de fora",
      "Auditoria energètica: consums, potencials, cobertes i necessitats reals",
      "Comunitats energètiques locals, fotovoltaica agregada i instal·ladors del territori",
      "Mobilitat compartida, canvi d’hàbits i economia local distribuïda",
    ],
  ),
  sectorial(
    "cultura",
    "Cultura",
    "Espai comú per connectar biodiversitat, memòria, creació cultural i joventut.",
    "Compartir recursos i propostes culturals respectant el ritme i les iniciatives de cada poble.",
    [
      "Divulgació de biodiversitat, botànica i memòria històrica",
      "Inclusió a través de la creació, la producció i el joc",
      "Aliances amb entitats, grups de biodiversitat i joves",
    ],
  ),
  sectorial(
    "comunicacio",
    "Comunicació",
    "La xarxa que explica què passa, connecta canals i fa transparent el procés de l’Aplec.",
    "Fer la governança comprensible, transparent i participable als tres pobles.",
    [
      "Estratègia comunicativa específica per a l’Aplec",
      "Canals interns, informació pública i possible canal compartit",
      "Relat territorial, imatge gràfica i grup de comunicats",
    ],
  ),
  sectorial(
    "esports",
    "Esports",
    "Àmbit emergent per coordinar pràctiques esportives accessibles i recursos compartits.",
    "Entendre l’esport com a salut, comunitat i relació amb el territori.",
    ["Mapa d’activitats i equipaments", "Propostes intermunicipals", "Accés per a totes les edats"],
    "emergent",
  ),
  sectorial(
    "habitatge",
    "Habitatge",
    "Espai territorial que connecta les diagnosis i els plans d’habitatge dels tres municipis.",
    "Compartir eines i construir respostes coordinades davant un repte que supera els límits municipals.",
    [
      "Plans locals d’habitatge i grups comunitaris",
      "Habitatge buit, lloguer, accés de joves i famílies i HUT",
      "Estratègies supramunicipals i aprenentatge compartit",
    ],
  ),
  sectorial(
    "territori",
    "Territori",
    "Àmbit emergent sobre paisatge, mobilitat, alimentació, aigua i usos del sòl.",
    "Tenir cura de les condicions ecològiques que sostenen la vida dels pobles.",
    ["Lectura bioregional", "Mobilitat quotidiana", "Aigua, paisatge i sobirania alimentària"],
    "emergent",
  ),
];

const circleBySlug = (slug: string) =>
  fallbackCircles.find((circle) => circle.slug === slug);

const cabanellesHousing = circleBySlug("cabanelles-habitatge");
if (cabanellesHousing) {
  cabanellesHousing.summary =
    "Un espai polític, tècnic i comunitari per afrontar l’accés a l’habitatge en un municipi rural i dispers.";
  cabanellesHousing.purpose =
    "Fer possible que la gent jove i les persones arrelades al municipi s’hi puguin quedar, posant en ús habitatge existent sense perdre el caràcter rural de Cabanelles.";
  cabanellesHousing.workingOn = [
    "Anàlisi urbanística i demogràfica, habitatges buits i impacte dels HUT",
    "Cartografia dels nuclis, masies i zones que poden haver quedat desateses",
    "Divisió horitzontal, cohabitatge i oportunitats de lloguer social o juvenil",
    "Articulació amb Lladó i Navata per guanyar capacitat supramunicipal",
  ];
  cabanellesHousing.nextSteps = [
    "Posar en marxa el grup de treball polític, tècnic i comunitari",
    "Concretar la primera trobada pròpia del cercle d’habitatge",
    "Elaborar diagnosi, punts palanca i estratègies de resposta",
  ];
}

const energiaSectorial = circleBySlug("sectorial-energia");
if (energiaSectorial) {
  energiaSectorial.whatsappUrl = "https://chat.whatsapp.com/EQ9j4JfLkWZE9PociVmTDt";
  energiaSectorial.whatsappActive = true;
  energiaSectorial.documents = [
    {
      title: "Trobada 2 · Sectorial d’Energia",
      url: "/documents/sectorial-energia-2.pdf",
    },
    {
      title: "Totes les Actes de la Sectorial d’Energia",
      url: "https://docs.google.com/document/d/16JME5UhCQ6y0zZar1hab3Sqe-CCRvDRZ/edit",
    },
  ];
  energiaSectorial.nextSteps = [
    "Fer una fotografia rigorosa dels consums, potencials i opcions energètiques del territori",
    "Explicar millor les Comunitats Energètiques Locals i sumar més persones al cercle",
    "Prioritzar propostes assumibles: cobertes, compres agregades, mobilitat compartida i economia local",
  ];
}

const comunicacioSectorial = circleBySlug("sectorial-comunicacio");
if (comunicacioSectorial) {
  comunicacioSectorial.whatsappUrl = "https://chat.whatsapp.com/HUNDtS8Mn80AI0irO9hCmn";
  comunicacioSectorial.whatsappActive = true;
}

const habitatgeSectorial = circleBySlug("sectorial-habitatge");
if (habitatgeSectorial) {
  habitatgeSectorial.whatsappUrl = "https://chat.whatsapp.com/IK15KQvhOKKL11YMJsmarN";
  habitatgeSectorial.whatsappActive = true;
}

const esportsSectorial = circleBySlug("sectorial-esports");
if (esportsSectorial) {
  esportsSectorial.status = "actiu";
  esportsSectorial.whatsappUrl = "https://chat.whatsapp.com/DzMzD3q7Sm3Ky9Ppx8AweD";
  esportsSectorial.whatsappActive = true;
}

const territoriSectorial = circleBySlug("sectorial-territori");
if (territoriSectorial) {
  territoriSectorial.status = "actiu";
  territoriSectorial.whatsappActive = true;
}

const lladoHousing = circleBySlug("llado-habitatge");
if (lladoHousing) {
  lladoHousing.summary =
    "El cercle que construeix el Pla d’Actuació Municipal d’Habitatge amb ciutadania, equip tècnic i govern local.";
  lladoHousing.purpose =
    "Desplegar polítiques d’habitatge arrelades i viables, crear capacitat estratègica local i posar les bases d’un servei municipal d’habitatge.";
  lladoHousing.workingOn = [
    "PAMH: diagnosi, habitatge buit, lloguer, accés de joves i famílies i HUT",
    "Grup Arrel divers que connecti ciutadania, tècnics i govern municipal",
    "Cartografies dels barris i comunicació oberta amb el poble",
    "Dues trobades sectorials amb Navata i Cabanelles abans de l’Aplec",
  ];
  lladoHousing.nextSteps = [
    "Juny-setembre: anàlisi, primera reunió del Grup Arrel i cartografies",
    "Octubre-novembre: diagnosi compartida i selecció de patrons de resposta",
    "Desembre-gener: memòria final i retorn a la comunitat",
  ];
}

const lladoCoordination = circleBySlug("llado-coordinacio");
if (lladoCoordination) {
  lladoCoordination.documents = [
    {
      title: "Acta #1 - Consell de Poble de Lladó",
      url: "/documents/consell-poble-llado-1.pdf",
    },
    {
      title: "Totes les Actes del Consell de Poble de Lladó",
      url: "https://docs.google.com/document/d/1QGsWr-VpAZvZUJiK7RsfXBkTedxkQzKfkdRPdvg_MGc/edit?tab=t.0",
    },
  ];
}

const cabanellesCoordination = circleBySlug("cabanelles-coordinacio");
if (cabanellesCoordination) {
  cabanellesCoordination.documents = [
    {
      title: "Acta #2 - Consell de Poble de Cabanelles",
      url: "/documents/consell-poble-cabanelles-2.pdf",
    },
  ];
}

export const fallbackEvents: CalendarEvent[] = [
  {
    id: "sectorial-energia-2026-07-03-llado",
    title: "Trobada de la Sectorial d’Energia",
    start: "2026-07-03T18:00:00+02:00",
    location: "Sala Sant Joan de Lladó",
    description: "Trobada de treball de la sectorial d’energia.",
    tags: ["energia", "sectorial", "llado"],
    circleSlug: "sectorial-energia",
  },
  {
    id: "llado-coordinacio-30-juny",
    title: "Trobada oberta del cercle de Coordinació del Consell de Poble",
    start: "2026-06-30T19:30:00+02:00",
    location: "Lladó",
    tags: ["llado", "coordinacio"],
    circleSlug: "llado-coordinacio",
  },
  {
    id: "cabanelles-coordinacio-4-juliol",
    title: "Trobada oberta del cercle de Coordinació del Consell de Poble",
    start: "2026-07-04T12:00:00+02:00",
    location: "Cabanelles",
    tags: ["cabanelles", "coordinacio"],
    circleSlug: "cabanelles-coordinacio",
    allDay: true,
  },
  {
    id: "cabanelles-coordinacio-2026-07-15-espinavessa",
    title: "Tercera trobada del Consell de Poble de Cabanelles",
    start: "2026-07-15T19:00:00+02:00",
    location: "Local de l’Associació de Veïns i Veïnes d’Espinavessa",
    description:
      "Sessió per continuar la lectura del municipi i treballar les dimensions econòmica, d’habitatge i sociocultural.",
    tags: ["cabanelles", "coordinacio", "consell-de-poble"],
    circleSlug: "cabanelles-coordinacio",
  },
];

export const getMunicipality = (slug: string) =>
  municipalities.find((municipality) => municipality.slug === slug);
