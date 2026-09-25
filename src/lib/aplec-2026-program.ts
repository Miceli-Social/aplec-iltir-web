export type ProgramRegistration = {
  label: string;
  information: string;
  url?: string;
};

export type ProgramActivity = {
  time: string;
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
        title: "Concert · Konunpar, grup de versions",
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
        time: "24.00 h",
        title: "Txaranga Bufant Fort",
        location: "Punt d’inici a la Plaça Major",
      },
      {
        time: "01.00 h",
        title: "DJ Ivanolo",
        location: "Plaça Major",
      },
    ],
  },
  {
    id: "dissabte",
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
          "Concert · Wave Ensemble sobre plantes, amb Frances Bartlett",
        location: "Església de Sant Pere",
      },
      {
        time: "17.15 h",
        title: "Espectacle / concert infantil · Jordi Tonietti",
        location: "Era de l’Obra",
      },
      {
        time: "18.00 h",
        title: "Concert · Coral de Lladó",
        location: "Església de Sant Pere",
      },
      {
        time: "18.30 h",
        title: "Concert · Coral de Cabanelles",
        location: "Plaça de davant de l’Església",
      },
      {
        time: "19.00–20.00 h",
        title: "Concert · LaDinamo",
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
          "Taller-espectacle · Trementinaires · Companyia Tramuntana",
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
          "Taller de plantes aromàtiques i aromateràpia · Essències.cat",
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
    time: "19.30 h",
    title: "Jornada informativa d’habitatge",
    location: "Sindicat de Lladó",
  },
];