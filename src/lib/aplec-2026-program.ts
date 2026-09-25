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
        time: "15.00 h",
        title: "Xerrada sobre un territori abraçat pel Mont",
        location: "Placeta del Priorat",
      },
      {
        time: "16.30 h",
        title: "Repic de campanes · Goigs del Mont",
        location: "Església Santa Maria de Lladó",
      },
      {
        time: "17.00 h",
        title:
          "Cerimònia d’obertura i Somnis Territorials amb els infants de l’Escola de Lladó",
        location: "Placeta del Priorat",
      },
      {
        time: "17.30 h",
        title:
          "Berenar popular i ballada amb la companyia de faràndules del territori",
        location: "Plaça Major",
      },
      {
        time: "18.00 h",
        title:
          "Espai de Diàleg · Com la governança comunitària pot revitalitzar tot un poble, amb el Teatre-Sindicat de Lladó, Consells de Poble i alcaldies que treballen en aquesta direcció",
        location: "Placeta del Priorat",
      },
      {
        time: "20.00 h",
        title: "Torneig de Futbol ILTIŔ",
        location: "Camp de futbol de Lladó",
      },
      {
        time: "20.00 h",
        title: 'Mostra de cuina “el meu plat estrella”',
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
        location: "Plaça Major",
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
        location: "Punt d’inici a la Plaça Major",
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
        title: "Diàleg · Cap a un paisatge agroforestal resilient",
        location: "Plaça de la Vila",
        moreInfo:
          "Escoltar amb més profunditat el metabolisme del territori, la funció dels diversos agents que ens hi relacionem i els processos de producció i economia pot ser clau per augmentar la resiliència del lloc. En parlem?",
      },
      {
        time: "10.30 h",
        title: "Exposició de Poesia Cinètica · Rafel Ortiz",
        moreInfo: "Una experiència immersiva on la poesia deixa de ser llenguatge literari i es converteix en fenomen físic.",
        location: "Sala 1 d’Octubre",
      },
      {
        time: "10.30 h",
        title: "Exposició · Albert Cuevas",
        location: "Can Miró/Sala QArts",
      },
      {
        time: "11.00 h",
        title:
          "Somnis Territorials amb el Consell d’Infants de l’Escola de Navata i els gegants",
        location: "Plaça de l’Era de l’Obra",
      },
      {
        time: "11.30 h",
        title:
          "Conversa amb casos inspiradors que estan responent al repte de l’habitatge als pobles",
        location: "Plaça de la Vila",
      },
      {
        time: "12.00 h",
        title: "Taller de pintura amb música · Lola Ventura",
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
        title: "Partit del primer equip de Navata",
        location: "Camp de futbol",
      },
      {
        time: "16.00 h",
        title: "Diàleg · Transició energètica des del territori",
        location: "Plaça de la Vila",
        moreInfo:
          "El Cercle de Transició Energètica treballa per entendre els consums locals, diversificar l’estratègia de producció energètica elèctrica (solar i eòlica), biogàs i biomassa, tenir la informació real i generar propostes. Durant la tarda ens presentarà allò amb què està treballant i com seguir teixint una proposta real des del lloc. Ens acompanyarà l’Oficina de Transició Energètica de l’Empordà i la comunitat energètica local Navata Sostenible.",
      },
      {
        time: "16.00 h",
        title: "Exposició de Poesia Cinètica · Rafel Ortiz",
        moreInfo: "Una experiència immersiva on la poesia deixa de ser llenguatge literari i es converteix en fenomen físic.",
        location: "Sala 1 d’Octubre",
      },
      {
        time: "16.00 h",
        title: "Exposició · Albert Cuevas",
        location: "Can Miró/Sala QArts",
      },
      {
        time: "16.30 h",
        title: 'Joc-taller “Casa meva el meu poble”',
        location: "Davant de l’Església",
      },
      {
        time: "17.00–18.00 h",
        title:
          "Somia'm verd / Dream Me Green · Wave Ensemble",
        moreInfo: "Concert ritual amb aromes. Cançons d'art de Frances Bartlett, violoncel i veu, Jordi Rallo percussió.",
        location: "Església de Sant Pere",
      },
      {
        time: "17.15 h",
        title: "Ara t'ho explico · Jordi Tonietti",
        moreInfo: "Amb música en directe, cançons originals, contes que fan volar la imaginació i molta participació. Els nostres espectacles són una festa pensada per a fer gaudir a tothom que tingui ganes de riure, cantar i passar-ho molt bé!",
        location: "Era de l’Obra",
      },
      {
        time: "18.00 h",
        title: "Concert · Coral de Lladó",
        moreInfo: "La Coral de Lladó és un espai de trobada a través del cant col·lectiu que fomenta els vincles comunitaris i manté viva la cultura musical del territori.",
        location: "Església de Sant Pere",
      },
      {
        time: "18.30 h",
        title: "Concert · Coral de Cabanelles",
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
        time: "10.00 h",
        title:
          "Caminada popular · Biodiversitat i plantes aromàtiques del territori",
        location: "Sortida de la Sala",
        moreInfo: `Una proposta per explorar una altra manera de relacionar-nos amb el paisatge, les plantes i els llocs que habitem.

En petits grups, buscarem un espai dins de l’entorn natural on situar-nos. A partir d’un centrament individual, observarem el lloc, la planta i el paisatge que l’envolta. Mirarem, dibuixarem, escriurem, compartirem i crearem per posar en relació les diferents mirades.

La proposta combina aquesta experiència en entorn natural amb una sessió d’olfacció a partir d’olis essencials, observant què passa, què canvia i què apareix quan introduïm l’olor.

Cal portar calçat per caminar pel camp, barret o gorra, llibreta —millor sense pauta—, llapis, bolígraf o retolador.

Lloc de trobada: La Sala de Cabanelles.

La proposta està pensada com una experiència oberta, sense una resposta tancada: crear les condicions perquè alguna cosa pugui aparèixer i preguntar-nos què s’ha obert al final del recorregut.`,
        registration: {
          label: "Inscripció prèvia",
          information: "Cal inscripció prèvia online.",
          url: "/aplecs/2026/caminada",
        },
      },
      {
        time: "11.00 h",
        title:
          "Històries d'una petita trementinaire · Companyia Tramuntana",
        moreInfo: "Espectacle sobre la apassionant i tendre història de les trementinaires. Dirigit a tots els públics.",
        location: "Exterior de la Sala",
      },
      {
        time: "11.00 h",
        title: "Diàleg · Territori, alimentació i salut",
        location: "Plaça del Poble",
        moreInfo:
          "Observar les interseccions entre consum, territori, pagesia, ramaderia, salut, distribució, coneixement i comunitat, alhora que escoltar els reptes i les propostes que ja estan sobre la taula és clau pel futur. Ens assentarem amb persones del territori i de fora per abordar aquesta qüestió.",
      },
      {
        time: "12.00 h",
        title: "Ofici Solemne",
        location: "Església de Santa Coloma",
      },
      {
        time: "13.00 h",
        title: "Concert de Jazz · Grup d’Espinavessa/Cabanelles",
        location: "Plaça Major",
      },
      {
        time: "13.00 h",
        title: "Mostra i tast de productes locals",
        location: "Plaça Major",
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
        location: "A la Sala",
      },
      {
        time: "17.00 h",
        title:
          "Geni del lloc, geni de la planta · Essències.cat",
        moreInfo: "Vols descobrir què entenem per geni del lloc i geni de la planta? T'oferim un espai per explorar-ho, experimentar-ho i trobar-hi la teva pròpia resposta.",
        location: "Exterior de la Sala",
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