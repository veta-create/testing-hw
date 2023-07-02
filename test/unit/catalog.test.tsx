import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, screen, waitFor, within } from '@testing-library/react';
import { Catalog } from '../../src/client/pages/Catalog';
import { BrowserRouter } from 'react-router-dom';
import { ProductDetails } from '../../src/client/components/ProductDetails';
import { ProductItem } from '../../src/client/components/ProductItem';
import '@testing-library/jest-dom'

// **Каталог:**
// +++ в каталоге должны отображаться товары, список которых приходит с сервера
// +++ для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре
// +++ на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"

const initialState = {
  products: [
    {
        "id": 0,
        "name": "Licensed Fish",
        "price": 635
    },
    {
        "id": 1,
        "name": "Handmade Shoes",
        "price": 136
    },
    {
        "id": 2,
        "name": "Sleek Keyboard",
        "price": 120
    },
  ],
  details: {
      0: {
          id: 0,
          name: 'Tasty Fish',
          description: 'Tasty Fish from Kuban river',
          price: 100,
          color: 'grey',
          material: 'meat',
      },
      1: {
          id: 1,
          name: '',
          description: '',
          price: '',
          color: '',
          material: '',
      }
  },
  cart: {}
};

describe('Каталог', () => {
  it('Отображает товары, список которых приходит с сервера', async () => {
    const store = createStore(() => initialState);
    const basename = '/hw/store';

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );

    const { container } = render(application);

    expect(container.getElementsByClassName('ProductItem').length).toBe(initialState.products.length);
  });

  it('Для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async () => {
    const store = createStore(() => initialState);
    const basename = '/hw/store';

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );

    const { container } = render(application);

    const products = within(container).getAllByTestId(/\d+/);


    for(const product of products) {
      const title = product.querySelector('.card-title');
      const price = product.querySelector('.card-text');
      const link = product.querySelector('.card-link');

      expect(title).toBeTruthy();
      expect(price).toBeTruthy();
      expect(link).toBeTruthy();
    }

    console.log(products);
  });

  it('На странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"', async () => {
    const store = createStore(() => initialState);
    const basename = '/hw/store';

    const product = initialState.details[0];

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <ProductDetails product={product}/>
          <ProductItem product={product}/>
        </Provider>
      </BrowserRouter>
    );

    const { container } = render(application);

    const title = screen.getByText('Tasty Fish', { selector: 'h1' });
    const description = screen.getByText('Tasty Fish from Kuban river');
    const price = container.querySelector('.ProductDetails-Price');
    const color = screen.getByText('grey');
    const material = screen.getByText('meat');
    const addToCartButton = screen.getByText('Add to Cart', { selector: 'button' });

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(price?.textContent).toBe('$100');
    expect(color).toBeInTheDocument();
    expect(material).toBeInTheDocument();
    expect(addToCartButton).toBeInTheDocument();
  });
});
