export function GovernanceExplainer() {
  return (
    <div className="governance-explainer">
      <div className="governance-loop">
        <article>
          <span>01 · Cada poble</span>
          <h3>Els Consells de Poble treballen des de la realitat local.</h3>
          <p>Comparteixen informació, segueixen qüestions concretes i obren grups de treball segons les necessitats del municipi.</p>
        </article>
        <div className="loop-arrow" aria-hidden="true">↔</div>
        <article>
          <span>02 · Quan és útil</span>
          <h3>Les sectorials connecten reptes compartits.</h3>
          <p>S’activen quan una qüestió supera un poble o quan treballar plegats aporta més coneixement, recursos i capacitat d’acció.</p>
        </article>
        <div className="loop-arrow" aria-hidden="true">↔</div>
        <article>
          <span>03 · Informació compartida</span>
          <h3>Tothom pot saber què està passant.</h3>
          <p>La informació circula entre grups i municipis perquè la gent pugui orientar-se, participar i prendre decisions amb més elements.</p>
        </article>
      </div>
      <aside className="governance-note">
        <strong>Utilitzem les estructures que calen quan calen.</strong>
        <p>
          Alguns processos neixen i avancen des del poble; d’altres demanen una mirada compartida entre municipis. La coordinació ajuda a fer circular la informació, connectar esforços i evitar que cada grup hagi de començar de zero.
        </p>
      </aside>
    </div>
  );
}
