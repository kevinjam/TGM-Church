export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  image: string;
  category: 'Worship' | 'Fellowship' | 'Outreach' | 'Training' | 'Special';
  isUpcoming: boolean;
}

export const events: Event[] = [
  {
    id: '1',
    title: 'Sunday Service',
    description: 'Join us for our weekly Sunday worship service. We gather to praise God, hear His word, and fellowship together.',
    date: new Date('2024-01-21'),
    time: '10:00 AM',
    location: 'TGM Church, Wakiso Nakawuka',
    image: '/images/event-sunday.jpg',
    category: 'Worship',
    isUpcoming: true
  },
  {
    id: '2',
    title: 'Youth Conference 2024',
    description: 'A powerful conference for young people to grow in their faith and connect with God and each other.',
    date: new Date('2024-02-15'),
    time: '9:00 AM - 5:00 PM',
    location: 'TGM Church, Wakiso Nakawuka',
    image: '/images/event-youth.jpg',
    category: 'Special',
    isUpcoming: true
  },
  {
    id: '3',
    title: 'Community Outreach',
    description: 'Join us as we reach out to our community with love, hope, and practical assistance.',
    date: new Date('2024-01-28'),
    time: '8:00 AM - 2:00 PM',
    location: 'Nakawuka Community Center',
    image: '/images/event-outreach.jpg',
    category: 'Outreach',
    isUpcoming: true
  },
  {
    id: '4',
    title: 'Bible Study - Book of Romans',
    description: 'Deep dive into the Book of Romans with Pastor John. All are welcome to join this enriching study.',
    date: new Date('2024-01-17'),
    time: '7:00 PM',
    location: 'TGM Church, Wakiso Nakawuka',
    image: '/images/event-bible-study.jpg',
    category: 'Training',
    isUpcoming: true
  },
  {
    id: '5',
    title: 'New Year Service',
    description: 'Celebrating the new year with thanksgiving and prayer for God\'s blessings in 2024.',
    date: new Date('2024-01-01'),
    time: '10:00 AM',
    location: 'TGM Church, Wakiso Nakawuka',
    image: '/images/event-new-year.jpg',
    category: 'Special',
    isUpcoming: false
  }
];
