export interface TeamMember {
  id: string;
  name: string;
  title: string;
  role: string;
  image: string;
  bio: string;
  email: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Pastor John Mwesigwa',
    title: 'Senior Pastor',
    role: 'Spiritual Leadership & Vision',
    image: '/images/team-pastor-john.jpg',
    bio: 'Pastor John has been serving at TGM for over 10 years, leading with wisdom and compassion. He is passionate about connecting hearts to God\'s grace and building a strong community of believers.',
    email: 'pastor.john@tgmchurch.org'
  },
  {
    id: '2',
    name: 'Pastor Sarah Nakato',
    title: 'Associate Pastor',
    role: 'Women Ministry & Discipleship',
    image: '/images/team-pastor-sarah.jpg',
    bio: 'Pastor Sarah brings warmth and dedication to her ministry, focusing on women\'s spiritual growth and community discipleship. She has a heart for mentoring and nurturing believers.',
    email: 'pastor.sarah@tgmchurch.org'
  },
  {
    id: '3',
    name: 'Pastor David Kato',
    title: 'Youth Pastor',
    role: 'Youth Ministry & Evangelism',
    image: '/images/team-pastor-david.jpg',
    bio: 'Pastor David is passionate about reaching the next generation for Christ. He leads our youth ministry with energy and creativity, helping young people discover their purpose in God.',
    email: 'pastor.david@tgmchurch.org'
  },
  {
    id: '4',
    name: 'Grace Mbabazi',
    title: 'Children Ministry Director',
    role: 'Children Ministry & Education',
    image: '/images/team-grace.jpg',
    bio: 'Grace has a special gift for working with children and creating engaging programs that help them learn about Jesus in fun and meaningful ways.',
    email: 'grace@tgmchurch.org'
  },
  {
    id: '5',
    name: 'Michael Ssemwogerere',
    title: 'Worship Leader',
    role: 'Music & Worship',
    image: '/images/team-michael.jpg',
    bio: 'Michael leads our worship team with passion and excellence, creating an atmosphere where people can connect with God through music and praise.',
    email: 'michael@tgmchurch.org'
  }
];
