import clsx from 'clsx'
import { type ComponentPropsWithRef, forwardRef } from 'react'
import { ShouldRender } from '../ShouldRender'
import { Text } from '../Text'

type TextInputProps = ComponentPropsWithRef<'input'> & {
  error?: string
  id: string
  label: string
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, error, id, label, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="mb-2 block text-sm font-medium text-ink" htmlFor={id}>
          {label}
        </label>
        <input
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={Boolean(error)}
          className={clsx(
            'min-h-12 w-full rounded-lg border border-line bg-surface px-4 text-base text-ink outline-none transition-colors duration-150 placeholder:text-muted focus:border-action focus:ring-2 focus:ring-action/20 motion-reduce:transition-none',
            error && 'border-error',
            className
          )}
          id={id}
          ref={ref}
          {...props}
        />
        <ShouldRender if={Boolean(error)}>
          <Text
            className="mt-2 text-sm text-error"
            id={`${id}-error`}
            variant="unstyled"
          >
            {error}
          </Text>
        </ShouldRender>
      </div>
    )
  }
)

TextInput.displayName = 'TextInput'
