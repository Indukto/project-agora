/**
 * Glossar — the terms the project keeps having to explain.
 *
 * Grouped by where a term shows up in the signal path, so a reader who has just
 * followed a measurement down the chain finds the word for the stage they are
 * looking at. Each entry says what the thing is in one line and then why it
 * matters here, because a definition that does not connect to the build is a
 * word list, not a glossary.
 */

export interface GlossaryTerm {
  term: string;
  short: string;
  detail: string;
}

export interface GlossaryGroup {
  title: string;
  terms: GlossaryTerm[];
}

export const GLOSSARY: GlossaryGroup[] = [
  {
    title: "Funk und Hardware",
    terms: [
      {
        term: "LoRa",
        short: "Long Range — das moduläre Funksystem von Semtech, nicht das Protokoll selbst.",
        detail:
          "Bestimmt Frequenz, Bandbreite, Sendeleistung und Empfangsempfindlichkeit. LoRaWAN ist die Netzwerkschicht, die darauf aufsetzt.",
      },
      {
        term: "LoRaWAN",
        short: "Das Netzwerkprotokoll über LoRa-Funk: Uplink, Downlink, ALOHA-Zugriff.",
        detail:
          "Kümmert sich um Adressen, Verschlüsselung und Wiederholungen. Endgeräte können nur senden, nicht zuhören — außer inRuhezuständen mit class A.",
      },
      {
        term: "Spreading Factor (SF)",
        short: "Wie oft ein Bit auf der Luftbahn gesendet wird.",
        detail:
          "Höher heißt robuster und weiter, aber langsamer und energiehungriger. Unsere Knoten laufen zwischen SF7 und SF11, je nachdem, wie weit sie vom Gateway weg sind.",
      },
      {
        term: "Bandbreite (BW)",
        short: "Breite des belegten Frequenzbereichs, meist 125 kHz.",
        detail:
          "Schmaler ist energiesparender, aber empfindlicher gegenüber Frequenzfehlern. Wir nutzen durchgehend 125 kHz.",
      },
      {
        term: "Payload",
        short: "Die eigentlichen Nutzdaten im Frame.",
        detail:
          "Bei LoRa sehr klein — typischerweise 6 bis 14 Byte pro Uplink, weil jedes Byte direkt Luftzeit kostet.",
      },
      {
        term: "Airtime",
        short: "Wie lange ein Frame den Kanal belegt.",
        detail:
          "Wächst quadratisch mit dem Spreading Factor. Der Sprung von SF7 auf SF11 verlängert die Sendezeit um etwa das Fünfzehnte.",
      },
      {
        term: "Duty Cycle",
        short: "Anteil der Sendetime am Gesamtzeitfenster.",
        detail:
          "In Europa für 868 MHz auf 1 % begrenzt. Deshalb senden unsere Knoten selten und dafür länger, statt häufig und kurz.",
      },
    ],
  },
  {
    title: "Empfang und Qualität",
    terms: [
      {
        term: "RSSI",
        short: "Empfangsstärke in dBm, gemessen am Gateway.",
        detail:
          "Negativ, weil dBm logarithmisch ist: −40 dBm ist sehr gut, −100 dBm grenzwertig, −120 dBm praktisch tot. Alle unsere Werte liegen zwischen etwa −60 und −100 dBm.",
      },
      {
        term: "SNR",
        short: "Signal-Rausch-Verhältnis in dB — wie weit das Signal über dem Rauschteppich liegt.",
        detail:
          "Anders als RSSI ist ein höherer Wert immer besser und im Gegensatz zu RSSI nicht ortsabhängig begrenzt.",
      },
      {
        term: "Link-Budget",
        short: "Rechnung, die zeigt, ob eine Verbindung überhaupt trägt.",
        detail:
          "Sendeleistung plus Antennengewinn minus Ausbreitungsdämpfung und Schatten. Unsere 14 dBm Sendeleistung sind die Obergrenze, nicht eine Wahl.",
      },
      {
        term: "Gateway",
        short: "Der Empfänger am Campus, der alle Frames weiterreicht.",
        detail:
          "Ein Gateway entscheidet nichts und speichert nichts. Es misst und leitet — das ist der Schritt, der in Präsentationen am häufigsten falsch dargestellt wird.",
      },
    ],
  },
  {
    title: "Netz und Daten",
    terms: [
      {
        term: "Uplink / Downlink",
        short: "Nach oben und nach unten.",
        detail:
          "Unsere Knoten senden ausschließlich Uplinks. Ein Downlink ist nur während der kurzen Receive-Fenster nach einem Uplink möglich.",
      },
      {
        term: "ALOHA",
        short: "Zufallszugriff: Jeder darf senden, wer zuerst kommt.",
        detail:
          "Kein Zeitplan, keine Zuteilung. Zwei Knoten, die gleichzeitig senden, kollidieren und beide gehen verloren — LoRaWAN wiederholt in dem Fall.",
      },
      {
        term: "Network Server",
        short: "Der Dienst, der Payloads entpackt und weiterreicht.",
        detail:
          "Er verwaltet auch Zugangsdaten und Verschlüsselung. The Things Stack und ChirpStack sind zwei verbreitete Implementierungen.",
      },
      {
        term: "Application Server",
        short: "Was hinter dem Netzwerkserver steht — bei uns die Datenbank.",
        detail:
          "Er entscheidet, was mit einem Uplink geschieht: speichern, aggregieren, weiterleiten.",
      },
      {
        term: "ISM-Band",
        short: "Frequenzband, das ohne Lizenz genutzt werden darf.",
        detail:
          "868 MHz in Europa. Lizenzfrei heißt aber nicht regelfrei: das Duty-Cycle-Limit gilt trotzdem.",
      },
    ],
  },
];
