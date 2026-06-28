# Auditoria y decisiones

## Deficiencias encontradas en el bot anterior

- `config.js` tenia datos sensibles hardcodeados, incluyendo owner y una API key.
- El prefijo `.` y el menu hacian visible que habia un bot activo.
- `replicar.js` enviaba mensajes de progreso y el resultado al mismo chat/grupo.
- `messageProcessor.js` ignoraba `fromMe`, lo que dificulta usar comandos desde la propia cuenta vinculada.
- La verificacion de owner dependia demasiado de `split('@')[0]` y de un `@lid` fijo.
- Los logs imprimian remitentes y numeros completos.
- La carga de plugins era asincrona sin esperar a que terminara antes de aceptar comandos.
- El proyecto tenia muchas funciones no necesarias para tu caso personal, aumentando superficie de fallos.

## Lo que se tomo de otros bots revisados

- `games-wabot` tiene un comando `readviewonce` que usa una estrategia simple: cargar el mensaje citado y reenviarlo quitando la restriccion `viewOnce`.
- `GataBot-MD` maneja mejor los cambios recientes de WhatsApp: considera `@lid`, `jidNormalizedUser`, `areJidsSameUser`, variantes del JID del bot y metadata de participantes.
- Ambos proyectos muestran que el soporte de grupos debe buscar participantes por varios candidatos, no solo por `p.id === sender`.

## Cambios en este proyecto

- Nuevo proyecto aislado: no modifica `BotPremium` ni `ElPsyCongro_Bot`.
- Configuracion por `.env`; sin claves ni numeros reales dentro del codigo.
- Solo existe el comando `:o`.
- Los no owners son ignorados en silencio.
- Los errores y estados se envian al chat personal del owner, nunca al grupo.
- La descarga soporta wrappers modernos: `ephemeralMessage`, `viewOnceMessage`, `viewOnceMessageV2`, `viewOnceMessageV2Extension` y `documentWithCaptionMessage`.
- La identidad usa candidatos `@s.whatsapp.net`, `@lid`, numeros limpios, `jidNormalizedUser` y `areJidsSameUser`.
- Logs con redaccion basica de numeros/JID.

## Limitaciones reales

- Si WhatsApp ya no entrega el contenido view-once al cliente, el bot no puede inventarlo.
- Si el mensaje fue abierto, expiro o no esta en el contexto citado, puede fallar.
- Baileys no es una API oficial de WhatsApp; cualquier bot de este tipo puede romperse si WhatsApp cambia el protocolo.
