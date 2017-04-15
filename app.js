const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const accesslog = require('koa-accesslog')
const views = require('koa-views')
const config = require('./config')

const router = new Router()

const interceptWebCrawler = async (ctx, next) => {
  const ua = ctx.headers['user-agent']

  if (/^(facebookexternalhit)|(Twitterbot)|(Pinterest)/gi.test(ua)) {
    return await ctx.render('webcrawler', {
      facebookAppId: config.facebookAppId,
      url: ctx.request.origin + ctx.request.url,
      type: 'article',
      title: 'www.zine.media',
      description: 'A fresh way to discover and create content online',
      image: 'http://res.cloudinary.com/quillapp/image/upload/v1492190923/zine/socialMediaImage.jpg'
    })
  }

  await next()
}

router
  .get('*', interceptWebCrawler, async ctx => {
    return await ctx.render('index', { cdn: config.cdn })
  })

app
  .use(views('./views', { map: { jade: 'jade' }, extension: 'jade' }))
  .use(accesslog())
  .use(router.routes())
  .use(router.allowedMethods())

module.exports = app
