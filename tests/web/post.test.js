const superkoa = require('superkoa')
const test = require('ava')


test('get', async t => {
  const res = await superkoa(__dirname + '/../../app.js')
    .get('/test_blog_name/post/test_post_id')

  const appVersionMetaTagRegex = /<meta name="version" content="[\d|.]+">/

  t.is(200, res.status)
  t.truthy(appVersionMetaTagRegex.test(res.text))
})
