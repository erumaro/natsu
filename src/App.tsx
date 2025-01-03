//import { useState } from 'react'
//import erumaLogo from './assets/eruma_logo.png'
import portrait from './assets/portrait.jpg'
import './App.css'

function App() {

  return (
    <>
      <h1 className='screen-reader-text'>Eruma - Tobias Årud</h1>
      <div className='card'>
        <div className='left'>
          <img src={portrait} className='portrait' alt='Tobias' />
          <ul>
            <li className='name'>Tobias Årud</li>
            <li className='title'>Frontend och Wordpressutvecklare</li>
            <li className='current-employer'><a href="https://addcode.se">@Addcode AB</a> <span>sedan 2022</span></li>
          </ul>
        </div>
        <div className='right'>
            <q className='description'>
            På en spännande resa för en mer tillgänglig webb: WordPress trollkarl, lojal som en hob och med en Jedis känsla för detaljer. Problemlösning är mitt andra språk!
            </q>
            <div className='skillset row'>
              <div className='column'>
                <h2>Riddare</h2>
                <p>Värnar om tillgänglighet, användbarhet och är mån om kundernas behov och säkerhet.</p>
              </div>
              <div className='column'>
                <h2>Trollkarl</h2>
                <p>Samlar på kodsnuttar och erfarenheter som jag sedan kan dra ur min magiska bok för att snabba på framtida projekt och hjälpa mina kollegor.</p>
              </div>
              <div className='column'>
                <h2>Ninja</h2>
                <p>Som modern utvecklare anpassar jag mig efter kunders och arbetsgivares behov. Jag hanterar förutom php, Wordpress diverse tekniker från duktiga JavaScript ninjor.</p>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default App
