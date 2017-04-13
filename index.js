const Koa = require('koa')
const app = new Koa()
const PORT = process.env.PORT || 3000

app.use(async function (ctx, next) {
  const ua = ctx.headers['user-agent']

  if (/^(facebookexternalhit)|(Twitterbot)|(Pinterest)/gi.test(ua)) {
    console.log(`${ua}, is a bot`)
    return ctx.body = `${ua}, is a bot`
  }

  await next()
})

app.listen(PORT);

console.log(`listening on port ${PORT}`);
