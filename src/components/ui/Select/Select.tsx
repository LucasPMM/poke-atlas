import ReactSelect, { type SingleValue } from 'react-select'

export type SelectOption<T extends string> = {
  label: string
  shortLabel?: string
  value: T
}

type SelectProps<T extends string> = {
  ariaLabel: string
  options: ReadonlyArray<SelectOption<T>>
  value: T
  onChange: (value: T) => void
  disabled?: boolean
  loading?: boolean
  searchable?: boolean
  variant?: 'compact' | 'field'
}

export const Select = <T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
  disabled = false,
  loading = false,
  searchable = false,
  variant = 'compact'
}: SelectProps<T>) => {
  const selected = options.find((option) => option.value === value) ?? null
  const handleChange = (option: SingleValue<SelectOption<T>>) => {
    if (option === null) {
      return
    }

    onChange(option.value)
  }

  return (
    <ReactSelect<SelectOption<T>, false>
      aria-label={ariaLabel}
      className={
        variant === 'compact' ? 'w-11 shrink-0 text-sm' : 'w-full text-sm'
      }
      classNames={{
        control: () =>
          `${variant === 'compact' ? 'h-11 w-11' : 'min-h-11 w-full px-3'} rounded-lg border border-line bg-surface shadow-none transition-colors hover:border-action focus-within:border-action focus-within:ring-2 focus-within:ring-action/20`,
        menu: () => 'z-30 rounded-lg border border-line bg-surface shadow-lg',
        menuList: () => 'p-1',
        option: (state) =>
          `cursor-pointer rounded-md px-3 py-2 text-ink ${state.isFocused ? 'bg-surface-muted' : ''} ${state.isSelected ? 'font-medium text-action' : ''}`,
        singleValue: () => 'font-semibold text-ink',
        valueContainer: () =>
          variant === 'compact'
            ? 'flex h-full items-center justify-center p-0'
            : 'flex min-w-0 flex-1 items-center p-0'
      }}
      components={
        variant === 'compact'
          ? { DropdownIndicator: null, IndicatorSeparator: null }
          : { IndicatorSeparator: null }
      }
      formatOptionLabel={(option, { context }) =>
        context === 'value' && variant === 'compact'
          ? (option.shortLabel ?? option.label)
          : option.label
      }
      isClearable={false}
      isDisabled={disabled}
      isLoading={loading}
      isSearchable={searchable}
      menuPlacement="auto"
      onChange={handleChange}
      options={[...options]}
      styles={
        variant === 'compact'
          ? {
              menu: (base) => ({ ...base, left: 'auto', right: 0, width: 160 })
            }
          : undefined
      }
      unstyled
      value={selected}
    />
  )
}
