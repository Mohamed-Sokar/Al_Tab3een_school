import { defineEventHandler, createError, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const { message } = await readBody(event);

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!message) {
    throw createError({
      statusCode: 400,
      message: "Message is required.",
    });
  }

  const response = await $fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        chat_id: `${CHAT_ID}`,
        text: message,
      },
    }
  );

  return { success: true, response };
});
