import type { Rate } from '~/types'

const customers: Rate[] = [{
  id: 1,
  key: 1,
  name: 'Стандарт',
  type: 'rate',
  price: 10000,
  restrictions: [
    {
      id: 57,
      name: 'Closed',
      type: 'restriction',
      values: {
        '03_04_25': true, '04_04_25': true
      },
    },
    {
      id: 55,
      name: 'MinLOS',
      type: 'restriction',
      values: {
        'all': 2,
      },
    },
  ],
  children: [{
    id: 101,
    key: 101,
    name: 'STD',
    type: 'category',
    parent: 1,
    restrictions: [
      {
        id: 56,
        name: 'MinLOS',
        type: 'restriction',
        values: {
          'all': 2,
          '09_04_25': '▸3'
        },
      }, {
        id: 58,
        name: 'MaxLOS',
        type: 'restriction',
        values: {
          'all': 7,
        },
      }, {
        id: 59,
        name: 'CTA',
        type: 'restriction',
        values: {
          '09_04_25': true
        },
      }, {
        id: 60,
        name: 'CTD',
        type: 'restriction',
        values: {
          '13_04_25': true
        },
      }, {
        id: 61,
        name: 'MinAdvBooking',
        type: 'restriction',
        values: {
          'all': 5
        }
      }, {
        id: 62,
        name: 'MaxAdvBooking',
        type: 'restriction',
        values: {
          'all': 20
        }
      },
    ],
    children: [
      {
        id: 1011,
        name: 4,
        type: 'guest',
        parent: 101,
      },
      {
        id: 1012,
        name: 3,
        type: 'guest',
        parent: 101,
      },
      {
        id: 1013,
        name: 2,
        type: 'guest',
        parent: 101,
      },
      {
        id: 1014,
        name: 1,
        type: 'guest',
        parent: 101,
      },
      {
        id: 1115,
        name: '',
        type: 'extra_guest',
        parent: 101,
      },
    ],
  }, {
    id: 102,
    key: 102,
    name: 'DLX',
    type: 'category',
    parent: 1,
    children: [
      {
        id: 1021,
        name: 4,
        type: 'guest',
      },
      {
        id: 1022,
        name: 3,
        type: 'guest',
      },
      {
        id: 1023,
        name: 2,
        type: 'guest',
      },
      {
        id: 1024,
        name: 1,
        type: 'guest',
      },
      {
        id: 1115,
        name: '',
        type: 'extra_guest',
      },
    ],
  }, {
    id: 11,
    key: 11,
    name: 'Стандарт промо',
    type: 'rate',
    modifiers: {
      type: 'down_prc',
      value: 10,
    },
    children: [{
      id: 111,
      key: 101,
      name: 'STD',
      type: 'category',
      parent: 11,
      children: [
        {
          id: 1111,
          name: 4,
          type: 'guest',
        },
        {
          id: 1112,
          name: 3,
          type: 'guest',
        },
        {
          id: 1113,
          name: 2,
          type: 'guest',
        },
        {
          id: 1114,
          name: 1,
          type: 'guest',
        },
        {
          id: 1115,
          name: '',
          type: 'extra_guest',
        },
      ],
    }, {
      id: 112,
      key: 102,
      name: 'DLX',
      type: 'category',
      parent: 11,
      children: [
        {
          id: 1121,
          name: 4,
          type: 'guest',
        },
        {
          id: 1122,
          name: 3,
          type: 'guest',
        },
        {
          id: 1123,
          name: 2,
          type: 'guest',
        },
        {
          id: 1124,
          name: 1,
          type: 'guest',
        },
        {
          id: 1115,
          name: '',
          type: 'extra_guest',
        },
      ],
    }]
  }],
}]

export default eventHandler(async () => {
  return customers
})
