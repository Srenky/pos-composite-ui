# Príprava experimentov

## Prerekvizity

1. Nasadené aplikácie podľa pokynov v `system_docs.md`
2. Nainštalovaný MQTTX pre sledovanie MQTT správ (https://mqttx.app/)
3. Hocijaký prehliadač s devtools (napr. Chrome, Firefox)

## Meranie dĺžky načítania webovej aplikácie

V devtools otvorte sekciu `Network` a v nej sledujte časy ako dlho trvalo prehliadaču načítanie jednotlivých assetov (JS, CSS). V dolnej časti možno pozorovať celkový čas trvania načítania aplikácie `Load`.

![Meranie render](images/devtools-loadtime.png)

## Meranie latencie - MQTT

V devtools otvorte sekciu `Network`, prepnite sa do časti `WS` a kliknite na položku `mqtt` (je dôležité aby ste mali devtools otvorené už keď sa aplikácia pripája na brokera, v prípade, že ho tam stále nevidíte, refresh stránky väčšinou pomôže).

![MQTT messages](images/mqtt-messages.png)

Pomocou MQTTX sa pripojte na MQTT brokera a môžete simulovať posielanie správ. MQTTX umožňuje jednoducho meniť QoS počas testovania a takisto nastaviť `Timed Message` teda periodické posielanie správy pre jednoduché testovanie.

![MQTT messages](images/mqttx-messages.png)

## Meranie latencie - REST

Primárne aplikácie komunikujú iba skrz MQTT, v prípade aplikácie `Kitchen display` sme ale pre tento experiment pripravili [túto čast kódu](https://github.com/Srenky/pos-composite-ui/blob/main/apps/kitchen-app/src/App.tsx#L44), ktorú treba odkomentovať, aby aplikácia periodicky volala backend.

Pre zjednodušenie testovania sme pripravili aj [skript](https://github.com/Srenky/pos-composite-ui/blob/main/apps/rest/script.sh), ktorý v periodických intervaloch (1 až 5 sekúnd) vygeneruje náhodnú objednávku a túto objednávku pošle na backend.

Po spustení skriptu a odkomentovaní časti kódu možno v konzole v devtools sledovať ako aplikácia periodicky vypisovať časy ako dlho trvalo volanie na backend až po získanie dát.

![REST latency](images/rest-latency.png)

## Meranie latencie pri rastúcej veľkosti prenášaných dát

Pri tomto experimente využite rovnaké postupy ako pri predošlích experimentoch s latenciou, pričom meňte veľkosti prenášaných dát v prípade obidvoch protokolov. Aj tu si môžete pomôcť pomocným skriptom, ktorý môže tieto dáta pre vás vygenerovať.
