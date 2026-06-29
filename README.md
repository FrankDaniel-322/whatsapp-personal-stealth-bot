# WhatsApp Personal Stealth Bot

Bot personal y minimo basado en Baileys. Esta version deja intacto el bot anterior y se enfoca solo en un comando privado:

- `:o`: responde a una foto, video, audio, sticker o archivo de "ver una vez" y lo replica al chat personal del owner.
- Alias sin prefijo: `q riko`, `wao`, `waoo`.
- No responde en el grupo.
- Ignora comandos de personas que no sean el owner.
- El mensaje de estado `Replicando ...` se envia solo al chat personal configurado.
- No guarda llaves API ni numeros sensibles en el codigo.
- Incluye resolucion de JID para `@s.whatsapp.net`, `@lid`, JID con device suffix y participantes de grupo.

## Configuracion

```bash
cp .env.example .env
```

Edita `.env`:

```env
OWNER_NUMBER=XXXXXXXXXXX
OWNER_NAME=Frank
OWNER_JIDS=XXXXXXXXXXXXXX@lid
OWNER_CHAT_JID=XXXXXXXXXXX@s.whatsapp.net
COMMAND_PREFIX=:
OPEN_ONCE_COMMAND=o
OPEN_ONCE_ALIASES=q riko,wao,waoo
```

`OWNER_JIDS` es opcional, pero util si WhatsApp te muestra como `@lid` en grupos. Puedes poner varios separados por coma.

## Uso

```bash
npm install
npm start
```

Al iniciar, escanea el QR o usa el codigo de vinculacion que aparece en la terminal.

En WhatsApp, responde al mensaje de una sola vez con cualquiera de estos textos:

```text
:o
q riko
wao
waoo
```

El grupo no recibira confirmaciones ni errores. Todo aviso va al chat personal del owner.

## Prender y apagar en Windows

Con doble clic:

- `start-bot.cmd`: prende el bot.
- `stop-bot.cmd`: apaga el bot usando `runtime/bot.pid`.
- `relink-bot.cmd`: mueve la sesion vieja a backup para pedir un codigo completamente nuevo.

Con comandos:

```bash
npm start
npm run stop
npm run relink
```

Si quieres cerrarlo desde la misma ventana donde esta corriendo, tambien sirve `Ctrl + C`.

## Sobre el texto "Bad MAC"

`Bad MAC` suele aparecer cuando Baileys intenta descifrar mensajes viejos o sesiones que WhatsApp no le entrego completas. No significa que el bot este mal si luego ves `WhatsApp connection open` y los comandos funcionan.

Esta version filtra esos mensajes ruidosos de consola para que solo veas eventos utiles.

## Vincular con codigo, sin QR

Baileys pide que el numero se envie solo con digitos y codigo de pais, sin `+`, espacios, parentesis ni guiones. Ejemplo Peru:

```env
OWNER_NUMBER=519XXXXXXXX
```

Si WhatsApp dice `No se pudo vincular el dispositivo`, haz esto:

1. Apaga el bot con `stop-bot.cmd`.
2. Ejecuta `relink-bot.cmd`.
3. Ejecuta `start-bot.cmd`.
4. Copia el codigo nuevo apenas aparezca; caduca rapido.
5. En tu WhatsApp principal entra a `Dispositivos vinculados`.
6. Toca `Vincular dispositivo`.
7. Elige la opcion de vincular con numero/codigo, no el QR.
8. Escribe el codigo exactamente como aparece.

No reutilices codigos antiguos. Cada intento fallido debe usar un codigo nuevo.

## Uso bajo demanda, sin tarjeta

La forma mas estable sin tarjeta es usar tu laptop/PC como host y prenderlo cuando quieras:

1. Deja la laptop encendida o en suspension.
2. Entra desde el celular con Chrome Remote Desktop, AnyDesk, RustDesk o la app remota que prefieras.
3. Haz doble clic en `start-bot.cmd`.
4. Cuando termines, haz doble clic en `stop-bot.cmd`.

Chrome Remote Desktop permite acceder a tu computadora desde telefono, tablet u otra computadora. Wake-on-LAN puede servir para despertar una PC compatible desde suspension, pero depende del BIOS/UEFI, adaptador de red, router y suele funcionar mejor por cable Ethernet.

## Nube bajo demanda

Para un bot de WhatsApp con sesion persistente, lo importante no es CPU sino que el proceso no duerma y que la carpeta `auth_session/` sobreviva reinicios.

Opciones:

- Oracle Cloud Always Free: opcion mas cercana a 24/7 gratis, pero suele pedir tarjeta y configuracion de VPS.
- GitHub Codespaces: sirve para encender manualmente desde navegador/celular y tiene cuota gratis mensual en cuentas personales. No es ideal como hosting final; si gastas la cuota y no tienes metodo de pago, GitHub bloquea el uso hasta el reinicio mensual.
- Una PC vieja, mini PC o tu laptop: gratis si ya tienes el equipo y conexion estable.
- Render/Railway/Koyeb free: pueden dormir, cambiar limites o no conservar bien `auth_session/` sin disco persistente. Sirven para pruebas, no como opcion principal.

Para hosts que exigen un puerto HTTP, activa:

```env
ENABLE_HEALTH_SERVER=true
PORT=3000
```

La ruta `/health` solo devuelve `ok` y no expone datos del bot.
