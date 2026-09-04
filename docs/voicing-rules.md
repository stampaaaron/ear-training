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
   *Ausnahme:* liegt die `7` in einer anderen (höheren) Gruppe als die
   1-3-5-Gruppe, zählt das nicht als Grundstellung — die 7 in einer
   eigenen Oktave macht daraus ein eigenständiges, aufgefächertes
   Voicing, nicht "die gleiche alte Terz mit einer Tension obendrauf".
   Sitzt die 7 dagegen selbst in der 1-3-5-Gruppe (alles eng in einer
   Oktave), bleibt es eine Grundstellung.
   Bei **Dominant-Akkorden** gilt zusätzlich `1-3-7` als Grundstellung
   (die App lässt bei Dominanten die Quinte standardmäßig weg,
   `chordBaseIntervals.dom = ['1','3']`) — *aber nur*, wenn die Quinte im
   Voicing gar nicht vorkommt. Kommt die Quinte irgendwo vor (auch als
   höchster Ton), ist es keine Grundstellung mehr, weil das Voicing dann
   etwas enthält, das die Default-Darstellung gar nicht hätte.

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

9. **Immer mit dem Grundton anfangen.** Der Grundton (`1`) muss in der
   untersten Oktave (Oktave 1) stehen — er ist der tiefste Ton. Sonst
   klingt ein anderer Ton wie der Bass, nicht der Grundton.

10. **Bei Sus-Akkorden: `10` nie vor der Quart.** Eine `10` muss über der
    Quart (`4`, aus Slot `3`) liegen, nie darunter. Darunter entsteht
    zwischen beiden eine b9 (13 Halbtöne) statt der erwarteten großen
    Septime, und der Akkord klingt nicht mehr nach Sus, sondern nach
    einem falschen Ton.

11. **`#9` nie vor der echten Terz.** Genau dasselbe Problem wie Regel 10,
    nur mit `#9` statt `10` und der Terz (`3`) statt der Quart: liegt die
    `#9` tiefer als die echte `3`, klingt der Dominant-Akkord nach Moll
    statt nach Dominant mit Farbton.

12. **Kein Tritonus zwischen Grundton und `#4`/`b5` in Oktave 1.** Liegt in
    derselben (untersten) Oktave wie der Grundton (`1`) ein Ton, der genau
    6 Halbtöne von *ihm* entfernt ist (`#4`/`b5`, in der Praxis eine `11`,
    die als `#11` aufgelöst wird), klingt das im Bassbereich nach einem
    harten Sprung statt nach Farbton. Betrifft nur den Abstand
    Grundton→Ton, nicht beliebige Tonpaare in der Oktave — ein Tritonus
    zwischen `3` und `b7` (die Dominant-Leittöne) in Oktave 1 ist völlig
    normal und bleibt erlaubt. Weiter oben ist auch ein `#11` neben dem
    Grundton ein ganz normaler Farbton.

## Bekannte Ausnahmen

- Halbverminderte Akkorde (Min7b5) und Moll-Maj7 sind komplett
  ausgeschlossen — noch nicht geprüft/freigegeben.
- Sus2 und Dim7 haben grundsätzlich keine Tensions und damit auch keine
  Voicings.

## Wie prüfen?

Regeln 1, 2, 3, 4, 5, 7, 8, 9, 10, 11 und 12 sind als Code umgesetzt:
`checkVoicingRules(voicing, chord)` in `src/model/voicing.ts` gibt eine
Liste von Verstößen für ein konkretes Voicing+Akkord-Paar zurück (leer =
sauber). `isVoicingValidForChord(voicing, chord)` kombiniert das mit
`voicingContainsChord` (passt die Shape überhaupt zum Akkord?) und wird
überall dort verwendet, wo bisher nur `voicingContainsChord` stand
(`chordSet.ts`, `store/quiz.ts`, `VoicingList.tsx`) — die Filterung
passiert also automatisch pro Voicing+Akkord-Kombination, nicht mehr pro
Shape global.

Regel 6 (Sus-Akkorde gegenhören) bleibt manuell, da sie ein Höreindruck
und keine Zahl ist.

Es gibt keine Mindestanzahl an Voicings pro Akkord — auch ein Akkord mit
nur einem regelkonformen Voicing ist völlig in Ordnung, man muss ja
ohnehin erst selbst darauf kommen, dass es dieser Akkord sein könnte.
