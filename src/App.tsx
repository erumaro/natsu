//import { useState } from 'react'
//import erumaLogo from './assets/eruma_logo.png'
//import portrait from './assets/portrait.jpg'
import { Hero } from "./components/sections/Hero"
import StickyNav from "./components/StickyNav"
import { Process } from "./components/sections/Process"
import { Competence } from "./components/sections/Competence"
import { Examples } from "./components/sections/Examples"
import { Footer } from "./components/sections/Footer"

export default function App() {

  return (
    <main>
      <Hero />
      <StickyNav />
      <Process />
      <Competence />
      <Examples />
      <Footer />
    </main>
  )
}