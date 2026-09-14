import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { I18nProvider } from '@/lib/i18n'
import type { EvolutionChain } from '@/models/pokemon'
import { EvolutionLine } from './EvolutionLine'

const variations = [
  'vaporeon',
  'jolteon',
  'flareon',
  'espeon',
  'umbreon',
  'leafeon',
  'glaceon',
  'sylveon'
]

const chain: EvolutionChain = {
  id: 67,
  root: {
    id: 133,
    name: 'eevee',
    artworkUrl: '/133.png',
    methods: [],
    evolvesTo: variations.map((name, index) => ({
      id: 134 + index,
      name,
      artworkUrl: `/${134 + index}.png`,
      methods: [
        {
          trigger: 'use-item',
          requirements: [{ kind: 'item', value: `${name}-stone` }]
        }
      ],
      evolvesTo: []
    }))
  }
}

describe('EvolutionLine', () => {
  it('keeps all branches and requirements in a compact stage grid', () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <EvolutionLine
            backTo="/"
            chain={chain}
            currentSpeciesId={133}
            isError={false}
            isPending={false}
            retry={() => undefined}
          />
        </MemoryRouter>
      </I18nProvider>
    )

    expect(screen.getByRole('heading', { name: 'Stage 1' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Stage 2' })).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(9)
    for (const name of variations) {
      expect(
        screen.getByRole('link', { name: new RegExp(name, 'i') })
      ).toBeInTheDocument()
      expect(screen.getByText(`Use ${name} stone`)).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: /eevee/i })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })
})
