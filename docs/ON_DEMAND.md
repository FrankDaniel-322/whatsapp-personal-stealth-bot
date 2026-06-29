# Encendido bajo demanda

## Opcion recomendada: laptop/PC + boton

Esta es la opcion mas simple si no quieres tarjeta, pagos ni 24/7.

1. Instala dependencias una sola vez:

   ```bash
   npm install
   ```

2. Configura `.env`.
3. Vincula WhatsApp una vez con QR o codigo.
4. Para prender: doble clic en `start-bot.cmd`.
5. Para apagar: doble clic en `stop-bot.cmd`.
6. Para forzar una vinculacion nueva: doble clic en `relink-bot.cmd` y luego `start-bot.cmd`.

Ventajas:

- No dependes de limites gratis de plataformas cloud.
- Conservas `auth_session/` en tu disco.
- No gasta recursos cuando esta apagado.
- RAM esperada: normalmente baja para este bot, porque no carga IA ni plugins pesados.

## Desde el celular

La manera mas facil es controlar tu laptop desde el celular:

1. Instala Chrome Remote Desktop, AnyDesk o RustDesk en la laptop.
2. Instala la app correspondiente en el celular.
3. Entra a la laptop desde el celular.
4. Toca `start-bot.cmd` para prender.
5. Toca `stop-bot.cmd` para apagar.

Si la laptop esta apagada completamente, no podras iniciar nada sin una configuracion adicional de Wake-on-LAN o sin alguien que la prenda fisicamente.

## Nube sin tarjeta: GitHub Codespaces

Puede servir para encenderlo manualmente, pero no lo recomiendo como solucion principal para WhatsApp porque la sesion queda en un entorno remoto que puede detenerse y tiene cuota mensual.

Pasos generales:

1. Sube este repositorio a GitHub.
2. Abre el repo en GitHub desde navegador.
3. Entra a `Code > Codespaces > Create codespace`.
4. Crea el archivo `.env` dentro del codespace.
5. Ejecuta:

   ```bash
   npm install
   npm start
   ```

6. Escanea el QR o usa el codigo de vinculacion.
7. Cuando termines, detén el proceso con `Ctrl + C`.
8. Deten el codespace desde GitHub para no gastar cuota.

Importante: si eliminas el codespace, tambien puedes perder `auth_session/` y tendras que vincular otra vez.

## El texto Bad MAC

Si ves mensajes como `Failed to decrypt message with any known session` o `Bad MAC`, normalmente significa que WhatsApp entrego mensajes que esa sesion local no puede descifrar. No es grave si el bot conecta y los comandos funcionan.

La version actual filtra esos logs para que no llenen la consola.

## Si el codigo de vinculacion falla

El numero debe estar en formato internacional solo con digitos:

```env
OWNER_NUMBER=519XXXXXXXX
```

Sin `+`, espacios, guiones ni parentesis.

Pasos recomendados:

1. Ejecuta `stop-bot.cmd`.
2. Ejecuta `relink-bot.cmd`.
3. Ejecuta `start-bot.cmd`.
4. Usa el codigo nuevo de inmediato.
5. En WhatsApp: `Dispositivos vinculados > Vincular dispositivo > Vincular con numero/codigo`.

Si ya habia una sesion rota, `relink-bot.cmd` no la borra definitivamente: la mueve a una carpeta backup con fecha.
