'use client'

import type { Form } from '@/payload-types'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, type FieldErrors, type RegisterOptions, type UseFormRegister } from 'react-hook-form'
import { site } from '@/content/site'
import { getClientSideURL } from '@/utilities/getURL'
import { safeHref } from '@/utilities/safeHref'

import { Heading } from '../layout/Heading'

type ContactField = NonNullable<Form['fields']>[number]
type Choice = { label: string; value: string }
type FormValues = Record<string, string | boolean>

export type PublicContactForm = {
  id: string
  fields?: Form['fields']
  submitButtonLabel?: string | null
  confirmationType?: Form['confirmationType']
  confirmationMessage?: Form['confirmationMessage']
  redirect?: { url?: string | null } | null
}

const controlClassName = `
  mt-2 w-full rounded-lg border border-neutral-200 bg-white px-4 py-3
  text-neutral-900
  dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-falun-600
  focus-visible:ring-offset-2
`

const labelClassName = 'block text-sm font-medium text-neutral-900 dark:text-neutral-100'

function lexicalPlainText(data: unknown): string {
  if (!data || typeof data !== 'object' || !('root' in data)) return ''

  const walk = (nodes: unknown): string => {
    if (!Array.isArray(nodes)) return ''

    return nodes
      .map((node) => {
        if (!node || typeof node !== 'object') return ''
        const current = node as { text?: unknown; children?: unknown; type?: unknown }
        const text = typeof current.text === 'string' ? current.text : ''
        const nested = walk(current.children)
        const separator = current.type && current.type !== 'text' ? ' ' : ''
        return `${text}${nested}${separator}`
      })
      .join('')
  }

  return walk((data as { root?: { children?: unknown } }).root?.children).trim()
}

function RequiredMark() {
  return (
    <span className="text-falun-600">
      {' '}
      *<span className="sr-only"> (obligatoriskt)</span>
    </span>
  )
}

function fieldWidthClass(width?: number | null) {
  if (!width || width >= 100) return 'w-full'
  if (width <= 33) return 'w-full md:w-[calc(33.333%-0.75rem)]'
  if (width <= 50) return 'w-full md:w-[calc(50%-0.75rem)]'
  return 'w-full md:w-[calc(66.666%-0.75rem)]'
}

function autoCompleteFor(field: ContactField) {
  if (!('name' in field)) return undefined
  if (field.blockType === 'email') return 'email'
  if (field.blockType === 'textarea') return 'off'

  const name = field.name.toLowerCase()
  if (name.includes('namn') || name === 'name' || name.includes('full-name')) return 'name'
  if (name.includes('tel') || name.includes('phone')) return 'tel'
  return 'on'
}

function FieldError({ id, errors, name }: { id: string; errors: FieldErrors<FormValues>; name: string }) {
  const message = errors[name]?.message
  if (!message) return null

  return (
    <p id={id} className="mt-2 text-sm text-red-700 dark:text-red-400">
      {String(message)}
    </p>
  )
}

function ChoiceField({
  id,
  name,
  label,
  required,
  options,
  register,
  errors,
  emptyLabel,
}: {
  id: string
  name: string
  label?: string | null
  required?: boolean | null
  options: Choice[]
  register: UseFormRegister<FormValues>
  errors: FieldErrors<FormValues>
  emptyLabel: string
}) {
  const errorId = `${id}-error`

  return (
    <>
      <label htmlFor={id} className={labelClassName}>
        {label}
        {required && <RequiredMark />}
      </label>
      <select
        {...register(name, {
          required: required ? 'Välj ett alternativ.' : false,
        })}
        id={id}
        className={controlClassName}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? errorId : undefined}
      >
        <option value="">{emptyLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError id={errorId} errors={errors} name={name} />
    </>
  )
}

export function ContactForm({ form }: { form: PublicContactForm }) {
  const fields = form.fields ?? []
  const router = useRouter()
  const statusRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string>()
  const [countryOptions, setCountryOptions] = useState<Choice[]>([])
  const [stateOptions, setStateOptions] = useState<Choice[]>([])

  const needsCountry = fields.some((field) => field.blockType === 'country')
  const needsState = fields.some((field) => field.blockType === 'state')

  useEffect(() => {
    if (!needsCountry) return

    let active = true
    void import('@/blocks/Form/Country/options').then((mod) => {
      if (active) setCountryOptions(mod.countryOptions)
    })

    return () => {
      active = false
    }
  }, [needsCountry])

  useEffect(() => {
    if (!needsState) return

    let active = true
    void import('@/blocks/Form/State/options').then((mod) => {
      if (active) setStateOptions(mod.stateOptions)
    })

    return () => {
      active = false
    }
  }, [needsState])

  const defaultValues = useMemo(() => {
    const values: FormValues = { _hp: '' }

    fields.forEach((field) => {
      if (!('name' in field) || !field.name) return

      if (field.blockType === 'checkbox') {
        values[field.name] = Boolean(field.defaultValue)
        return
      }

      if ('defaultValue' in field && field.defaultValue != null && typeof field.defaultValue !== 'boolean') {
        values[field.name] = String(field.defaultValue)
        return
      }

      values[field.name] = ''
    })

    return values
  }, [fields])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues })

  useEffect(() => {
    if (hasSubmitted) statusRef.current?.focus()
  }, [hasSubmitted])

  const onSubmit = handleSubmit(async (data) => {
    if (typeof data._hp === 'string' && data._hp.trim() !== '') {
      setHasSubmitted(true)
      return
    }

    setError(undefined)
    setIsLoading(true)

    const submissionData = Object.entries(data)
      .filter(([name, value]) => name !== '_hp' && value !== '' && value != null)
      .map(([field, value]) => ({
        field,
        value: typeof value === 'string' ? value : String(value),
      }))

    try {
      const response = await fetch(`${getClientSideURL()}/api/form-submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form: form.id,
          submissionData,
        }),
      })

      if (!response.ok) {
        setError('Meddelandet kunde inte skickas. Försök igen om en stund.')
        return
      }

      setHasSubmitted(true)

      const redirectUrl = form.redirect?.url
      const canRedirect =
        form.confirmationType === 'redirect' &&
        !!redirectUrl &&
        redirectUrl.startsWith('/') &&
        !redirectUrl.startsWith('//') &&
        !!safeHref(redirectUrl)

      if (canRedirect && redirectUrl) router.push(redirectUrl)
    } catch {
      setError('Meddelandet kunde inte skickas. Försök igen om en stund.')
    } finally {
      setIsLoading(false)
    }
  })

  if (hasSubmitted) {
    const confirmation = lexicalPlainText(form.confirmationMessage) || site.contact.confirmation

    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="max-w-prose focus:outline-none">
        <Heading level={3}>Meddelandet är skickat</Heading>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">{confirmation}</p>
      </div>
    )
  }

  return (
    <form className="max-w-xl" onSubmit={onSubmit} noValidate>
      <div className="flex flex-wrap gap-5">
        {fields.map((field, index) => {
          if (field.blockType === 'message') {
            const message = lexicalPlainText(field.message)
            if (!message) return null

            return (
              <p key={field.id || index} className="w-full text-neutral-700 dark:text-neutral-300">
                {message}
              </p>
            )
          }

          if (!('name' in field) || !field.name) return null

          const id = `${form.id}-${field.name}`
          const errorId = `${id}-error`
          const width = 'width' in field ? field.width : 100

          return (
            <div key={field.id || field.name} className={fieldWidthClass(width)}>
              <FormControl
                field={field}
                id={id}
                errorId={errorId}
                register={register}
                errors={errors}
                countryOptions={countryOptions}
                stateOptions={stateOptions}
              />
            </div>
          )
        })}
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${form.id}-hp`}>Företag</label>
        <input id={`${form.id}-hp`} tabIndex={-1} autoComplete="off" {...register('_hp')} />
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}

      <div aria-live="polite" className="sr-only">
        {isLoading ? 'Skickar meddelandet.' : ''}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="
          interactive-lift
          mt-6 inline-flex items-center justify-center
          rounded-lg bg-falun-600 px-6 py-3
          text-neutral-0
          hover:bg-falun-700
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-falun-600
          focus-visible:ring-offset-2
          disabled:cursor-wait disabled:opacity-70
        "
      >
        {isLoading ? 'Skickar…' : form.submitButtonLabel || site.contact.submitLabel}
      </button>
    </form>
  )
}

function FormControl({
  field,
  id,
  errorId,
  register,
  errors,
  countryOptions,
  stateOptions,
}: {
  field: Exclude<ContactField, { blockType: 'message' }>
  id: string
  errorId: string
  register: UseFormRegister<FormValues>
  errors: FieldErrors<FormValues>
  countryOptions: Choice[]
  stateOptions: Choice[]
}) {
  if (!('name' in field)) return null

  const { name } = field
  const label = 'label' in field ? field.label : name
  const required = 'required' in field ? field.required : false
  const describedBy = errors[name] ? errorId : undefined

  if (field.blockType === 'checkbox') {
    return (
      <>
        <label htmlFor={id} className="flex items-start gap-3 text-sm text-neutral-800 dark:text-neutral-200">
          <input
            {...register(name, {
              required: required ? 'Bekräfta det här valet.' : false,
            })}
            id={id}
            type="checkbox"
            className="mt-1 size-4 accent-falun-600"
            aria-invalid={Boolean(errors[name])}
            aria-describedby={describedBy}
          />
          <span>
            {label}
            {required && <RequiredMark />}
          </span>
        </label>
        <FieldError id={errorId} errors={errors} name={name} />
      </>
    )
  }

  if (field.blockType === 'select') {
    return (
      <ChoiceField
        id={id}
        name={name}
        label={label}
        required={required}
        options={field.options ?? []}
        register={register}
        errors={errors}
        emptyLabel={field.placeholder || (required ? 'Välj…' : 'Inget val')}
      />
    )
  }

  if (field.blockType === 'country' || field.blockType === 'state') {
    return (
      <ChoiceField
        id={id}
        name={name}
        label={label}
        required={required}
        options={field.blockType === 'country' ? countryOptions : stateOptions}
        register={register}
        errors={errors}
        emptyLabel={required ? 'Välj…' : 'Inget val'}
      />
    )
  }

  const rules: RegisterOptions<FormValues> = {
    required: required ? 'Fyll i det här fältet.' : false,
  }

  if (field.blockType === 'email') {
    rules.pattern = {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Ange en giltig e-postadress.',
    }
  }

  const shared = {
    ...register(name, rules),
    id,
    className: controlClassName,
    autoComplete: autoCompleteFor(field),
    'aria-invalid': Boolean(errors[name]) || undefined,
    'aria-describedby': describedBy,
  }

  return (
    <>
      <label htmlFor={id} className={labelClassName}>
        {label}
        {required && <RequiredMark />}
      </label>
      {field.blockType === 'textarea' ? (
        <textarea {...shared} rows={6} />
      ) : (
        <input {...shared} type={field.blockType === 'number' ? 'number' : field.blockType === 'email' ? 'email' : 'text'} />
      )}
      <FieldError id={errorId} errors={errors} name={name} />
    </>
  )
}
