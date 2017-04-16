const SandboxedModule = require('sandboxed-module')
const app = SandboxedModule.require('../../app', {
  requires: {
    "request-promise-native": url => new Promise(resolve => {
      if(url === 'stub_test_server/post?_id=test_post_id') {
        resolve(JSON.stringify({
          title: 'test_title',
          description: 'test_description',
        }))
      }
    })
  }
})

const agent = require('supertest-koa-agent')
const test = require('ava')


test('get', async t => {
  const res = await agent(app)
    .get('/test_blog_name/post/test_post_id')
    .set('User-Agent', 'facebookexternalhit')

  t.is(200, res.status)

  const facebookAppId = /<meta property="fb:app_id" content=".+?">/
  const facebookMetaURLRegex = /<meta property="og:url" content=".+?">/
  const facebookMetaTypeRegex = /<meta property="og:type" content=".+?">/
  const facebookMetaTitleRegex = /<meta property="og:title" content=".+?">/
  const facebookMetaImageRegex = /<meta property="og:image" content=".+?">/
  const facebookMetaDescriptionRegex = /<meta property="og:description" content=".+?">/

  t.truthy(facebookAppId.test(res.text))
  t.truthy(facebookMetaURLRegex.test(res.text))
  t.truthy(facebookMetaTypeRegex.test(res.text))
  t.truthy(facebookMetaTitleRegex.test(res.text))
  t.truthy(facebookMetaImageRegex.test(res.text))
  t.truthy(facebookMetaDescriptionRegex.test(res.text))
})
