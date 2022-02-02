import React from 'react';
import { CgMouse } from 'react-icons/cg';
import './Home.css'
import Product from './Product'
import MetaData from '../layout/MetaData';

const product = {
  name: 'Blue Tshirt',
  images: [{url: "https://i.ibb.co/DRST11n/1.webp"}],
  price: '$300',
  _id:"Mohamad Cheaito"
}


function Home() {
  return <>
  <MetaData title="Fares Tech"/>
  <div className='banner'>
    <p>Welcome to Fares Technology</p>
    <h1>FIND AMAZING PRODUCTS BELOW</h1>

    <a href="#container">
      <button>
          Scroll <CgMouse />
      </button>
    </a>
  </div>
  <h2 className='homeHeading'>Featured Products</h2>

  <div className='container' id="container">
    <Product product={product} />
    <Product product={product} />
    <Product product={product} />
    <Product product={product} />

    <Product product={product} />
    <Product product={product} />
  </div>
  </>
}

export default Home;

