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
}

export const Select = <T extends string>({
  ariaLabel,
  options,
  value,
  onChange
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
      className="w-11 shrink-0 text-sm"
      classNames={{
        control: () =>
          'h-11 w-11 rounded-lg border border-line bg-surface shadow-none transition-colors hover:border-action focus-within:border-action focus-within:ring-2 focus-within:ring-action/20',
        menu: () => 'z-30 rounded-lg border border-line bg-surface shadow-lg',
        menuList: () => 'p-1',
        option: (state) =>
          `cursor-pointer rounded-md px-3 py-2 text-ink ${state.isFocused ? 'bg-surface-muted' : ''} ${state.isSelected ? 'font-medium text-action' : ''}`,
        singleValue: () => 'font-semibold text-ink',
        valueContainer: () => 'flex h-full items-center justify-center p-0'
      }}
      components={{ DropdownIndicator: null, IndicatorSeparator: null }}
      formatOptionLabel={(option, { context }) =>
        context === 'value' ? (option.shortLabel ?? option.label) : option.label
      }
      isClearable={false}
      isSearchable={false}
      onChange={handleChange}
      options={[...options]}
      styles={{
        menu: (base) => ({ ...base, left: 'auto', right: 0, width: 160 })
      }}
      unstyled
      value={selected}
    />
  )
}
