# WhatsApp Personal Stealth Bot

Bot personal y minimo basado en Baileys. Esta version deja intacto el bot anterior y se enfoca solo en un comando privado:

- `:o`: responde a una foto, video, audio, sticker o archivo de "ver una vez" y lo replica al chat personal del owner.
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
OWNER_NUMBER=519XXXXXXXX
OWNER_NAME=Frank
OWNER_JIDS=58888581865722@lid
OWNER_CHAT_JID=519XXXXXXXX@s.whatsapp.net
COMMAND_PREFIX=:
OPEN_ONCE_COMMAND=o
```

`OWNER_JIDS` es opcional, pero util si WhatsApp te muestra como `@lid` en grupos. Puedes poner varios separados por coma.

## Uso

```bash
npm install
npm start
```

Al iniciar, escanea el QR o usa el codigo de vinculacion que aparece en la terminal.

En WhatsApp, responde al mensaje de una sola vez con:

```text
:o
```

El grupo no recibira confirmaciones ni errores. Todo aviso va al chat personal del owner.

## Despliegue 24/7

Para un bot de WhatsApp con sesion persistente, lo importante no es CPU sino que el proceso no duerma y que la carpeta `auth_session/` sobreviva reinicios.

Opciones viables:

- Oracle Cloud Always Free: opcion mas cercana a 24/7 gratis, pero suele pedir tarjeta y configuracion de VPS.
- Una PC vieja, mini PC o telefono con Termux: gratis si ya tienes el equipo y conexion estable.
- Render/Railway/Koyeb free: pueden dormir, cambiar limites o no ser 24/7 real en planes gratis. Sirven para pruebas, no como promesa estable.

Para hosts que exigen un puerto HTTP, activa:

```env
ENABLE_HEALTH_SERVER=true
PORT=3000
```

La ruta `/health` solo devuelve `ok` y no expone datos del bot.
