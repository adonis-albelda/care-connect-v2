'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import PasswordField from '@/components/PasswordField'
import { api, ApiError } from '@/lib/api'
import { useToast } from '@/lib/toast-context'

interface ResetPasswordFormProps {
  token?: string
  email?: string
}

interface FormErrors {
  password?: string
  password_confirmation?: string
}

export default function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isRequesting, setIsRequesting] = useState(false)

  const validate = () => {
    const next: FormErrors = {}
    if (!password) next.password = 'Choose a new password.'
    if (passwordConfirmation !== password) next.password_confirmation = "Those passwords don't match yet."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate() || isRequesting) return
    setIsRequesting(true)

    try {
      await api.post('password/reset', {
        password,
        password_confirmation: passwordConfirmation,
        token,
        email,
      })
      showSuccess('Successfully updated your password!')
      router.push('/login')
    } catch (err) {
      const message = err instanceof ApiError ? (err.response.data as { message?: string })?.message : undefined
      showError(message || "That didn't go through — let's try that again.")
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <div>
      <h2 className="font-headline text-h2 text-connect-blue">Create new password</h2>
      <p className="mt-2 text-body text-slate">
        Your new password must be different from previously used passwords.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
        <PasswordField id="password" label="Password" value={password} onChange={setPassword} error={errors.password} placeholder="Password" />
        <PasswordField
          id="password_confirmation"
          label="Confirm Password"
          value={passwordConfirmation}
          onChange={setPasswordConfirmation}
          error={errors.password_confirmation}
          placeholder="Confirm Password"
        />

        <button
          type="submit"
          disabled={isRequesting}
          className="min-h-[48px] rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isRequesting ? 'Updating…' : 'Reset password'}
        </button>
      </form>
    </div>
  )
}
