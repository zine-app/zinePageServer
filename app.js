const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const accesslog = require('koa-accesslog')
const views = require('koa-views')
const request = require('request-promise-native')
const config = require('./config')()

const router = new Router()

const interceptWebCrawler = async (ctx, next) => {
  const ua = ctx.headers['user-agent']

  if (/^(facebookexternalhit)|(Twitterbot)|(Pinterest)/gi.test(ua)) {
    let title = 'www.zine.media'
    let type = 'website'
    let description = 'A fresh way to discover and create content online'
    let image = 'http://res.cloudinary.com/quillapp/image/upload/v1492190923/zine/socialMediaImage.jpg'

    if(ctx.params.postId) {
      const response = await request(`${config.zineAPI}/post?_id=${ctx.params.postId}`)

      title = response.title
      type = 'article'
      description = response.description || ''
      image = response.image || ''
    }


    return await ctx.render('webcrawler', {
      facebookAppId: config.facebookAppId,
      url: ctx.request.origin + ctx.request.url,
      type,
      title,
      description,
      image
    })
  }

  await next()
}

const renderPage = async ctx => {
  return await ctx.render('index', { cdn: config.cdn })
}

router
  .get('/:channelName/post/:postId', interceptWebCrawler, renderPage)
  .get('*', interceptWebCrawler, renderPage)

app
  .use(views('./views', { map: { jade: 'jade' }, extension: 'jade' }))
  .use(accesslog())
  .use(router.routes())
  .use(router.allowedMethods())

module.exports = app
