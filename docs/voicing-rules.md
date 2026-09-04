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

1. **Immer mit dem Grundton anfangen.** Der Grundton (`1`) muss in der
   untersten Oktave (Oktave 1) stehen — er ist der tiefste Ton. Sonst
   klingt ein anderer Ton wie der Bass, nicht der Grundton.

2. **Immer aufsteigend.** Die Töne müssen in der Reihenfolge, in der sie
   im Voicing stehen, tatsächlich aufsteigend klingen — kein Ton darf
   tiefer klingen als ein vorheriger.

3. **Immer 5 Töne.** Ein Voicing muss über alle Gruppen zusammengezählt
   genau 5 Töne haben. Akkorde mit mehr als 5 Tönen werden vorher auf 5
   reduziert (die Quinte fällt weg).

4. **Keine reine Grundstellung.** Der Akkordstamm (Grundton, Terz, Quinte,
   Septime — jeweils in der akkordeigenen Form, z. B. `1-b3-5-b7` bei
   Moll7) komplett in der ersten Oktave, mit den Tensions nur oben drauf,
   ist keine echte Alternative.
   Bei **Dominant-Akkorden** zählt schon `1-3-7` (ohne
   Quinte) als Akkordstamm.

5. **Kein zu großer Sprung.** Zwischen zwei benachbarten Tönen (der Höhe
   nach sortiert) sollte es maximal eine große Sexte (9 Halbtöne) sein.
   Ausnahme: der Grundton (`1`) zusammen mit der 7 (`7`) in der untersten
   Oktave (Oktave 1).

6. **Maximal 2 Oktaven Gesamtumfang.** Vom tiefsten bis zum höchsten Ton
   eines Voicings sollten es maximal 24 Halbtöne sein. Einzige Ausnahme:
   `[[1, 5], [9, 13], [3]]`.

7. **Kein Halbtonschritt zwischen zwei Tönen.** Egal wo im Voicing:
   liegen zwei (aufgelöste) Töne nur einen Halbton auseinander, klingt
   das nach Fehlgriff, nicht nach Tension. Einzige Ausnahme: `9` neben
   `b3` (also bei Moll-Akkorden).

8. **Nicht zu eng im Bass.** Die beiden tiefsten Töne eines Voicings
   sollten mindestens eine kleine Terz (3 Halbtöne) auseinanderliegen.
   Enger als das (z. B. nur ein Ganz- oder Halbtonabstand) klingt im
   Bassbereich matschig.

9. **Kein Tritonus zwischen Grundton und `#4`/`b5` in Oktave 1.** Nur der
   Abstand Grundton→Ton zählt, nicht beliebige Tonpaare — ein Tritonus
   zwischen `3` und `b7` bleibt erlaubt.

10. **Bei Sus-Akkorden: `10` nie vor der Quart.** Eine `10` muss über der
    Quart (`4`, aus Slot `3`) liegen, nie darunter. Darunter entsteht
    zwischen beiden eine b9 (13 Halbtöne) statt der erwarteten großen
    Septime, und der Akkord klingt nicht mehr nach Sus, sondern nach
    einem falschen Ton.

11. **`#9` nie vor der echten Terz.** Genau dasselbe Problem wie Regel 10,
    nur mit `#9` statt `10` und der Terz (`3`) statt der Quart: liegt die
    `#9` tiefer als die echte `3`, klingt der Dominant-Akkord nach Moll
    statt nach Dominant mit Farbton.

## Bekannte Ausnahmen

- Halbverminderte Akkorde (Min7b5) und Moll-Maj7 sind komplett
  ausgeschlossen — noch nicht geprüft/freigegeben.
- Sus2 und Dim7 haben grundsätzlich keine Tensions und damit auch keine
  Voicings.

## Wie prüfen?

Alle 11 Regeln sind als Code umgesetzt:
`checkVoicingRules(voicing, chord)` in `src/model/voicing.ts` gibt eine
Liste von Verstößen für ein konkretes Voicing+Akkord-Paar zurück (leer =
sauber). `isVoicingValidForChord(voicing, chord)` kombiniert das mit
`voicingContainsChord` (passt die Shape überhaupt zum Akkord?) und wird
überall dort verwendet, wo bisher nur `voicingContainsChord` stand
(`chordSet.ts`, `store/quiz.ts`, `VoicingList.tsx`) — die Filterung
passiert also automatisch pro Voicing+Akkord-Kombination, nicht mehr pro
Shape global.

Es gibt keine Mindestanzahl an Voicings pro Akkord — auch ein Akkord mit
nur einem regelkonformen Voicing ist völlig in Ordnung, man muss ja
ohnehin erst selbst darauf kommen, dass es dieser Akkord sein könnte.
