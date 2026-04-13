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

  console.log('Connecting to database...')
  
  try {
    const payload = await getPayload({ config })

    console.log('Checking for Home page...')
    const pages = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      limit: 1,
    })

    if (pages.totalDocs === 0) {
      console.log('Creating Home page...')
      await payload.create({
        collection: 'pages',
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
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Welcome to Our Website',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
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
                                    children: [
                                      {
                                        type: 'text',
                                        detail: 0,
                                        format: 0,
                                        mode: 'normal',
                                        style: '',
                                        text: 'This site is built with Payload CMS and a custom orange theme.',
                                        version: 1,
                                      },
                                    ],
                                    direction: 'ltr',
                                    format: '',
                                    indent: 0,
                                    version: 1,
                                },
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            version: 1,
                        },
                    },
                }
              ]
            }
          ]
        },
        context: {
            disableRevalidate: true, // Bypass Next.js cache logic in script
        }
      })
      console.log('Home page created.')
    } else {
      console.log('Home page already exists. Updating to published...')
      await payload.update({
        collection: 'pages',
        id: pages.docs[0].id,
        data: { _status: 'published' },
        context: { disableRevalidate: true }
      })
    }

    console.log('Checking Header...')
    await payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'reference',
              label: 'Home',
              reference: {
                relationTo: 'pages',
                value: (await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } } })).docs[0].id,
              },
            },
          },
        ],
      },
    })
    console.log('Header initialized.')

    console.log('Checking Footer...')
    await payload.updateGlobal({
        slug: 'footer',
        data: {
          navItems: [
            {
              link: {
                type: 'reference',
                label: 'Home',
                reference: {
                  relationTo: 'pages',
                  value: (await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } } })).docs[0].id,
                },
              },
            },
          ],
        },
    })
    console.log('Footer initialized.')

    console.log('Verification successful.')
    process.exit(0)
  } catch (err: any) {
    console.error('Migration/Seed failed:', err.stack)
    process.exit(1)
  }
}

void run()
