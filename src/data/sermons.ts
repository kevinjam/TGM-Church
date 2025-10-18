export interface Sermon {
  id: string
  title: string
  speaker: string
  date: string
  description: string
  category: string
  scripture?: string
  thumbnail?: string
  youtubeUrl?: string
  audioUrl?: string
  castboxUrl?: string
  castboxEmbedUrl?: string
  duration?: string
  type: 'video' | 'audio' | 'both'
}

export const sermons: Sermon[] = [
  // Video Sermons
  {
    id: '1',
    title: 'Walking in Grace',
    speaker: 'Pastor John Smith',
    date: 'October 15, 2024',
    description: 'Discover how to walk daily in the grace of God and experience His transforming power in your life.',
    category: 'Sunday Service',
    scripture: 'Ephesians 2:8-9',
    thumbnail: '/images/sermons/walking-in-grace.jpg',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'video',
    duration: '45:30'
  },
  {
    id: '2',
    title: 'The Power of Faith',
    speaker: 'Pastor Sarah Johnson',
    date: 'October 8, 2024',
    description: 'Understanding how faith moves mountains and transforms impossible situations into testimonies.',
    category: 'Sunday Service',
    scripture: 'Hebrews 11:1',
    thumbnail: '/images/sermons/power-of-faith.jpg',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'video',
    duration: '42:15'
  },
  {
    id: '3',
    title: 'Living in Victory',
    speaker: 'Pastor Michael Brown',
    date: 'October 1, 2024',
    description: 'Learn how to live a victorious Christian life through the power of the Holy Spirit.',
    category: 'Sunday Service',
    scripture: '1 Corinthians 15:57',
    thumbnail: '/images/sermons/living-in-victory.jpg',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'video',
    duration: '38:45'
  },
  {
    id: '4',
    title: 'The Love of God',
    speaker: 'Pastor Emily Davis',
    date: 'September 24, 2024',
    description: 'Exploring the depth and breadth of God\'s unconditional love for His children.',
    category: 'Bible Study',
    scripture: 'Romans 8:38-39',
    thumbnail: '/images/sermons/love-of-god.jpg',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'video',
    duration: '35:20'
  },
  {
    id: '5',
    title: 'Youth Revival Night',
    speaker: 'Pastor David Wilson',
    date: 'September 20, 2024',
    description: 'A powerful message for the next generation about their purpose and calling in Christ.',
    category: 'Youth',
    scripture: '1 Timothy 4:12',
    thumbnail: '/images/sermons/youth-revival.jpg',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'video',
    duration: '50:10'
  },
  {
    id: '6',
    title: 'Worship and Praise',
    speaker: 'Pastor Lisa Anderson',
    date: 'September 17, 2024',
    description: 'Understanding the importance of worship and praise in our daily walk with God.',
    category: 'Worship',
    scripture: 'Psalm 100:1-2',
    thumbnail: '/images/sermons/worship-praise.jpg',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'video',
    duration: '41:25'
  },

  // Audio Sermons (Castbox Integration)
  {
    id: '7',
    title: 'The Power of Grace',
    speaker: 'Pastor John Smith',
    date: 'October 12, 2024',
    description: 'An in-depth study of how grace transforms our lives and empowers us to live for Christ.',
    category: 'Sunday Service',
    scripture: 'Titus 2:11-12',
    castboxUrl: 'https://castbox.fm/episode/The-Power-of-Grace-id1234567',
    castboxEmbedUrl: 'https://castbox.fm/embed/episode/The-Power-of-Grace-id1234567',
    type: 'audio',
    duration: '43:15'
  },
  {
    id: '8',
    title: 'Faith That Moves Mountains',
    speaker: 'Pastor Sarah Johnson',
    date: 'October 5, 2024',
    description: 'Learning to develop unshakeable faith that can move any mountain in your life.',
    category: 'Sunday Service',
    scripture: 'Matthew 17:20',
    castboxUrl: 'https://castbox.fm/episode/Faith-That-Moves-Mountains-id1234568',
    castboxEmbedUrl: 'https://castbox.fm/embed/episode/Faith-That-Moves-Mountains-id1234568',
    type: 'audio',
    duration: '39:30'
  },
  {
    id: '9',
    title: 'The Joy of Salvation',
    speaker: 'Pastor Michael Brown',
    date: 'September 28, 2024',
    description: 'Discovering the true joy that comes from knowing Jesus Christ as your personal Savior.',
    category: 'Sunday Service',
    scripture: 'Psalm 51:12',
    castboxUrl: 'https://castbox.fm/episode/The-Joy-of-Salvation-id1234569',
    castboxEmbedUrl: 'https://castbox.fm/embed/episode/The-Joy-of-Salvation-id1234569',
    type: 'audio',
    duration: '36:45'
  },
  {
    id: '10',
    title: 'Walking in the Spirit',
    speaker: 'Pastor Emily Davis',
    date: 'September 21, 2024',
    description: 'Understanding how to walk daily in the power and guidance of the Holy Spirit.',
    category: 'Bible Study',
    scripture: 'Galatians 5:16',
    castboxUrl: 'https://castbox.fm/episode/Walking-in-the-Spirit-id1234570',
    castboxEmbedUrl: 'https://castbox.fm/embed/episode/Walking-in-the-Spirit-id1234570',
    type: 'audio',
    duration: '44:20'
  },
  {
    id: '11',
    title: 'Youth Leadership',
    speaker: 'Pastor David Wilson',
    date: 'September 18, 2024',
    description: 'Empowering young people to become leaders in their generation for Christ.',
    category: 'Youth',
    scripture: '1 Timothy 4:12',
    castboxUrl: 'https://castbox.fm/episode/Youth-Leadership-id1234571',
    castboxEmbedUrl: 'https://castbox.fm/embed/episode/Youth-Leadership-id1234571',
    type: 'audio',
    duration: '37:55'
  },
  {
    id: '12',
    title: 'The Heart of Worship',
    speaker: 'Pastor Lisa Anderson',
    date: 'September 14, 2024',
    description: 'Understanding what true worship means and how to worship God in spirit and truth.',
    category: 'Worship',
    scripture: 'John 4:24',
    castboxUrl: 'https://castbox.fm/episode/The-Heart-of-Worship-id1234572',
    castboxEmbedUrl: 'https://castbox.fm/embed/episode/The-Heart-of-Worship-id1234572',
    type: 'audio',
    duration: '40:10'
  },

  // Both Video and Audio
  {
    id: '13',
    title: 'Connecting Hearts to His Grace',
    speaker: 'Pastor John Smith',
    date: 'October 1, 2024',
    description: 'Our foundational message about connecting hearts to God\'s throne of grace.',
    category: 'Sunday Service',
    scripture: 'Hebrews 4:16',
    thumbnail: '/images/sermons/connecting-hearts.jpg',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    castboxUrl: 'https://castbox.fm/episode/Connecting-Hearts-to-His-Grace-id1234573',
    castboxEmbedUrl: 'https://castbox.fm/embed/episode/Connecting-Hearts-to-His-Grace-id1234573',
    type: 'both',
    duration: '46:30'
  }
]

export const categories = [
  'All',
  'Sunday Service',
  'Bible Study',
  'Youth',
  'Worship'
]

export const getSermonsByCategory = (category: string) => {
  if (category === 'All') return sermons
  return sermons.filter(sermon => sermon.category === category)
}

export const getVideoSermons = () => {
  return sermons.filter(sermon => sermon.type === 'video' || sermon.type === 'both')
}

export const getAudioSermons = () => {
  return sermons.filter(sermon => sermon.type === 'audio' || sermon.type === 'both')
}