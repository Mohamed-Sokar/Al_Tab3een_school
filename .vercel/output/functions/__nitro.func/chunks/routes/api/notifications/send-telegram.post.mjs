import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'node:module';

const sendTelegram_post = defineEventHandler(async (event) => {
  const { message } = await readBody(event);
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  if (!BOT_TOKEN || !CHAT_ID) {
    throw createError({
      statusCode: 500,
      message: "Missing Telegram bot token or chat ID."
    });
  }
  if (!message) {
    throw createError({
      statusCode: 400,
      message: "Message is required."
    });
  }
  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    }
  );
  return { success: true, response };
});

export { sendTelegram_post as default };
//# sourceMappingURL=send-telegram.post.mjs.map
