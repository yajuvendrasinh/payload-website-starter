import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({
  path: path.resolve(dirname, '../../.env'),
})

async function run() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../payload.config')

  console.log('Home Creator: Initializing...')

  try {
    const payload = await getPayload({ config })
    
    // Get a media ID
    const media = await payload.find({ collection: 'media' })
    const mediaId = media.docs[0]?.id

    console.log('Home Creator: Creating Home page with disableRevalidate...')
    try {
        const page = await payload.create({
            collection: 'pages',
            overrideAccess: true,
            context: { disableRevalidate: true },
            data: {
                title: 'Home',
                slug: 'home',
                _status: 'published',
                hero: {
                    type: 'lowImpact',
                    richText: {
                        root: {
                            type: 'root',
                            children: [
                                {
                                    type: 'heading',
                                    tag: 'h1',
                                    children: [{ type: 'text', text: 'Welcome to My Website' }],
                                    direction: 'ltr',
                                    version: 1
                                }
                            ],
                            direction: 'ltr',
                            version: 1,
                        }
                    }
                },
                layout: [
                    {
                        blockType: 'content',
                        columns: [
                            {
                                size: 'full',
                                richText: {
                                    root: {
                                        type: 'root',
                                        children: [
                                            {
                                                type: 'paragraph',
                                                children: [{ type: 'text', text: 'This is a programmatically created home page.' }],
                                                direction: 'ltr',
                                                version: 1
                                            }
                                        ],
                                        direction: 'ltr',
                                        version: 1,
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        })
        console.log(`Home Creator: SUCCESS! ID: ${page.id}`)
    } catch (e: any) {
        console.error('Home Creator: Inner FAILED!')
        if (e.data) {
           fs.writeFileSync('error_details.json', JSON.stringify(e.data, null, 2))
           console.error('Validation errors written to error_details.json')
        } else {
            console.error(e)
        }
        throw e
    }
    
    process.exit(0)
  } catch (err: any) {
    console.error('Home Creator: FAILED!')
    process.exit(1)
  }
}

void run()
