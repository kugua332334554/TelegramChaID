// 键盘配置
const createReplyKeyboard = () => ({
    keyboard: [
        [
            { t: "查询用户 ID", e: "5920344347152224466", id: 1, bot: false },
            { t: "查询机器人 ID", e: "5931415565955503486", id: 2, bot: true }
        ].map(b => ({ text: b.t, icon_custom_emoji_id: b.e, request_user: { request_id: b.id, user_is_bot: b.bot } })),
        [
            { t: "查询群组 ID", e: "5942877472163892475", id: 3, ch: false },
            { t: "查询频道 ID", e: "5771695636411847302", id: 4, ch: true }
        ].map(b => ({ text: b.t, icon_custom_emoji_id: b.e, request_chat: { request_id: b.id, chat_is_channel: b.ch } }))
    ],
    resize_keyboard: true,
    one_time_keyboard: false
});

// 发送消息
async function sendResponse(chatId, text, env, reply_markup = null) {
    const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
            ...(reply_markup && { reply_markup })
        }),
    });

    if (!res.ok) console.error('Error:', res.status, await res.text());
    return new Response('OK', { status: 200 });
}

// 处理 /start 命令
async function handleStartCommand({ chat, from }, env) {
    const time = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai', hour12: false,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(new Date()).replace(/\//g, '-');

    const ad = (env.AD_TEXT && env.AD_TEXT.toLowerCase() !== 'none') ? `\n\n${env.AD_TEXT}` : '';

    const text = `<tg-emoji emoji-id="5994750571041525522">👋</tg-emoji> <b>欢迎使用 ID 查询助手</b>
<tg-emoji emoji-id="5778605968208170641">🕰</tg-emoji> 当前时间：${time}
<tg-emoji emoji-id="5922612721244704425">📌</tg-emoji> 您的用户ID：<code>${from.id}</code>${ad}`;

    return sendResponse(chat.id, text, env, createReplyKeyboard());
}

// 主请求处理
async function handleRequest(request, env) {
    if (request.method !== 'POST') return new Response('OK');

    try {
        const data = await request.json();
        const msg = data.message;
        if (!msg) return new Response('OK');

        const { chat, user_shared, chat_shared, text } = msg;
        const shared = user_shared || chat_shared;

        if (shared) {
            const id = shared.user_id || shared.chat_id;
            const type = user_shared ? "对象" : "群组/频道";
            const messageText = `<tg-emoji emoji-id="5920052658743283381">✅</tg-emoji> <b>ID 查询成功！</b>\n\n<tg-emoji emoji-id="5942826671290715541">🔎</tg-emoji> 您分享的${type}的 ID 是：<code>${id}</code>`;
            return sendResponse(chat.id, messageText, env, createReplyKeyboard());
        }

        if (text?.startsWith('/start')) return handleStartCommand(msg, env);

    } catch (e) {
        console.error('Error:', e.message);
    }
    return new Response('OK');
}

export default {
    fetch: handleRequest,
};
