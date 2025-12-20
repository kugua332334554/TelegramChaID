# TelegramChaID
一个依靠CloudFlareWorker的TelegramID查询Bot

# 效果展示

<img width="2000" height="772" alt="image" src="https://github.com/user-attachments/assets/6c54db09-9617-42de-a833-fab7d03cd640" />

# 版权声明
本机器人用于查询用户ID和其他功能，由 @Ld_wp1 编写，转载请标注

# 部署方式
1.登录 CloudFlare.com 注册账户后在侧边栏选择 WorkerAndPages 并新建一个Worker

2.将chaid.js所有代码复制到代码控制台

3.返回并选择Worker 点击设置并找到 **变量和机密**

4.添加两个变量 分别为

BOT_TOKEN - 你的机器人TOKEN

AD_TEXT - 广告信息，用于展示在启动消息下方，不需要的填写none

5.注册Webhook 访问网站  https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_WEBHOOK_URL> 分别替换为你的TOKEN和Worker网址 访问后看到 Webhook was set... 即成功

6./start看一看吧


