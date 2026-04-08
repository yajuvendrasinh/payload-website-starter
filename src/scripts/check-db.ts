import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({
  path: path.resolve(dirname, '../../.env'),
})

async function run() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../payload.config')

  try {
    const payload = await getPayload({ config })
    const pages = await payload.find({ collection: 'pages' })
    const posts = await payload.find({ collection: 'posts' })
    const media = await payload.find({ collection: 'media' })

    console.log(`Pages: ${pages.totalDocs}`)
    console.log(`Posts: ${posts.totalDocs}`)
    console.log(`Media: ${media.totalDocs}`)

    if (pages.totalDocs > 0) {
        console.log('Pages found:', pages.docs.map(d => d.slug).join(', '))
    }

    process.exit(0)
  } catch (err: any) {
    console.error('Check failed:', err.message)
    process.exit(1)
  }
}

void run()
