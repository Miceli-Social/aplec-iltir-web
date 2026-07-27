import type { Metadata } from "next";
import { CookieSettingsButton } from "@/components/cookie-settings-button";

export const metadata: Metadata = { title: "Política de cookies" };

export default function CookiesPage() {
  return (
    <div className="inner-page cookie-policy">
      <header className="page-intro">
        <span className="eyebrow">Privacitat</span>
        <h1>Política de cookies</h1>
        <p>
          Aquesta política explica com el web de l’Aplec Iltiŕ utilitza cookies i tecnologies similars, i com pots controlar-ne l’ús.
        </p>
      </header>

      <div className="cookie-policy-content">
        <section>
          <h2>Què són les cookies i tecnologies similars?</h2>
          <p>
            Les cookies són petits fitxers que un web pot desar al navegador. Altres tecnologies, com l’emmagatzematge local, poden recordar informació sense utilitzar una cookie. En aquest web serveixen per mantenir funcions necessàries i, només amb permís, obtenir estadístiques i mostrar vídeos externs.
          </p>
        </section>

        <section>
          <h2>Per a què les utilitzem?</h2>
          <p>
            Utilitzem tecnologies necessàries per recordar la selecció de privacitat i gestionar la sessió de l’accés intern. Google Analytics 4 i els reproductors de YouTube romanen inactius fins que s’accepta la categoria corresponent.
          </p>
        </section>

        <section>
          <h2>Cookies i emmagatzematge necessaris</h2>
          <p>
            La clau <code>iltir_cookie_consent_v1</code> es desa a l’emmagatzematge local del navegador durant 12 mesos. És necessària per recordar si has acceptat o rebutjat les categories opcionals.
          </p>
          <p>
            L’accés intern utilitza la cookie tècnica <code>iltir_admin</code> per verificar una sessió administrativa autenticada. Dura 8 hores, és HttpOnly, té SameSite Strict i només s’envia a la ruta <code>/admin</code>.
          </p>
        </section>

        <section>
          <h2>Google Analytics 4</h2>
          <p>
            Si acceptes l’analítica, Google Analytics 4 pot establir <code>_ga</code> i <code>_ga_&lt;identificador&gt;</code> per diferenciar navegadors o sessions i elaborar estadístiques agregades d’ús. La durada predeterminada orientativa és de dos anys quan correspon, tot i que pot variar segons la configuració de Google. No activem senyals de Google ni personalització publicitària.
          </p>
        </section>

        <section>
          <h2>Contingut extern de YouTube</h2>
          <p>
            El reproductor no es connecta amb YouTube abans que acceptis el contingut extern. Quan l’acceptes, els vídeos es carreguen des del domini <code>youtube-nocookie.com</code>. També pots obrir cada vídeo directament a YouTube sense activar aquesta categoria dins del web.
          </p>
        </section>

        <section>
          <h2>Detall de les tecnologies</h2>
          <div className="cookie-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tecnologia o cookie</th>
                  <th>Proveïdor</th>
                  <th>Finalitat</th>
                  <th>Categoria</th>
                  <th>Durada orientativa</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>iltir_cookie_consent_v1</code></td>
                  <td>Aplec Iltiŕ</td>
                  <td>Desar i recordar les preferències de consentiment al navegador.</td>
                  <td>Necessària</td>
                  <td>12 mesos</td>
                </tr>
                <tr>
                  <td><code>iltir_admin</code></td>
                  <td>Aplec Iltiŕ</td>
                  <td>Verificar la sessió autenticada de l’accés intern.</td>
                  <td>Necessària</td>
                  <td>8 hores</td>
                </tr>
                <tr>
                  <td><code>_ga</code></td>
                  <td>Google Analytics</td>
                  <td>Diferenciar navegadors i obtenir estadístiques agregades.</td>
                  <td>Analítica</td>
                  <td>Fins a 2 anys</td>
                </tr>
                <tr>
                  <td><code>_ga_&lt;identificador&gt;</code></td>
                  <td>Google Analytics</td>
                  <td>Mantenir l’estat de la sessió i obtenir estadístiques agregades.</td>
                  <td>Analítica</td>
                  <td>Fins a 2 anys</td>
                </tr>
                <tr>
                  <td>Reproductor incrustat</td>
                  <td>YouTube (Google)</td>
                  <td>Mostrar els vídeos sol·licitats des de youtube-nocookie.com.</td>
                  <td>Contingut extern</td>
                  <td>Depèn de YouTube i del navegador</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Com gestionar la selecció</h2>
          <p>
            Pots acceptar-ho tot, rebutjar-ho tot o triar les categories de manera independent. Pots modificar la decisió en qualsevol moment amb el botó següent o amb «Configurar cookies» al peu de pàgina.
          </p>
          <CookieSettingsButton className="button button-primary" />
          <p>
            També pots eliminar cookies i dades de lloc des de la configuració de privacitat del navegador. Si elimines la preferència desada, el web tornarà a demanar-te una decisió.
          </p>
        </section>

        <section>
          <h2>Actualitzacions i contacte</h2>
          <p>
            Podem actualitzar aquesta política si canvien les tecnologies o el funcionament del web. Per a qualsevol consulta sobre el web de l’Aplec Iltiŕ, impulsat per Miceli Rural Coop, SCCL (Miceli Social), escriu a <a href="mailto:info@miceli.social">info@miceli.social</a>.
          </p>
          <p><strong>Darrera actualització: 27 de juliol de 2026</strong></p>
        </section>
      </div>
    </div>
  );
}
