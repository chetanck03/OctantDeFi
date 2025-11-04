import React, { useState } from 'react'
import { Send, Mail, MessageSquare, MapPin, Clock, Phone, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import emailjs from '@emailjs/browser'

/**
 * EmailJS Setup Instructions:
 * 
 * 1. Create an account at https://www.emailjs.com/
 * 2. Create a new service (Gmail, Outlook, etc.)
 * 3. Create an email template with these parameters:
 *    - {{from_name}} - Sender's name
 *    - {{from_email}} - Sender's email
 *    - {{subject}} - Email subject
 *    - {{message}} - Email message
 *    - {{to_name}} - Recipient name (SominaWalletX Team)
 *    - {{reply_to}} - Reply-to email
 * 4. Get your Service ID, Template ID, and Public Key from EmailJS dashboard
 * 5. Add them to your .env file:
 *    - VITE_EMAILJS_SERVICE_ID=your_service_id
 *    - VITE_EMAILJS_TEMPLATE_ID=your_template_id
 *    - VITE_EMAILJS_PUBLIC_KEY=your_public_key
 */

// ContactForm component that can be used both as a section and as a full page
function ContactForm({ isFullPage = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  
  // EmailJS configuration from environment variables
  const emailjsConfig = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if EmailJS is configured
    if (!emailjsConfig.serviceId || !emailjsConfig.templateId || !emailjsConfig.publicKey) {
      toast.error('Email service is not configured. Please check environment variables.')
      console.error('EmailJS configuration missing:', emailjsConfig)
      return
    }
    
    setIsLoading(true)
    
    try {
      // Initialize EmailJS with public key
      emailjs.init(emailjsConfig.publicKey)
      
      // Prepare template parameters
      const templateParams = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: 'SominaWalletX Team',
        reply_to: formData.email
      }
      
      console.log('Sending email with params:', templateParams)
      
      // Send email using EmailJS
      const response = await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        templateParams
      )
      
      console.log('Email sent successfully:', response)
      
      // Show success message
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      
    } catch (error) {
      console.error('Email sending failed:', error)
      
      // Show error message based on error type
      if (error.text) {
        toast.error(`Failed to send message: ${error.text}`)
      } else if (error.message) {
        toast.error(`Failed to send message: ${error.message}`)
      } else {
        toast.error('Failed to send message. Please try again or contact us directly.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const contactMethods = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      description: "Get in touch via email",
      contact: "cktechhuborg@gmail.com",
      action: "mailto:cktechhuborg@gmail.com"
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Telegram",
      description: "Join our community",
      contact: "Join Community",
      action: "https://t.me/cktechhub"
    }
  ]

  const faqs = [
    {
      question: "Is WalletX safe to use?",
      answer: "Yes, WalletX is built with security as the top priority. Your private keys are stored locally and encrypted, never transmitted to our servers."
    },
    {
      question: "Which blockchains are supported?",
      answer: "Currently, WalletX supports Ethereum and Solana networks. We're working on adding support for more blockchains."
    },
    {
      question: "Is WalletX open source?",
      answer: "Yes, WalletX is completely open source. You can view and contribute to the code on our GitHub repository."
    },
    {
      question: "How do I recover my wallet?",
      answer: "You can recover your wallet using the 12-word mnemonic phrase that was generated when you first created your wallet."
    }
  ]

  // If used as full page, render complete page structure
  if (isFullPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-neutral-950">
          <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

          <div className="relative z-10 container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-4xl md:text-6xl tracking-tighter text-transparent leading-tight mb-6">
                Get in{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Touch
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                Have questions, suggestions, or need help? We'd love to hear from you.
                Our team is here to assist you with anything related to WalletX.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="relative py-20 bg-neutral-950">
          <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

          <div className="relative z-10 container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl md:text-4xl lg:text-5xl tracking-tighter text-transparent leading-tight mb-4">
                Multiple Ways to{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Reach Us
                </span>
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Choose the method that works best for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.action}
                  className="flex items-center space-x-4 p-6 bg-neutral-900/50 border border-neutral-700 rounded-lg hover:border-neutral-600 hover:bg-neutral-800/50 transition-all duration-200 group"
                >
                  <div className="p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-all duration-200">
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      {method.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-1">
                      {method.description}
                    </p>
                    <p className="text-purple-400 font-medium text-sm">
                      {method.contact}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="relative py-20 bg-neutral-950">
          <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

          <div className="relative z-10 container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Form */}
              <div>
                <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl md:text-4xl tracking-tighter text-transparent leading-tight mb-6">
                  Send us a{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Message
                  </span>
                </h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  {/* Primary Button with Spinning Border - Full Width */}
                  <span className="relative block overflow-hidden rounded-full p-[1.5px] w-full">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <div className="flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 backdrop-blur-3xl">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="group flex items-center justify-center rounded-full border-[1px] border-transparent bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent px-8 py-3 text-center text-white transition-colors hover:bg-transparent/90 text-base font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </span>
                </form>
              </div>

              {/* Info */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Let's Connect
                </h2>
                <p className="text-lg text-gray-400 mb-8">
                  We're always excited to hear from our community and help you make the most of WalletX.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Response Time</h3>
                      <p className="text-gray-400">We typically respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <MapPin className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Global Team</h3>
                      <p className="text-gray-400">Distributed team across multiple time zones</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-green-600/20 rounded-lg">
                      <Phone className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Support</h3>
                      <p className="text-gray-400">Community support via Discord and GitHub</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative py-20 bg-neutral-950">
          <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

          <div className="relative z-10 container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl md:text-4xl lg:text-5xl tracking-tighter text-transparent leading-tight mb-4">
                Frequently Asked{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Questions
                </span>
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Quick answers to common questions
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-all duration-200"
                >
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Default section view for embedding in other pages
  return (
    <section className="relative py-20 bg-neutral-950">
      <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl md:text-4xl lg:text-5xl tracking-tighter text-transparent leading-tight mb-4">
            Get in{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Have questions or feedback? We'd love to hear from you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              {/* Primary Button with Spinning Border - Full Width */}
              <span className="relative block overflow-hidden rounded-full p-[1.5px] w-full">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <div className="flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 backdrop-blur-3xl">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group flex items-center justify-center rounded-full border-[1px] border-transparent bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent px-8 py-3 text-center text-white transition-colors hover:bg-transparent/90 text-base font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </span>
            </form>
          </div>

          {/* Contact Methods */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Other Ways to Connect</h3>
            <p className="text-gray-400 mb-8">
              Prefer a different way to get in touch? Choose what works best for you.
            </p>

            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.action}
                  className="flex items-center space-x-4 p-4 bg-neutral-900/50 border border-neutral-700 rounded-lg hover:border-neutral-600 hover:bg-neutral-800/50 transition-all duration-200 group"
                >
                  <div className="p-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-all duration-200">
                    {method.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{method.title}</h4>
                    <p className="text-gray-400 text-sm">{method.contact}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm