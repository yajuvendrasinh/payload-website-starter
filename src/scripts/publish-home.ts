import { getPayload } from 'payload'
import config from '../payload.config.js'

async function publishHome() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'home' },
    },
    draft: true,
  })

  if (docs.length === 0) {
    console.log('No home page found to publish.')
    process.exit(0)
  }

  const home = docs[0]
  console.log(`Found Home page with status: ${home._status}`)

  if (home._status !== 'published') {
    console.log('Publishing home page...')
    await payload.update({
      collection: 'pages',
      id: home.id,
      data: {
        _status: 'published',
      },
      draft: false,
    })
    console.log('Home page published successfully.')
  } else {
    console.log('Home page is already published.')
  }

  process.exit(0)
}

publishHome()
