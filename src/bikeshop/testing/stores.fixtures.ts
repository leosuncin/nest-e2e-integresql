import { Store } from '~bikeshop/store.entity';

export const stores: Store[] = [
  {
    id: 1n,
    name: 'Santa Cruz Bikes',
    phone: '(831) 476-4321',
    email: 'santacruz@bikes.shop',
    street: '3700 Portola Drive',
    city: 'Santa Cruz',
    state: 'CA',
    zipCode: '95060',
  },
  {
    id: 2n,
    name: 'Baldwin Bikes',
    phone: '(516) 379-8888',
    email: 'baldwin@bikes.shop',
    street: '4200 Chestnut Lane',
    city: 'Baldwin',
    state: 'NY',
    zipCode: '11432',
  },
  {
    id: 3n,
    name: 'Rowlett Bikes',
    phone: '(972) 530-5555',
    email: 'rowlett@bikes.shop',
    street: '8000 Fairway Avenue',
    city: 'Rowlett',
    state: 'TX',
    zipCode: '75088',
  },
];
