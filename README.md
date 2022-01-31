### Come eseguire in locale
Entrando nella cartella, scaricare tutti i moduli npm usati con
```
npm i
```
Se non è installato expo-cli sulla propria macchina potrebbe esserci bisogno di fare
```
npm install -g expo-cli
```
Per eseguire l'app sarà necessario un emulatore Androi o un simulatore iOS. Oppure seguire la documentazione di expo per eseguire su un dispositivo fisico https://docs.expo.dev/guides/testing-on-devices/
Eseguire uno di questi 3 comandi per eseguire expo
```
npm run android
npm run ios
npm run web
```

### Problemi
- Lo stile non è molto curato.
- L'upload del file non funzione sul simulatore ios ma funziona su dispositivi fisici android.
- L'invio del codice di verifica non è reale perché richiede l'utilizzo di qualche servizio di invio email.
- Il codice è stato scritto in un unico componente per questioni di tempo, ma con un po' di pazienza si può snellire e riordinare. Ci sono molti elementi hardcoded che potrebbero portare a problemi di scalabilità se si trattasse di un applicazione reale.

