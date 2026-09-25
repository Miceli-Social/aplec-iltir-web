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
  activities: ProgramActivity[];
};

// Source: Programació 2026 Aplec Iltiŕ.xlsx, PROGRAMACIÓ GENERAL only.
// Public copy follows the editorial instructions; informational text is literal.
// Keep midnight and the late-night DJ after Friday evening.
export const volunteerRegistration: ProgramRegistration = {
  label: "Participa com a voluntari/ària",
  information: "Comparteix la teva disponibilitat al formulari de voluntariat.",
  url: "/aplecs/2026/voluntariat",
};

export const aplec2026Program: ProgramDay[] = [
  {
    id: "divendres",
    heading: "Divendres 16 d’octubre · Lladó",
    activities: [
      { time: "15.00 h", title: "Un territori abraçat pel Mont", location: "Plaça de la Col·legiata", moreInfo: "Parlem del patrimoni històric, cultural i natural d'uns pobles abraçats pel Mont. Amb Joaquim Tremoleda i fotografies del territori (pendent confirmar)" },
      { time: "16.30 h", title: "Repic de campanes “Goigs del Mont”", location: "Plaça de la Col·legiata", status: "(pendent confirmar)" },
      { time: "17.00 h", title: "Cerimònia d’obertura de l’Aplec Iltiŕ: Somnis Territorials", location: "Plaça de la Col·legiata", moreInfo: `els infants de l'escola de Lladó acompanyats de faràndula i música del territori presentaran els seus somnis territorials. Tot seguit, es farà un parlament d'obertura de l'aplec i el Collsacabra, territori que va acollir l'aplec d'enguany, farà una entrega simbòlica al territori.
Tot seguit, les alcaldies de Navata, Lladó i Cabanelles, acompanyades del Consell de Poble de Lladó i de Cabanelles i d'en Miquel Reverter faran una obertura de l'aplec i les companyes del Collsacabra que van acollir l'aplec l'any passat faran entrega del "relleu Iltiŕ".` },
      { time: "17.30 h", title: "Berenar popular i ballada a la plaça amb la companyia de la faràndula", location: "Plaça Major" },
      { time: "18.00 h", title: "És possible regenerar un territori a través de l’observació, el diàleg honest i una governança distribuïda multinivell?", location: "Plaça de la Col·legiata", moreInfo: `Espai de diàleg entre autoritats locals i supramunicipals, expertes i consells de poble sobre l'evolució democràtica com a clau pel desenvolupament local en un context de crisi global i polaritat local.
Amb les alcaldies i Consells de Poble del territori i municipis propers. Amb l'expertesa de Lara Torres, Anna Brunsó, Ousman Jangana, Ismael Peña i Oscar Gussinyer.` },
      { time: "20.00 h", title: "Torneig de Futbol ILTIŔ", location: "Camp de Futbol de Lladó", moreInfo: "Un torneig de futbol organitzat entre el CF Navata i la UE Lladó. Els beneficis es destinaran a la UE Lladó, en el marc dels seus 90 anys i les millores del seu camp." },
      { time: "20.00 h", title: "Mostra gastronòmica de Navata", location: "Navata", information: "A la Sala, en el Marc de la setmana cultural" },
      { time: "21.00 h", title: "Concert amb Konunpar", location: "Plaça Major", information: "grup de versions\nSi plou a la Sala" },
      { time: "22.00 h", title: "Botifarrada popular", location: "Plaça de la Col·legiata", moreInfo: "en el marc dels 90 anys de la UE Lladó. Els beneficis es destinaran a la millora de les instal·lacions del camp i del club." },
      { time: "22.00 h", title: "Concert amb No-Name", location: "Plaça Major", information: "Blues - Rock - Ska\nSi plou al Pavelló" },
      { time: "24.00 h", title: "Txaranga · Bufant Fort", location: "Plaça de la Col·legiata" },
      { time: "01.00 h", title: "DJ Ivanote", location: "Plaça de la Col·legiata", information: "Organitza Associació Arrels Lladonenques" },
    ],
  },
  {
    id: "dissabte",
    heading: "Dissabte 17 d’octubre · Navata",
    activities: [
      { time: "09.30 h", title: "Repic de campanes amb l’Albert Cuevas", location: "Església" },
      { time: "09.30 h", title: "Cap a un paisatge agroforestal resilient", location: "Plaça de la Vila", moreInfo: `Escoltar amb més profunditat el metabolisme del territori, la funció dels diversos agents que ens hi relacionem i els processos de producció i economia pot ser clau per augmentar la resiliència del lloc. En parlem?` },
      { time: "10.30 h", title: "Exposició sobre Poesia Cinètica, de Rafel Ortiz", location: "Sala 1 d’Octubre", moreInfo: "A l'espai 1 d'octubre de Navata. Pot incloure una presentació i/o xerrada o taller" },
      { time: "10.30 h", title: "Exposició sobre Poesia Cinètica amb Albert Cuevas", location: "espai públic de Lladó", moreInfo: "a l'espai públic de Lladó. Pot incloure una presentació i/o xerrada o taller" },
      { time: "11.00 h", title: "Futbol Navata. Presentació dels equips i la temporada", location: "Camp de Futbol" },
      { time: "11.00 h", title: "Somnis territorials", location: "Plaça Era de l’Obra", moreInfo: "Infants de l'Escola de Navata expliquen els seus desitjos pel poble presentant el graffiti que han fet, acompanyats de la faràndula i músics del territori i de l'AMPA." },
      { time: "11.30 h", title: "Què està funcionant per l’habitatge als pobles", location: "Plaça de la Vila", information: "Conversa oberta entre diversos alcaldes per compartir casos d’èxit i iniciatives." },
      { time: "12.00 h", title: "Taller de pintura amb música", location: "Plaça Era de l’Obra", information: "A càrrec de Lola Ventura" },
      { time: "12.30 h", title: "Concert amb Mini-Stress", location: "Plaça Era de l’Obra", information: "amb el repartori del cançoner de Navata-Lladó" },
      { time: "14.00 h", title: "Dinar", location: "Plaça Era de l’Obra", information: "a càrrec del Sindicat de Navata", status: "Pendent de confirmació." },
      { time: "16.00 h", title: "Futbol Navata. Primer partit del primer equip de Navata", location: "Camp de Futbol" },
      { time: "16.00 h", title: "Transició energètica des del territori", location: "Plaça de la Vila", moreInfo: `El Cercle de Transició Energètica treballa per entendre els consums locals, diversificar l'estratègia de producció energètica elèctrica (solar i eòlica), biogàs i biomassa, tenir la informació real i generar propostes. Durant la tarda ens presentarà allò amb què està treballant i com seguir teixint una proposta real des del lloc. Ens acompanyarà l'Oficina de Transició Energètica de l'Empordà i la comunitat energètica local Navata Sostenible.` },
      { time: "16.00 h", title: "Exposició sobre Poesia Cinètica, de Rafel Ortiz", location: "Sala 1 d’Octubre", moreInfo: "A l'espai 1 d'octubre de Navata. Pot incloure una presentació i/o xerrada o taller" },
      { time: "16.00 h", title: "Exposició sobre Poesia Cinètica amb Albert Cuevas", location: "espai públic de Lladó", moreInfo: "a l'espai públic de Lladó. Pot incloure una presentació i/o xerrada o taller" },
      { time: "16.30 h", title: "Joc-taller “Casa meva, el meu poble”", location: "davant de l’església", information: "Amb Esther Roca i Alícia Vázquez" },
      { time: "17.00–18.00 h", title: "Concert Wave Ensamble sobre plantes amb Frances Bartlett", location: "Església", information: "Projecció amb Can Miró" },
      { time: "17.15 h", title: "Espectacle / concert infantil amb Jordi Tonietti", location: "Plaça Era de l’Obra" },
      { time: "18.00 h", title: "Concert Coral Lladó", location: "Església" },
      { time: "18.30 h", title: "Concert Coral Cabanelles", location: "La Plaça" },
      { time: "19.00–20.00 h", title: "Concert amb LaDinamo", location: "Camp de Rugby, Navata", information: "Desplaçant-nos al camp de Rugby" },
      { time: "20.00 h", title: "Espectacle comunitari CANALLA", location: "Camp de Rugby, Navata" },
    ],
  },
  {
    id: "diumenge",
    heading: "Diumenge 18 d’octubre · Cabanelles",
    activities: [
      { time: "10.00 h", title: "Caminada popular sobre biodiversitat i plantes aromàtiques del territori", moreInfo: `Una proposta per explorar una altra manera de relacionar-nos amb el paisatge, les plantes i els llocs que habitem.

En petits grups, buscarem un espai dins de l’entorn natural on situar-nos. A partir d’un centrament individual, observarem el lloc, la planta i el paisatge que l’envolta. Mirarem, dibuixarem, escriurem, compartirem i crearem per posar en relació les diferents mirades.

La proposta combina aquesta experiència en entorn natural amb una sessió d’olfacció a partir d’olis essencials, observant què passa, què canvia i què apareix quan introduïm l’olor.

Cal portar calçat per caminar pel camp, barret o gorra, llibreta —millor sense pauta—, llapis, bolígraf o retolador.

Lloc de trobada: La Sala de Cabanelles.

La proposta està pensada com una experiència oberta, sense una resposta tancada: crear les condicions perquè alguna cosa pugui aparèixer i preguntar-nos què s’ha obert al final del recorregut.`, registration: {
  label: "Inscripció prèvia",
  information: "Cal inscripció prèvia online.",
  url: "/aplecs/2026/caminada",
} },
      { time: "11.00 h", title: "Taller-espectacle “Trementinaires”", location: "exterior de la Sala de Cabanelles", information: "amb la companyia Tramuntana" },
      { time: "11.00 h", title: "Territori, alimentació i salut", location: "Plaça del Poble", moreInfo: `Observar les interseccions entre consum, territori, pagesia, ramaderia, salut, distribució, coneixement i comunitat, alhora que escoltar els reptes i les propostes que ja estan sobre la taula és clau pel futur. Ens assentarem amb persones del territori i de fora per abordar aquesta qüestió.

Cercle Agroalimentari` },
      { time: "12.00 h", title: "Ofici Solemne", location: "Església", information: "amb la companyia del Bisbe" },
      { time: "13.00 h", title: "Concert de Jazz del grup d’Espinavesa/Cabanelles", location: "Plaça Major" },
      { time: "13.00 h", title: "Mostra i tast de productes locals", location: "Plaça del Poble", moreInfo: "amb diversos productors del territori i la presentació de la cooperativa de consum local La Fusteria" },
      { time: "14.30 h", title: "Dinar ILTIŔ", location: "Sala de Cabanelles", moreInfo: "Paella de mar i muntanya amb trompetes de la mort, aigua i vi, amb postres de Làctics Tramuntana, elaborada per Cuinats Siseta.", information: "Menú de paella de mar i muntanya i opció vegetariana, amb postres de Làctics Tramuntana. Preu previst: 15 € per persona — pendent de confirmació.", registration: {
        label: "Reserva el dinar",
        information: "Màxim 120 persones. Reserves fins al dissabte 17 d’octubre de 2026, sempre que quedin places. Venda física de tiquets a la Sala de Cabanelles. La reserva online queda pendent de pagament.",
        url: "/aplecs/2026/dinar",
      } },
      { time: "17.00 h", title: "Taller de circ", location: "exterior de la Sala de Cabanelles", information: "amb la companyia Tramuntana de Cabanelles" },
      { time: "17.00 h", title: "Taller de plantes aromàtiques i aromoteràpia", location: "exterior de la Sala de Cabanelles", information: "A càrrec d'Essències.cat" },
      { time: "19.00 h", title: "Cloenda", location: "Plaça del Poble" },
    ],
  },
];

// Outside the three main days and their 43 activities.
export const aplec2026OtherActivities = [
  { date: "8 d’octubre", time: "19.30 h", title: "Jornada informativa d’habitatge", location: "Sindicat de Lladó" },
];
