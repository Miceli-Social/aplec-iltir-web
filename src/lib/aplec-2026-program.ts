export type ProgramRegistration = {
  label: string;
  information: string;
  url?: string;
};

export type ProgramActivity = {
  time: string;
  nextDay?: boolean;
  title: string;
  location?: string;
  information?: string;
  moreInfoLead?: string;
  moreInfo?: string;
  status?: string;
  registration?: ProgramRegistration;
};

export type ProgramDay = {
  id: string;
  heading: string;
  dateISO: string;
  municipality: string;
  note?: string;
  activities: ProgramActivity[];
};

export const volunteerRegistration: ProgramRegistration = {
  label: "Vols donar un cop de mà?",
  information:
    "Comparteix la teva disponibilitat i l’organització es posarà en contacte amb tu.",
  url: "/aplecs/2026/voluntariat",
};

export const aplec2026Program: ProgramDay[] = [
  {
    id: "divendres",
    dateISO: "2026-10-16",
    municipality: "Lladó",
    heading: "Divendres 16 d’octubre · Lladó",
    note:
      "En cas de pluja els concerts es faran al Teatre-Sindicat i els diàlegs a la sala Sant Joan.",
    activities: [
{
  time: "11.00–13.00 h",
  title: "Exposició de Poesia Cinètica · Rafel Ortiz",
  moreInfo:
    "Una experiència immersiva on la poesia deixa de ser llenguatge literari i es converteix en fenomen físic.",
  location: "Sala 1 d’Octubre",
},    
{
  time: "15.00 h",
  title: "Un territori abraçat per la Mare de Déu del Mont.",
  moreInfoLead: "T'has plantejat mai quina és la funció ecològica del lloc?",
  moreInfo:
    "Parlem del patrimoni històric, cultural i natural d'uns pobles abraçats pel Mont. Amb Joaquim Tremoleda, Arqueòleg i historiador de Lladó; i Joan Nogué, geògraf català i director de l'Observatori del Paisatge de Catalunya fins al 2017.",
  location: "Placeta del Priorat",
},      
{
  time: "16.30 h",
  title: "Repic de Campanes Goigs del Mont",
  moreInfo:
    "Inici de la cerimònia amb les campanes, el primer gran mitjà de comunicació de masses dels pobles. Un repic que honra la terra, les muntanyes i la seva gent.",
  location: "Església Santa Maria de Lladó",
},
     {
  time: "17.00 h",
  title: "Cerimònia d'Obertura de l'Aplec Iltiŕ",
  moreInfoLead: "Quin és el poder d'una cerimònia d'obertura?",
  moreInfo:
    "Infants de l'Escola de Lladó acompanyats per la faràndula dels municipis propers desitgen els seus bons auguris pel territori i la gent que hi viu presentant l'Skyline que han estat treballant. A més, hi haurà un espai de diàleg per honrar aquest moment, a càrrec de les alcaldies i la gent que hi viu presentant l'Skyline que han estat treballant. A més, hi haurà un espai de diàleg per honrar aquest moment, a càrrec de les alcaldies i els Consells de Poble del territori. També ens acompanyarà el Collsacabra, que va acollir l'aplec l'any passat i farà entrega del llegat ILTIŔ.",
  location: "Placeta del Priorat",
},
      {
        time: "17.30 h",
        title:
          "Berenar popular i ballada amb la companyia de faràndules del territori",
        location: "Plaça Major",
      },
{
  time: "18.00–21.00 h",
  title: "Exposició de Poesia Cinètica · Rafel Ortiz",
  moreInfo:
    "Una experiència immersiva on la poesia deixa de ser llenguatge literari i es converteix en fenomen físic.",
  location: "Sala 1 d’Octubre",
}, 
     {
  time: "18.00 h",
  title:
    "L'evolució democràtica als pobles. Experiències de cogestió comunitària i governança des del lloc.",
  moreInfoLead:
    "Quina forma pren una governança comunitària i territorial sincera, honesta i arrelada?",
  moreInfo:
    "Escoltarem allò que està viu al territori i les seves experiències amb l'objectiu d'aprendre dels encerts i els errors. Volem comprendre el següent pas d'evolució democràctia del territori, des de la participació i la corresponsabilitat, l'estima, el diàleg i les tensions reconciliades. Ens acompanyarà en Jordi Puig, del Teatre-Sindicat de Lladó, la Sala de Cabanelles, l'Aina Carbonell, regidora de participació de Navata, l'Ousman Jangana, regidor de participació de Santa Coloma de Farners, el Consell de Poble de Cabanelles, Lladó, Santa Pau i Sant Martí del Llèmena, xarxes de suport comunitari, secretàries municipals, jutges de pau, el projecte Simbiosi Fluvial i l'Ismael Peña-López, investigador i consultor en governança multiactor i multinivell.",
  location: "Placeta del Priorat",
},
      {
        time: "20.00 h",
        title: "Torneig de Futbol ILTIŔ",
        location: "Camp de futbol de Lladó",
      },
      {
        time: "20.00 h",
        title: "Mostra de cuina · El meu plat estrella",
        location: "Sala Sindicat de Navata",
      },
      {
        time: "21.00 h",
        title: "Könunpar",
        moreInfo: "Un bon concert no es mesura per la mida de l’escenari. Es mesura pel que passa entre la cançó i la gent.",
        location: "Plaça Major",
      },
      {
        time: "22.00 h",
        title: "Botifarrada popular",
        location: "Camp de futbol de Lladó",
      },
      {
        time: "22.00 h",
        title: "Concert · No-Name · Blues, Rock i Ska",
        location: "Plaça Major",
      },
      {
        time: "00.00 h",
        nextDay: true,
        title: "Txaranga Bufant Fort",
location: "Sortida del Camp de futbol de Lladó i recorregut pel poble fins a la Plaça Major",
      },
      {
        time: "Tot seguit",
        title: "DJ Ivanote",
        location: "Plaça Major",
      },
    ],
  },
  {
    id: "dissabte",
    dateISO: "2026-10-17",
    municipality: "Navata",
    heading: "Dissabte 17 d’octubre · Navata",
    note:
      "En cas de pluja els concerts i les xerrades es faran al Sindicat de Navata.",
    activities: [
      {
        time: "09.30 h",
        title: "Repic de campanes pel territori",
        location: "Església de Sant Pere",
      },
      {
  time: "09.30 h",
  title: "Cap a un paisatge agroforestal resilient.",
  moreInfoLead:
    "Què ens explica el paisatge quan observem les relacions que el configuren i quines propostes podrien emergir?",
  moreInfo:
    "Proposem escoltar amb més profunditat com funciona el metabolisme agroforestal del territori: quines relacions existeixen entre bosc, agricultura, ramaderia, aigua, economia i comunitat; quina funció desenvolupen els diferents agents; i quines cadenes de valor i formes de cooperació poden contribuir a recuperar un paisatge més resilient. El diàleg serà entre ramaders, propietaris, ADFs del territori i empreses expertes en gestió forestal i biomassa. El Consorci Salines Bassegoda i els Serveis Territorials de Boscos de la Generalitat de Catalunya, així com alcaldies de la zona portaran la veu de l'administració i algunes de les propostes que ja s'hi estan gestant, com la feina dels Pioneers of Our Time a la conca de la Muga. I ens acompanyaran veus expertes com l'Eduard Pla del CREAF i en Miquel Macias amb la mirada de Simbiosi Fluvial, des de la mirada de la biodiversitat i l'evolució dels ecosistemes forestals.",
  location: "Plaça de la Vila",
},
{
  time: "10.30–12.30 h",
  title: "Exposició Fibonacci i concert amb imatges immersives d’Albert Cuevas",
  moreInfo: "Música en directe i la matemàtica en la natura",
  location: "Can Miró/Sala QArts",
}, 
    {
  time: "11.00–13.00 h",
  title: "Exposició de Poesia Cinètica · Rafel Ortiz",
  moreInfo:
    "Una experiència immersiva on la poesia deixa de ser llenguatge literari i es converteix en fenomen físic.",
  location: "Sala 1 d’Octubre, Navata",
},
      {
  time: "11.00 h",
  title: "Somnis territorials",
  moreInfoLead:
    "Què es fa possible quan escoltem la mirada dels infants sobre el futur del territori?",
  moreInfo:
    "Infants del Consell d'Infants de Navata parlen dels seus somnis i desitjos de futur del municipi acompanyats de la faràndula del poble.",
  location: "Plaça de l’Era de l’Obra",
},
      {
  time: "11.30 h",
  title:
    "Respostes que estan emergint des de les ruralitats per respondre el repte de l'habitatge",
  moreInfoLead:
    "Què podem aprendre quan els municipis comparteixen allò que estan fent possible?",
  moreInfo:
    "Conversa oberta entre alcaldies per compartir experiències, aprendre les unes de les altres i inspirar noves possibilitats als nostres municipis alhora que ens preguntem, quin rol hi tenen els agents inmobiliàris, les constructores i promotores locals així com les propietàries, veïnes, llogateres i cooperativistes que vivim o volem arribar i viure al poble. Entre les experiències a compartir tenim el procés participatiu desenvolupat des de Lladó amb el jovent del poble i les alcaldies Oriol Balliu de la Pera i Mateu Sobregrau de Gallifa.",
  location: "Plaça de la Vila",
},
      {
  time: "12.00 h",
  title: "Pinta les teves sensacions",
  moreInfo:
    "Taller d'aquarel·les a càrrec de Lola Ventós i Quero.",
  location: "Plaça de l’Era de l’Obra",
},
      {
        time: "12.30 h",
        title: "Concert · Mini-Stress · Cançoner de Navata-Lladó",
        moreInfo: "Concert de cançons tradicionals del nostre país recollides a l’Alt Empordà.",
        location: "Plaça de l’Era de l’Obra",
      },
      {
        time: "14.00 h",
        title: "Dinar del Sindicat de Navata",
        location: "Plaça de l’Era de l’Obra",
      },
      {
        time: "15.00 h",
        title: "Presentació dels equips CF Navata",
        location: "Camp de futbol",
      },
            {
  time: "16.00 h",
  title: "Articulem la transició energètica des del territori.",
  moreInfoLead:
    "Què es fa possible quan articulem la transició energètica des del territori?",
  moreInfo:
    "El Cercle de Transició Energètica treballa per entendre els consums locals, diversificar l'estratègia de producció d'energia solar i eòlica, biogàs i biomassa, tenir la informació real i generar propostes. Durant la tarda ens presentarà allò amb què està treballant i com seguir teixint una proposta real des del lloc. Ens acompanyarà l'alcaldessa de Navata, l'Oficina de Transició Energètica de l'Empordà, la comunitat energètica local Navata Sostenible i la Universitat de Girona, i els veïns i veïnes que estan teixint i cocreant la proposta.",
  location: "Plaça de la Vila",
},
       {
  time: "16.30 h",
  title: "Joc-taller 'Casa meva, el meu poble'",
  moreInfo: "Amb Esther Roca i Alícia Vázquez",
  location: "Davant de l'església",
},
      {
        time: "17.00–18.00 h",
        title:
          "Somia'm verd / Dream Me Green · Wave Ensemble",
moreInfo: "Concert ritual amb aromes. Cançons d'art de Frances Bartlett, violoncel i veu, Jordi Rallo percussió. Es convida el públic a viure el concert amb calma i comoditat: podeu portar estores, màrfegues o coixins per seure o estirar-vos, així com llibreta i estris de dibuix si us ve de gust deixar-vos inspirar per l’experiència.",
        location: "Església de Sant Pere",
      },
      {
        time: "17.15 h",
        title: "Ara t'ho explico · Jordi Tonietti",
        moreInfo: "Amb música en directe, cançons originals, contes que fan volar la imaginació i molta participació. Els nostres espectacles són una festa pensada per a fer gaudir a tothom que tingui ganes de riure, cantar i passar-ho molt bé!",
        location: "Era de l’Obra",
      },
 {
  time: "18.00–21.00 h",
  title: "Exposició de Poesia Cinètica · Rafel Ortiz",
  moreInfo:
    "Una experiència immersiva on la poesia deixa de ser llenguatge literari i es converteix en fenomen físic.",
  location: "Sala 1 d’Octubre",
}, 
     {
        time: "18.00 h",
        title: "Concert · Coral de Lladó",
        moreInfo: "La Coral de Lladó és un espai de trobada a través del cant col·lectiu que fomenta els vincles comunitaris i manté viva la cultura musical del territori.",
        location: "Església de Sant Pere",
      },
      {
        time: "18.30 h",
        title: "Concert · Corral de Cabanelles",
        moreInfo: "La Corral Rural de Cabanelles som una Coral Reivindicativa, és un espai de trobada, és xarxa i comunitat que, des de la diversitat i la cura dels processos individuals i col·lectius, reivindica una societat més justa i digna. Cantem per portar els valors de la lluita al carrers, a les places i als cors.",
        location: "Plaça de davant de l’Església",
      },
      {
        time: "19.00–20.00 h",
        title: "Music on Cycles · LaDinamo",
        moreInfo: "LaDinamo és funk en moviment, és música en bicicletes. Una formació única de músics sobre rodes que trenca esquemes amb un concert itinerant d’alt voltatge i una festa de carrer trepidant a ritme de Funk.",
        location: "De l’Era de l’Obra al Camp de rugbi",
      },
      {
        time: "20.00 h",
        title: "Espectacle comunitari · CANALLA",
        location: "Camp de rugbi",
      },
    ],
  },
  {
    id: "diumenge",
    dateISO: "2026-10-18",
    municipality: "Cabanelles",
    heading: "Diumenge 18 d’octubre · Cabanelles",
    note:
      "En cas de pluja les activitats es desenvoluparan a la Sala de Cabanelles.",
    activities: [
      {
  time: "10.00–13.30 h",
  title:
    "Geni del lloc, geni de la planta · Mòdul 1: El lloc (caminada)",
  location: "La Sala de Cabanelles",
  moreInfo: `Vols descobrir què entenem per geni del lloc i geni de la planta?

Per respondre a aquesta pregunta, s’ofereix un espai d’exploració i creació compartida en petits grups per relacionar-se d’una altra manera amb el paisatge i les plantes, a partir de la percepció, l’experiència i la connexió amb l’entorn natural com a part activa del procés.

L’objectiu és explorar una altra manera de relacionar-nos amb les plantes i amb els llocs on viuen. No només volem saber coses sobre una planta, sinó entrar en relació amb ella i amb el seu entorn. Passar de preguntar-nos: Què sé d'aquesta planta? a preguntar-nos: Què puc descobrir d'aquesta planta si entro en relació amb ella? Què em revela el lloc sobre la planta? Què em revela la planta sobre el lloc?

No partim d'una resposta tancada, sinó que creem les condicions perquè alguna cosa pugui aparèixer.

Com ho farem?
El taller es desenvolupa en dues grans experiències:

1. El lloc (caminada al matí). 10h a 13:30h
En petits grups, buscarem un lloc dins de l'entorn natural on vulguem situar-nos.
Cada participant farà un centrament individual i, des d'aquí, observarà el lloc, la planta i el paisatge que l'envolta. Després:

mirarem → dibuixarem → escriurem → compartirem → crearem

El dibuix ens permet entrar en l'espai a través de la mirada.  L'escriptura pot ser una manera de descobrir, una possibilitat de deixar que l'espai es mostri mentre escrivim.  Després, el grup posarà en relació les diferents mirades i crearà una presentació breu del seu lloc per compartir-la amb la resta.

2. La planta i la seva olor (taller a la tarda). 16:30h a 18:00h
A la tarda treballarem amb les olors a partir d'un o més olis essencials.
Abans de començar, farem un centrament senzill: postura, contacte amb el terra i amb el seient, respiració i percepció de l'estat present. Després introduirem una única variable: l'olor

*Si no és possible participar en l'experiència completa, existeix també la possibilitat de fer un dels dos mòduls per separat.*

Que cal portar
Calçat per caminar pel camp, pantaló llar, barret o gorra pel sol.
Llibreta -millor sense pauta-, llapis, boligraf, retolador…

Lloc de trobada
La Sala de Cabanelles`,
  registration: {
    label: "Inscripció prèvia",
    information: "Cal inscripció prèvia online.",
    url: "/aplecs/2026/caminada",
  },
},
{
  time: "11.00–13.00 h",
  title: "Exposició de Poesia Cinètica · Rafel Ortiz",
  moreInfo:
    "Una experiència immersiva on la poesia deixa de ser llenguatge literari i es converteix en fenomen físic.",
  location: "Sala 1 d’Octubre",
},
      {
  time: "11.00 h",
  title:
    "Històries d'una petita trementinaire · Companyia Tramuntana",
  moreInfo:
    "Espectacle sobre la apassionant i tendre història de les trementinaires. Dirigit a tots els públics. A càrrec de la companyia Tramuntana.",
  location: "Plaça de l'església",
},
     {
  time: "11.00 h",
  title: "Territori, alimentació i salut (diàleg i tasts)",
  moreInfoLead:
    "Què descobrim quan observem l’alimentació com una relació entre territori i salut?",
  moreInfo:
    "Comprendre com funciona el sistema agroalimentari del territori a través de les relacions entre producció, transformació, distribució, consum, salut, coneixement i comunitat, identificant què ja existeix, quins són els principals reptes, que està emergint i quines possibilitats podrien néixer. El diàleg serà entre ramaders, pagesos i productors de la zona, la cooperativa de consum La Fusteria, el Parc Agrari de l'Empordà i el projecte de distribució català de Som Singulars.",
  location: "Plaça del Poble",
},
      {
        time: "12.00 h",
        title: "Ofici Solemne",
        location: "Església de Santa Coloma",
      },
      {
  time: "13.00 h",
  title: "Tastet de producte local amb jazz",
  moreInfo:
    "Teixir i donar a conèixer els productors de la zona. Ens acompanyarà Can Canari, horta ecològica de Cistella, els embotits d'en Pitiu, formatges amb la Marta de Can Cloella, formatge fresc amb Làctics Tramuntana, pa del forn Lleva't, oli de Can Clotas i vi de Mas Ballís.",
  location: "Plaça de l'Església",
},
      {
        time: "14.30 h",
        title: "Dinar de germanor ILTIŔ",
        location: "Sala de Cabanelles",
        moreInfo:
          "Paella de mar i muntanya amb trompetes de la mort, aigua i vi, amb postres de Làctics Tramuntana, elaborada per Cuinats Siseta.",
        information:
          "Menú de paella de mar i muntanya i opció vegetariana, amb postres de Làctics Tramuntana. Preu previst: 15 € per persona — pendent de confirmació.",
        registration: {
          label: "Reserva el dinar",
          information:
            "Màxim 120 persones. Reserves fins al dissabte 17 d’octubre de 2026, sempre que quedin places. Venda física de tiquets a la Sala de Cabanelles. La reserva online queda pendent de pagament.",
          url: "/aplecs/2026/dinar",
        },
      },
     {
  time: "17.00 h",
  title: "Taller de circ · Companyia Tramuntana",
  moreInfo:
    "Amb la companyia Tramuntana de Cabanelles. Vine a descobrir el circ aeri a la Sala de Cabanelles! Un espai per experimentar amb el moviment, l’equilibri i l’expressió corporal, jugar amb la gravetat i gaudir del circ en un ambient participatiu.",
  location: "A la Sala",
},
      {
  time: "16.30–18.00 h",
  title:
    "Geni del lloc, geni de la planta · Mòdul 2: La planta i la seva olor · Essències.cat",
  moreInfo: `Vols descobrir què entenem per geni del lloc i geni de la planta?

Per respondre a aquesta pregunta, s’ofereix un espai d’exploració i creació compartida en petits grups per relacionar-se d’una altra manera amb el paisatge i les plantes, a partir de la percepció, l’experiència i la connexió amb l’entorn natural com a part activa del procés.

L’objectiu és explorar una altra manera de relacionar-nos amb les plantes i amb els llocs on viuen. No només volem saber coses sobre una planta, sinó entrar en relació amb ella i amb el seu entorn. Passar de preguntar-nos: Què sé d'aquesta planta? a preguntar-nos: Què puc descobrir d'aquesta planta si entro en relació amb ella? Què em revela el lloc sobre la planta? Què em revela la planta sobre el lloc?

No partim d'una resposta tancada, sinó que creem les condicions perquè alguna cosa pugui aparèixer.

Com ho farem?
El taller es desenvolupa en dues grans experiències:

1. El lloc (caminada al matí). 10h a 13:30h
En petits grups, buscarem un lloc dins de l'entorn natural on vulguem situar-nos.
Cada participant farà un centrament individual i, des d'aquí, observarà el lloc, la planta i el paisatge que l'envolta. Després:

mirarem → dibuixarem → escriurem → compartirem → crearem

El dibuix ens permet entrar en l'espai a través de la mirada.  L'escriptura pot ser una manera de descobrir, una possibilitat de deixar que l'espai es mostri mentre escrivim.  Després, el grup posarà en relació les diferents mirades i crearà una presentació breu del seu lloc per compartir-la amb la resta.

2. La planta i la seva olor (taller a la tarda). 16:30h a 18:00h
A la tarda treballarem amb les olors a partir d'un o més olis essencials.
Abans de començar, farem un centrament senzill: postura, contacte amb el terra i amb el seient, respiració i percepció de l'estat present. Després introduirem una única variable: l'olor

*Si no és possible participar en l'experiència completa, existeix també la possibilitat de fer un dels dos mòduls per separat.*

Que cal portar
Calçat per caminar pel camp, pantaló llar, barret o gorra pel sol.
Llibreta -millor sense pauta-, llapis, boligraf, retolador…

Lloc de trobada
La Sala de Cabanelles`,
  location: "La Sala de Cabanelles",
},
{
  time: "18.00–21.00 h",
  title: "Exposició de Poesia Cinètica · Rafel Ortiz",
  moreInfo:
    "Una experiència immersiva on la poesia deixa de ser llenguatge literari i es converteix en fenomen físic.",
  location: "Sala 1 d’Octubre",
}, 
     {
        time: "19.00 h",
        title: "Cloenda",
        location: "A la Sala",
      },
    ],
  },
];

export const aplec2026OtherActivities = [
  {
    date: "8 d’octubre",
    dateISO: "2026-10-08",
    municipality: "Lladó",
    time: "19.30 h",
    title: "Jornada informativa d’habitatge",
    location: "Sindicat de Lladó",
  },
];