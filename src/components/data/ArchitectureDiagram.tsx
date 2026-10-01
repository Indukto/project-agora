/**
 * The signal path, from sensor to screen.
 *
 * This is the diagram that carries most of the weight in a presentation, so it
 * is drawn as one vertical rail rather than a row of boxes: it stays readable
 * on a phone, it survives being printed, and the one non-obvious step — the
 * gateway does not forward anything, the network server does — can be pointed
 * at directly.
 */

const STAGES = [
  {
    title: "Sensorknoten",
    body: "MessTemperatur, Feuchte und Batteriestand, verpackt die Werte als Binärpayload. Sendet alle paar Minuten per LoRa im ISM-Band 868 MHz.",
    mark: "868 MHz",
  },
  {
    title: "Gateway an der Schule",
    body: "Empfängt alle Uplinks im Funkbereich, prüft die Integrität und leitet jeden Frame mit Zeitstempel, RSSI und SNR an den Netzwerkserver weiter. Es entscheidet nichts und speichert nichts.",
    mark: "→ Internet",
  },
  {
    title: "LoRaWAN-Netzwerkserver",
    body: "Entpackt die Payloads, verwaltet Zugangskontrollen und Rechte, dedupliziert Nachrichten und stellt die Daten per API und MQTT bereit.",
    mark: "Aloha",
  },
  {
    title: "Datenbank und Backend",
    body: "Legt Messwerte und Funkframes ab und beantwortet Anfragen der Website. Dieselben Indizes, dieselbe Einheit, dieselbe Zeitmarke wie beim Empfang.",
    mark: "Convex",
  },
  {
    title: "AGORA-Website",
    body: "Zeigt Live-Werte, Verlauf und Karte. Kein Messwert wird in der Oberfläche erzeugt — sie bekommt ausschließlich das, was oben angekommen ist.",
    mark: "Browser",
  },
];

export function ArchitectureDiagram() {
  return (
    <div className="relative">
      {/* The rail itself, behind every stage. */}
      <div
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[13px] w-px bg-border sm:left-[15px]"
      />

      <ol className="space-y-9">
        {STAGES.map((stage, i) => (
          <li key={stage.title} className="relative pl-11 sm:pl-12">
            <span
              aria-hidden="true"
              className="absolute top-1.5 left-0 flex size-7 items-center justify-center rounded-full border border-border bg-background font-display text-sm sm:size-8"
            >
              {i + 1}
            </span>

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="text-lg">{stage.title}</h3>
              <span className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                {stage.mark}
              </span>
            </div>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
              {stage.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
