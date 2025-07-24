export const mockData = {
  dashboard: {
    expenses: [
      { name: 'Housing', value: 1500, percentage: 40 },
      { name: 'Food', value: 600, percentage: 16 },
      { name: 'Transportation', value: 450, percentage: 12 },
      { name: 'Entertainment', value: 300, percentage: 8 },
      { name: 'Other', value: 900, percentage: 24 }
    ],
    assets: [
      { name: 'Savings', value: 25000, percentage: 45 },
      { name: 'Investments', value: 20000, percentage: 36 },
      { name: 'Real Estate', value: 8000, percentage: 14 },
      { name: 'Other', value: 3000, percentage: 5 }
    ],
    liabilities: [
      { name: 'Credit Cards', value: 5000, percentage: 50 },
      { name: 'Student Loan', value: 3000, percentage: 30 },
      { name: 'Auto Loan', value: 2000, percentage: 20 }
    ],
    incomeStreams: [
      { source: 'Salary', amount: 5500 },
      { source: 'Freelance', amount: 800 },
      { source: 'Investments', amount: 200 }
    ],
    accounts: [
      { name: 'Checking', type: 'Bank of America', balance: 3500 },
      { name: 'Savings', type: 'Chase', balance: 25000 },
      { name: 'Investment', type: 'Fidelity', balance: 20000 },
      { name: 'Credit Card', type: 'Chase Sapphire', balance: -2500 }
    ],
    recentActivity: [
      { description: 'Salary Deposit', amount: 5500, date: '2 days ago' },
      { description: 'Grocery Store', amount: -150, date: '3 days ago' },
      { description: 'Gas Station', amount: -45, date: '4 days ago' },
      { description: 'Netflix Subscription', amount: -15, date: '5 days ago' },
      { description: 'Investment Dividend', amount: 75, date: '1 week ago' }
    ]
  },
  pecuniaScore: {
    current: 782,
    change: 12,
    trend: 'up'
  },
  goals: {
    personal: [
      {
        id: 1,
        title: 'Emergency Fund',
        target: 15000,
        current: 8500,
        deadline: '2025-12-31',
        category: 'Safety',
        description: '6 months of expenses saved'
      },
      {
        id: 2,
        title: 'Dream Vacation',
        target: 5000,
        current: 2300,
        deadline: '2025-08-15',
        category: 'Lifestyle',
        description: 'Europe trip for 2 weeks'
      },
      {
        id: 3,
        title: 'New Car',
        target: 25000,
        current: 12000,
        deadline: '2026-06-01',
        category: 'Transportation',
        description: 'Tesla Model 3 down payment'
      }
    ],
    group: [
      {
        id: 1,
        title: 'House Down Payment',
        target: 80000,
        current: 35000,
        deadline: '2026-12-31',
        members: ['John', 'Sarah'],
        contributions: {
          'John': 18000,
          'Sarah': 17000
        }
      }
    ]
  },
  feed: [
    {
      id: 1,
      user: 'Alex Thompson',
      avatar: '/api/placeholder/40/40',
      time: '2 hours ago',
      content: 'Just hit my savings goal for Q1! 🎯 The key was automating my transfers.',
      likes: 24,
      comments: 8,
      ticker: '$AAPL',
      stockPrice: '+2.3%'
    },
    {
      id: 2,
      user: 'Maria Garcia',
      avatar: '/api/placeholder/40/40',
      time: '4 hours ago',
      content: 'Anyone else seeing great returns on $TSLA this month? Up 15% in my portfolio!',
      likes: 18,
      comments: 12,
      ticker: '$TSLA',
      stockPrice: '+15.2%'
    },
    {
      id: 3,
      user: 'Investment Group',
      avatar: '/api/placeholder/40/40',
      time: '6 hours ago',
      content: 'Monthly meetup this Friday! We\'ll discuss Q2 investment strategies and portfolio rebalancing.',
      likes: 45,
      comments: 23,
      isGroup: true
    }
  ],
  plans: [
    {
      id: 1,
      title: 'Weekend Getaway to Napa Valley',
      image: '/api/placeholder/300/200',
      estimatedBudget: 850,
      vibe: 'Relaxing',
      description: 'Wine tasting and scenic views'
    },
    {
      id: 2,
      title: 'Tech Conference in Austin',
      image: '/api/placeholder/300/200',
      estimatedBudget: 1200,
      vibe: 'Professional',
      description: 'Networking and learning opportunities'
    },
    {
      id: 3,
      title: 'Family Reunion in Chicago',
      image: '/api/placeholder/300/200',
      estimatedBudget: 600,
      vibe: 'Family',
      description: 'Quality time with loved ones'
    }
  ],
  profile: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 2024',
    pecuniaScore: 782,
    posts: 24,
    followers: 156,
    following: 89,
    lending: {
      available: true,
      maxAmount: 5000,
      interestRate: 3.5,
      requests: [
        {
          id: 1,
          requester: 'Sarah Smith',
          amount: 2000,
          purpose: 'Emergency car repair',
          requestDate: '2025-01-10',
          creditScore: 720
        }
      ],
      history: [
        {
          id: 1,
          borrower: 'Mike Johnson',
          amount: 1500,
          status: 'Completed',
          returnDate: '2024-12-15',
          interestEarned: 45
        }
      ]
    }
  },
  compare: {
    friends: [
      { name: 'Alex Thompson', netWorth: 125000, savingsRate: 25, score: 798 },
      { name: 'Maria Garcia', netWorth: 98000, savingsRate: 22, score: 745 },
      { name: 'David Kim', netWorth: 156000, savingsRate: 30, score: 820 }
    ],
    public: {
      avgNetWorth: 89000,
      avgSavingsRate: 18,
      avgScore: 680
    }
  }
};