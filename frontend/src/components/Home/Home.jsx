import React, { Fragment, useEffect } from 'react';
import { CgMouse } from 'react-icons/cg';
import './Home.css'
import Product from './Product'
import MetaData from '../layout/MetaData.js';
import { clearErrors, getProduct } from '../../actions/productAction';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';

function Home() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products, productsCount } = useSelector(
    state => state.products
  );
  useEffect(() => {
    if(error){
      alert.error(error)
      dispatch(clearErrors())
    }
    dispatch(getProduct())
  }, [dispatch, error,alert]);

  return <Fragment>
    {loading ? <Loader />: <>
      <MetaData title="Fares Tech" />
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
        {products && products.map(product => (
          <Product product={product} key={product._id} />
        ))}
      </div>
    </>}
  </Fragment>
}

export default Home;