import { expect, type Page, test } from '@playwright/test'

const api = 'https://pokeapi.co/api/v2/'
const resource = (kind: string, id: number, name: string) => ({
  name,
  url: `${api}${kind}/${id}/`
})
const bulbasaur = resource('pokemon', 1, 'bulbasaur')
const charmander = resource('pokemon', 4, 'charmander')
const pikachu = resource('pokemon', 25, 'pikachu')
const entries = [bulbasaur, charmander, pikachu]

type MockOptions = {
  failFirstPage?: boolean
  failNextPage?: boolean
}

const mockApi = async (page: Page, options: MockOptions = {}) => {
  const requests: Array<string> = []
  const attempts = new Map<string, number>()

  await page.route(`${api}**`, async (route) => {
    const url = new URL(route.request().url())
    const path = url.pathname.replace('/api/v2/', '').replace(/\/$/, '')
    const key = `${path}${url.search}`
    requests.push(key)
    const attempt = (attempts.get(key) ?? 0) + 1
    attempts.set(key, attempt)

    if (
      (options.failFirstPage && key === 'pokemon?limit=24&offset=0') ||
      (options.failNextPage &&
        key === 'pokemon?limit=24&offset=24' &&
        attempt <= 3)
    ) {
      await route.fulfill({ status: 503, json: { detail: 'Unavailable' } })
      return
    }

    if (path === 'pokemon' && url.searchParams.get('limit') === '24') {
      const offset = Number(url.searchParams.get('offset'))
      await route.fulfill({
        json: {
          count: 3,
          next: offset === 0 ? `${api}pokemon?limit=24&offset=24` : null,
          results: offset === 0 ? entries.slice(0, 2) : entries.slice(2)
        }
      })
      return
    }

    if (path === 'pokemon' && url.searchParams.get('limit') === '500') {
      await route.fulfill({ json: { count: 3, next: null, results: entries } })
      return
    }

    if (path === 'ability') {
      await route.fulfill({ json: { count: 0, next: null, results: [] } })
      return
    }

    if (path === 'type/fire') {
      await route.fulfill({
        json: {
          id: 10,
          name: 'fire',
          pokemon: [{ pokemon: charmander }],
          damage_relations: {
            double_damage_from: [resource('type', 11, 'water')],
            half_damage_from: [resource('type', 12, 'grass')],
            no_damage_from: []
          }
        }
      })
      return
    }

    if (path === 'generation/1') {
      await route.fulfill({
        json: {
          pokemon_species: [resource('pokemon-species', 4, 'charmander')]
        }
      })
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
          sprites: {
            front_default: null,
            other: { 'official-artwork': { front_default: null } }
          }
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
          abilities: [
            {
              is_hidden: false,
              slot: 1,
              ability: resource('ability', 65, 'overgrow')
            }
          ],
          stats: [{ base_stat: 45, stat: resource('stat', 1, 'hp') }],
          moves: [],
          sprites: {
            front_default: null,
            other: { 'official-artwork': { front_default: null } }
          }
        }
      })
      return
    }

    if (path === 'pokemon/133') {
      await route.fulfill({
        json: {
          id: 133,
          name: 'eevee',
          species: resource('pokemon-species', 133, 'eevee'),
          height: 3,
          weight: 65,
          types: [{ slot: 1, type: resource('type', 1, 'normal') }],
          abilities: [],
          stats: [
            { base_stat: 55, stat: resource('stat', 1, 'hp') },
            { base_stat: 55, stat: resource('stat', 2, 'attack') },
            { base_stat: 50, stat: resource('stat', 3, 'defense') },
            { base_stat: 45, stat: resource('stat', 4, 'special-attack') },
            { base_stat: 65, stat: resource('stat', 5, 'special-defense') },
            { base_stat: 55, stat: resource('stat', 6, 'speed') }
          ],
          moves: [],
          sprites: {
            front_default: null,
            other: { 'official-artwork': { front_default: null } }
          }
        }
      })
      return
    }

    if (path === 'pokemon-species/133') {
      await route.fulfill({
        json: {
          id: 133,
          name: 'eevee',
          generation: resource('generation', 1, 'generation-i'),
          evolution_chain: { url: `${api}evolution-chain/67/` },
          names: [{ name: 'Eevee', language: resource('language', 9, 'en') }],
          genera: [
            {
              genus: 'Evolution Pokémon',
              language: resource('language', 9, 'en')
            }
          ],
          flavor_text_entries: [],
          gender_rate: 1,
          egg_groups: [resource('egg-group', 5, 'field')],
          capture_rate: 45,
          growth_rate: resource('growth-rate', 2, 'medium'),
          varieties: [
            { is_default: true, pokemon: resource('pokemon', 133, 'eevee') }
          ]
        }
      })
      return
    }

    if (path === 'evolution-chain/67') {
      const variations = [
        [134, 'vaporeon'],
        [135, 'jolteon'],
        [136, 'flareon'],
        [196, 'espeon'],
        [197, 'umbreon'],
        [470, 'leafeon'],
        [471, 'glaceon'],
        [700, 'sylveon']
      ] as const
      await route.fulfill({
        json: {
          id: 67,
          chain: {
            species: resource('pokemon-species', 133, 'eevee'),
            evolution_details: null,
            evolves_to: variations.map(([id, name]) => ({
              species: resource('pokemon-species', id, name),
              evolution_details: [
                {
                  trigger: resource('evolution-trigger', 3, 'use-item'),
                  item: resource('item', id, `${name}-stone`)
                }
              ],
              evolves_to: []
            }))
          }
        }
      })
      return
    }

    if (path === 'pokemon-species/4') {
      await route.fulfill({
        json: {
          id: 4,
          name: 'charmander',
          generation: resource('generation', 1, 'generation-i'),
          evolution_chain: { url: `${api}evolution-chain/2/` },
          names: [
            { name: 'Charmander', language: resource('language', 9, 'en') }
          ],
          genera: [
            { genus: 'Lizard Pokémon', language: resource('language', 9, 'en') }
          ],
          flavor_text_entries: [
            {
              flavor_text: 'A small fire Pokémon.',
              language: resource('language', 9, 'en')
            }
          ],
          gender_rate: 1,
          egg_groups: [resource('egg-group', 1, 'monster')],
          capture_rate: 45,
          growth_rate: resource('growth-rate', 4, 'medium-slow'),
          varieties: [{ is_default: true, pokemon: charmander }]
        }
      })
      return
    }

    if (path === 'evolution-chain/2') {
      await route.fulfill({
        json: {
          id: 2,
          chain: {
            species: resource('pokemon-species', 4, 'charmander'),
            evolution_details: null,
            evolves_to: []
          }
        }
      })
      return
    }

    await route.fulfill({ status: 404, json: { detail: 'Not found' } })
  })

  return requests
}

test('catalog loads more and debounced search returns to the list', async ({
  page
}) => {
  const requests = await mockApi(page)
  await page.goto('/#/')
  await expect(page.getByRole('link', { name: /bulbasaur/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /charmander/i })).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(page.getByRole('link', { name: /pikachu/i })).toBeVisible()

  const search = page.getByRole('searchbox', { name: 'Search the collection' })
  await search.fill('pika')
  await expect(search).toHaveValue('pika')
  expect(
    requests.filter((request) => request === 'pokemon?limit=500&offset=0')
  ).toHaveLength(0)
  await expect(page).toHaveURL(/search=pika/)
  await expect(page.getByRole('link', { name: /pikachu/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /bulbasaur/i })).toHaveCount(0)

  await page.getByRole('button', { name: 'Clear search' }).click()
  await expect(page).not.toHaveURL(/search=/)
  await expect(page.getByRole('link', { name: /bulbasaur/i })).toBeVisible()
})

test('type and generation filters survive a detail visit', async ({ page }) => {
  await mockApi(page)
  await page.goto('/#/')
  await expect(page.getByRole('link', { name: /bulbasaur/i })).toBeVisible()

  if (test.info().project.name === 'mobile-chromium') {
    await page.getByRole('button', { name: 'Filters', exact: true }).click()
  }

  const filterArea =
    test.info().project.name === 'mobile-chromium'
      ? page.getByRole('dialog', { name: 'Filters' })
      : page.locator('.mt-5.hidden.md\\:block')
  await filterArea.getByText('All types', { exact: true }).click()
  await expect(page.getByRole('option', { name: 'Fire' })).toHaveCSS(
    'text-transform',
    'capitalize'
  )
  await page.getByRole('option', { name: 'Fire' }).click()
  await filterArea.getByText('All generations', { exact: true }).click()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')

  if (test.info().project.name === 'mobile-chromium') {
    await page.getByRole('button', { name: 'Show results' }).click()
  }

  await expect(
    page.locator('#catalog').getByRole('link', { name: /charmander/i })
  ).toBeVisible()
  await expect(page.getByRole('link', { name: /bulbasaur/i })).toHaveCount(0)
  await page.getByRole('link', { name: /charmander/i }).click()
  await expect(page).toHaveURL(/\/pokemon\/4/)
  await expect(page.getByRole('heading', { name: 'Charmander' })).toBeVisible()
  await expect(page.locator('[data-primary-type="fire"]')).toBeVisible()
  await expect(page.getByText('A small fire Pokémon.')).toBeVisible()
  const sectionNav = page.getByRole('navigation', { name: 'Pokémon sections' })
  await expect(sectionNav.getByRole('button', { name: 'Profile' })).toHaveCSS(
    'cursor',
    'pointer'
  )
  await page.getByRole('link', { name: 'Back to collection' }).click()
  await expect(page).toHaveURL(/type=fire/)
  await expect(page).toHaveURL(/generation=1/)
  await expect(
    page.locator('#catalog').getByRole('link', { name: /charmander/i })
  ).toBeVisible()
  await page.getByRole('button', { name: 'Clear all' }).click()
  await expect(page.getByRole('link', { name: /bulbasaur/i })).toBeVisible()
})

test('API and missing-Pokémon errors have recovery paths', async ({ page }) => {
  await mockApi(page, { failFirstPage: true })
  await page.goto('/#/')
  await expect(page.getByText("We couldn't load the collection.")).toBeVisible()
  await page.goto('/#/pokemon/999999')
  await expect(page.getByText('This Pokémon was not found.')).toBeVisible()
  await page.getByRole('link', { name: 'Back to collection' }).click()
  await expect(page).toHaveURL(/\/#\/$/)
})

test('compares two Pokémon from a detail page and restores the shared URL', async ({
  page
}) => {
  const requests = await mockApi(page)
  await page.goto('/#/pokemon/4')
  await expect(page.getByRole('heading', { name: 'Charmander' })).toBeVisible()
  await page.getByRole('link', { name: 'Compare Pokémon' }).click()
  await expect(page).toHaveURL(/\/compare\?first=4/)
  await expect(
    page.getByText('Choose the second Pokémon to start comparing.')
  ).toBeVisible()
  await page.getByLabel('Second Pokémon').click()
  await page.getByRole('option', { name: /bulbasaur/i }).click()
  await page.getByRole('button', { name: 'Compare', exact: true }).click()
  await expect(page).toHaveURL(/first=4&second=1/)
  await expect(
    page.getByRole('heading', { name: 'Stats side by side' })
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'bulbasaur', exact: false })
  ).toBeVisible()
  await expect(
    page.getByRole('meter', { name: 'charmander: HP' })
  ).toHaveAttribute('value', '39')
  await expect(
    page.getByRole('meter', { name: 'bulbasaur: HP' })
  ).toHaveAttribute('value', '45')
  await page.setViewportSize({ width: 320, height: 800 })
  const comparisonOverflows = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  )
  expect(comparisonOverflows).toBe(false)
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'Stats side by side' })
  ).toBeVisible()
  expect(requests.some((request) => request.includes('undefined'))).toBe(false)
})

test('wide evolution branches remain readable without horizontal overflow', async ({
  page
}) => {
  await mockApi(page)
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/#/pokemon/133')
  const evolution = page.locator('#evolution')
  await expect(
    evolution.getByRole('heading', { name: 'Stage 2' })
  ).toBeVisible()
  await expect(evolution.getByRole('link')).toHaveCount(9)
  await expect(evolution.getByRole('link', { name: /sylveon/i })).toBeVisible()
  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  )
  expect(horizontalOverflow).toBe(false)
  await page.setViewportSize({ width: 1280, height: 800 })
  const cardHeights = await page.evaluate(() => {
    const height = (selector: string) =>
      document.querySelector(selector)?.getBoundingClientRect().height ?? 0
    return {
      profile: height('#profile section'),
      stats: height('#stats section'),
      biology: height('#biology'),
      moves: height('#moves')
    }
  })
  expect(cardHeights.profile).toBeGreaterThan(0)
  expect(cardHeights.profile).toBeCloseTo(cardHeights.stats, 0)
  expect(cardHeights.biology).toBeCloseTo(cardHeights.moves, 0)
})

test('a later-page error keeps existing cards and can be retried', async ({
  page
}) => {
  await mockApi(page, { failNextPage: true })
  await page.goto('/#/')
  await expect(page.getByRole('link', { name: /bulbasaur/i })).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(page.getByText("We couldn't load more Pokémon.")).toBeVisible()
  await expect(page.getByRole('link', { name: /bulbasaur/i })).toBeVisible()
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.getByRole('link', { name: /pikachu/i })).toBeVisible()
})
