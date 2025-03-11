'use server'

import { redirect } from 'next/navigation'

export async function handleCodeSubmission(formData: FormData) {
  const code = formData.get('code')

  // Simulasi pengecekan kode
  const isValidCode = code === '123456'

  if (isValidCode) {
    redirect('https://buy.stripe.com/test_8wM6p2dXJfOD8Le5kk')
  } else {
    redirect('/payments?error=invalid_code')
  }
}
