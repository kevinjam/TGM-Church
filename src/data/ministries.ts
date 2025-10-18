export interface Ministry {
  id: string;
  name: string;
  description: string;
  leader: string;
  contact: string;
  image: string;
  meetingTime: string;
  meetingDay: string;
}

export const ministries: Ministry[] = [
  {
    id: '1',
    name: 'Youth Ministry',
    description: 'Empowering young people to grow in their faith and make a positive impact in their communities.',
    leader: 'Pastor David Kato',
    contact: 'youth@tgmchurch.org',
    image: '/images/ministry-youth.jpg',
    meetingTime: '6:00 PM',
    meetingDay: 'Fridays'
  },
  {
    id: '2',
    name: 'Worship Ministry',
    description: 'Leading the congregation in heartfelt worship and praise through music and song.',
    leader: 'Sarah Nakato',
    contact: 'worship@tgmchurch.org',
    image: '/images/ministry-worship.jpg',
    meetingTime: '7:00 PM',
    meetingDay: 'Thursdays'
  },
  {
    id: '3',
    name: 'Children Ministry',
    description: 'Nurturing children in the love of Christ through fun, interactive, and age-appropriate activities.',
    leader: 'Grace Mbabazi',
    contact: 'children@tgmchurch.org',
    image: '/images/ministry-children.jpg',
    meetingTime: '10:00 AM',
    meetingDay: 'Sundays'
  },
  {
    id: '4',
    name: 'Women Ministry',
    description: 'Supporting and encouraging women in their spiritual journey and daily walk with Christ.',
    leader: 'Pastor Sarah Nakato',
    contact: 'women@tgmchurch.org',
    image: '/images/ministry-women.jpg',
    meetingTime: '2:00 PM',
    meetingDay: 'Saturdays'
  },
  {
    id: '5',
    name: 'Men Ministry',
    description: 'Building strong Christian men who lead with integrity and serve with humility.',
    leader: 'Pastor John Mwesigwa',
    contact: 'men@tgmchurch.org',
    image: '/images/ministry-men.jpg',
    meetingTime: '7:00 PM',
    meetingDay: 'Tuesdays'
  },
  {
    id: '6',
    name: 'Evangelism Ministry',
    description: 'Sharing the Gospel of Jesus Christ with our community and beyond.',
    leader: 'Pastor David Kato',
    contact: 'evangelism@tgmchurch.org',
    image: '/images/ministry-evangelism.jpg',
    meetingTime: '6:00 PM',
    meetingDay: 'Wednesdays'
  }
];
