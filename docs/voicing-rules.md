# Voicing-Regeln

Regeln, um zu prüfen, ob ein neues Voicing in `alternativeVoicings`
(`src/model/voicing.ts`) sinnvoll ist.

## Grundlagen

- Ein Voicing besteht aus Ton-Gruppen. Jede Gruppe liegt eine Oktave höher
  als die vorherige.
- Aktuell hat jedes Voicing genau **5 Töne** insgesamt.
- Eine Tension wird innerhalb ihrer Gruppe auf ihre einfache Stufe
  reduziert (`9`→`2`, `11`→`4`, `13`→`6`) und bekommt dann den
  Oktav-Zuschlag ihrer Gruppe dazu. Dadurch kann eine Tension tiefer
  klingen als erwartet, wenn man ihre Nachbartöne nicht mitbedenkt.

## Regeln

1. **Immer 5 Töne.** Ein Voicing muss über alle Gruppen zusammengezählt
   genau 5 Töne haben. Akkorde mit mehr als 5 Tönen werden vorher auf 5
   reduziert (die Quinte fällt weg). Stimmt die Anzahl nicht überein, kann
   beim Abspielen ein Ton des Akkords fehlen, ohne dass es auffällt.

2. **Kein zu großer Sprung.** Zwischen zwei benachbarten Tönen (der Höhe
   nach sortiert) sollte es maximal eine große Sexte (9 Halbtöne) sein.
   Ausnahme: der Grundton (`1`) zusammen mit der 7 (`7`) in der untersten
   Oktave (Oktave 1) — dieses klassische Guide-Tone-Paar darf den
   größeren Abstand haben.

3. **Nicht zu eng im Bass.** Die beiden tiefsten Töne eines Voicings
   sollten mindestens eine kleine Terz (3 Halbtöne) auseinanderliegen.
   Enger als das (z. B. nur ein Ganz- oder Halbtonabstand) klingt im
   Bassbereich matschig.

4. **Maximal 2 Oktaven Gesamtumfang.** Vom tiefsten bis zum höchsten Ton
   eines Voicings sollten es maximal 24 Halbtöne sein. Einzige Ausnahme:
   `[[1, 5], [9, 13], [3]]` (hoch isolierter Melodieton, bewusst so
   gewählt).

5. **Keine reine Grundstellung.** Ein Voicing darf nicht einfach der
   Akkord eng gestapelt in Grundposition sein (1-3-5 direkt übereinander,
   Tensions oben drauf) — das hört man eh, das ist keine echte
   Alternative. Die Töne müssen wirklich anders angeordnet werden, z. B.
   Grundton zusammen mit einer Tension unten, Terz/Quinte weiter oben.

6. **Sus-Akkorde extra prüfen.** Der Slot für die Terz (`3`) wird bei
   Sus-Akkorden automatisch zur Quart. Ein Voicing, das für normale
   Akkorde gedacht war, klingt bei Sus-Akkorden nicht automatisch gut —
   kurz gegenhören.

7. **Immer aufsteigend.** Die Töne müssen in der Reihenfolge, in der sie
   im Voicing stehen, tatsächlich aufsteigend klingen — kein Ton darf
   tiefer klingen als ein vorheriger. Im Zweifel mit
   `resolveVoicingOctaveIntervals` nachrechnen (siehe Grundlagen).

8. **Kein Halbtonschritt zwischen zwei Tönen.** Egal wo im Voicing:
   liegen zwei (aufgelöste) Töne nur einen Halbton auseinander, klingt
   das nach Fehlgriff, nicht nach Tension. Einzige Ausnahme: `9` neben
   `b3` (also bei Moll-Akkorden) — ausprobiert, klingt gut.

## Abdeckung

Das hier prüft nicht das einzelne Voicing, sondern die ganze Liste:

- **Jeder Akkord braucht mindestens 2 passende Voicings.** Sonst gibt es
  für diesen Akkord im Quiz nie eine echte Abwechslung.

## Bekannte Ausnahmen

- Halbverminderte Akkorde (Min7b5) und Moll-Maj7 sind komplett
  ausgeschlossen — noch nicht geprüft/freigegeben.
- Sus2 und Dim7 haben grundsätzlich keine Tensions und damit auch keine
  Voicings.

## Offene Lücken

- Nach dem Entfernen aller Regel-8-Verstöße haben folgende Akkorde nur
  noch 1 passendes Voicing: `7sus4(10)`, `7sus4(b9,10)`, `7sus4(9,10)`,
  `7sus4(10,13)`, `7(#9)`, `7(b9,#9)`.
- `Sus4 add(10,13)` hat wieder **kein** Voicing mehr und fällt dadurch
  automatisch aus dem "Alternative Voicings"-Set raus.

## Wie prüfen?

Es gibt (noch) kein fertiges Skript dafür. Am schnellsten: ein kurzes
`tsx`-Skript schreiben, das `resolveVoicingOctaveIntervals` für das neue
Voicing aufruft, die Halbtonabstände ausgibt und gegen Regel 2–4 und 7
prüft (für Regel 7 die Halbtöne in Array-Reihenfolge nehmen, nicht
sortieren, und schauen ob die Zahlen durchgehend steigen). Für Regel 1
reicht ein Blick aufs Voicing (5 Einträge zählen), für die Abdeckung ein
Blick, wie viele Einträge in `alternativeVoicings` den Akkord schon
abdecken.
