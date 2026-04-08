import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({
  path: path.resolve(dirname, '../../.env'),
})

async function run() {
  const { getPayload, createLocalReq } = await import('payload')
  const { seed } = await import('../endpoints/seed')
  const { default: config } = await import('../payload.config')

  console.log('Seed: Initializing Payload...')

  try {
    const payload = await getPayload({ config })

    console.log('Seed: Starting seeding process...')
    const payloadReq = await createLocalReq({
        user: {
            collection: 'users',
            id: 'admin', // Dummy ID for local req
            email: 'admin@payloadcms.com',
            roles: ['admin'],
        } as any
    }, payload)

    await seed({ payload, req: payloadReq })

    console.log('Seed: Successful!')
    process.exit(0)
  } catch (err: any) {
    console.error('Seed: FAILED!')
    console.error('Message:', err.message)
    console.error('Stack:', err.stack)
    // If there are validation errors, they are often in err.data
    if (err.data) {
        console.error('Error Data:', JSON.stringify(err.data, null, 2))
    }
    process.exit(1)
  }
}

void run()
