const superkoa = require('superkoa')
const test = require('ava')


test('get', async t => {
  const res = await superkoa(__dirname + '/../../app.js')
    .get('/test_blog_name/post/test_post_id')
    .set('User-Agent', 'facebookexternalhit')

  t.is(200, res.status)

  const facebookMetaURLRegex = /<meta property="og:url" content=".+?">/
  const facebookMetaTypeRegex = /<meta property="og:type" content=".+?">/
  const facebookMetaTitleRegex = /<meta property="og:title" content=".+?">/
  const facebookMetaImageRegex = /<meta property="og:image" content=".+?">/
  const facebookMetaDescriptionRegex = /<meta property="og:description" content=".+?">/

  t.truthy(facebookMetaURLRegex.test(res.text))
  t.truthy(facebookMetaTypeRegex.test(res.text))
  t.truthy(facebookMetaTitleRegex.test(res.text))
  t.truthy(facebookMetaImageRegex.test(res.text))
  t.truthy(facebookMetaDescriptionRegex.test(res.text))
})
