import React from 'react'
import Navbar from "../components/layout/Navbar"
import Hero from "../components/landing/Hero"
import Testimonials from '../components/landing/Testimonials'
import Footer from "../components/landing/Footer"
const LandingPage = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Testimonials/>
      <Footer/>
    </div>
  )
}

export default LandingPage
