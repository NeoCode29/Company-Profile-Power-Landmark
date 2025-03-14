'use client'

import React, { useState } from 'react'

interface FormData {
  name: string
  lastname: string
  email: string
  message: string
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    lastname: '',
    email: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("selesai");
   
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
    >
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
          First Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your first name"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="lastname" className="block text-gray-700 font-medium mb-1">
          Last Name
        </label>
        <input
          type="text"
          id="lastname"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          placeholder="Your last name"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your email address"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="message" className="block text-gray-700 font-medium mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message..."
          required
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r bg-green-500 text-white font-bold rounded shadow-md hover:opacity-90 transition-opacity"
      >
        Send Message
      </button>
    </form>
  )
}

export default ContactForm
