import { expect, type Page, test } from '@playwright/test'

const api = 'https://pokeapi.co/api/v2/'
const resource = (kind: string, id: number, name: string) => ({
  name,
  url: `${api}${kind}/${id}/`
})

const mockApi = async (page: Page) => {
  await page.route('https://raw.githubusercontent.com/**', (route) =>
    route.fulfill({ status: 404, body: '' })
  )
  await page.route(`${api}**`, async (route) => {
    const url = new URL(route.request().url())
    const path = url.pathname.replace('/api/v2/', '').replace(/\/$/, '')

    if (path === 'pokemon' && url.searchParams.get('limit') === '24') {
      await route.fulfill({
        json: {
          count: 1,
          next: null,
          results: [resource('pokemon', 4, 'charmander')]
        }
      })
      return
    }

    if (path === 'pokemon' && url.searchParams.get('limit') === '500') {
      await route.fulfill({
        json: {
          count: 2,
          next: null,
          results: [
            resource('pokemon', 4, 'charmander'),
            resource('pokemon', 1, 'bulbasaur')
          ]
        }
      })
      return
    }

    if (path === 'ability') {
      await route.fulfill({ json: { count: 0, next: null, results: [] } })
      return
    }

    if (path === 'pokemon/4') {
      await route.fulfill({
        json: {
          id: 4,
          name: 'charmander',
          species: resource('pokemon-species', 4, 'charmander'),
          height: 6,
          weight: 85,
          types: [{ slot: 1, type: resource('type', 10, 'fire') }],
          abilities: [
            {
              is_hidden: false,
              slot: 1,
              ability: resource('ability', 66, 'blaze')
            }
          ],
          stats: [{ base_stat: 39, stat: resource('stat', 1, 'hp') }],
          moves: [],
          sprites: { front_default: null }
        }
      })
      return
    }

    if (path === 'pokemon/1') {
      await route.fulfill({
        json: {
          id: 1,
          name: 'bulbasaur',
          species: resource('pokemon-species', 1, 'bulbasaur'),
          height: 7,
          weight: 69,
          types: [{ slot: 1, type: resource('type', 12, 'grass') }],
          abilities: [],
          stats: [{ base_stat: 45, stat: resource('stat', 1, 'hp') }],
          moves: [],
          sprites: { front_default: null }
        }
      })
      return
    }

    await route.fulfill({ status: 404, json: { detail: 'Not found' } })
  })
}

test('published base serves assets, hash routes, refresh, and a 320 px layout', async ({
  page
}) => {
  const failedAssets: Array<string> = []
  page.on('response', (response) => {
    if (response.url().includes('/assets/') && response.status() >= 400) {
      failedAssets.push(response.url())
    }
  })
  await mockApi(page)

  const rootResponse = await page.goto('./')
  expect(rootResponse?.status()).toBe(200)
  await expect(
    page.getByRole('heading', { name: /Your next favorite/ })
  ).toBeVisible()
  const basePath = new URL(page.url()).pathname
  const scriptSource = await page
    .locator('script[type="module"]')
    .getAttribute('src')
  const stylesheet = await page
    .locator('link[rel="stylesheet"]')
    .getAttribute('href')
  const favicon = await page.locator('link[rel="icon"]').getAttribute('href')
  expect(scriptSource?.startsWith(`${basePath}assets/`)).toBe(true)
  expect(stylesheet?.startsWith(`${basePath}assets/`)).toBe(true)
  expect(favicon).toBe(`${basePath}favicon.svg`)

  await page.goto('./#/pokemon/4')
  await expect(page.getByRole('heading', { name: 'charmander' })).toBeVisible()
  const detailResponse = await page.reload()
  expect(detailResponse?.status()).toBe(200)
  await expect(page.getByRole('heading', { name: 'charmander' })).toBeVisible()
  await page.getByRole('link', { name: 'Back to collection' }).click()
  await expect(page).toHaveURL(/\/#\/$/)

  await page.goto('./#/compare?first=4&second=1')
  await expect(
    page.getByRole('heading', { name: 'Stats side by side' })
  ).toBeVisible()
  const comparisonResponse = await page.reload()
  expect(comparisonResponse?.status()).toBe(200)
  await expect(
    page.getByRole('heading', { name: 'Stats side by side' })
  ).toBeVisible()
  expect(failedAssets).toEqual([])

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  )
  expect(hasHorizontalOverflow).toBe(false)
})
