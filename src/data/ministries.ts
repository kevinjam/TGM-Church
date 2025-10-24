export interface Ministry {
  id: string;
  name: string;
  description: string;
  cta?: string;
}

export const ministries: Ministry[] = [
  {
    id: '1',
    name: 'Youth of Grace (YOG) Ministry',
    description: 'Empowering young people to live boldly for Christ! Our Youth Ministry creates dynamic spaces where teens encounter God\'s grace through worship, relevant teaching, and authentic community. We equip youth to transform their schools, homes, and communities with confidence.'
  },
  {
    id: '2',
    name: 'Men of Grace (MOG) Ministry',
    description: 'Building strong Christian men who lead with integrity! Through small groups, mentorship, and outdoor adventures, we challenge brothers to grow spiritually and fight for purity. Whether navigating fatherhood, career, or personal struggles, this is your tribe.'
  },
  {
    id: '3',
    name: 'Women of Grace (WOG) Ministry',
    description: 'A safe sisterhood where women discover their God-given design! Through Bible studies, prayer nights, and service projects, we embrace Titus 2\'s call to teach what is good. Find laughter, tears, and unwavering support as we approach God\'s throne together.',
    cta: 'Thursdays at 6 PM: Come as you are, leave transformed.'
  },
  {
    id: '4',
    name: 'Marrieds of Grace Ministry',
    description: 'Strengthening couples through biblical teaching and mentorship! Whether you\'re newlyweds or celebrating decades together, find practical tools to communicate, forgive, and keep God at the center. When marriages thrive, families flourish!',
    cta: 'Date Night & Devotion: Monthly gatherings—childcare provided!'
  },
  {
    id: '5',
    name: 'Children of Grace (COG) Ministry',
    description: 'Introducing kids to God\'s love through interactive lessons and worship! Every Sunday, we create a joyful environment where young hearts learn to trust Jesus, pray boldly, and love others. Even the smallest hands are lifted high in praise!',
    cta: 'Parents: Check-in opens 15 minutes before service!'
  },
  {
    id: '6',
    name: 'Schools Ministry',
    description: 'Bringing God\'s truth into classrooms through mentorship and chaplaincy! We partner with local schools to equip teachers with Christ-like leadership and empower students to stand firm in their faith. From weekly Bible clubs to crisis support, we bridge the gap between faith and education.',
    cta: 'Teachers/Volunteers: Join our \'Adopt-a-School\' prayer team! Students: Dive into our after-school Bible clubs every Wednesday at 3 PM.'
  }
];
