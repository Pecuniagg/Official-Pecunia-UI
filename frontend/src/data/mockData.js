export const mockData = {
  dashboard: {
    expenses: [
      { name: 'Housing', value: 1500, percentage: 40, trend: 'up', trendValue: '2.3%', insight: 'Housing costs are within healthy range but trending up' },
      { name: 'Food', value: 600, percentage: 16, trend: 'down', trendValue: '1.2%', insight: 'Great job reducing food expenses this month' },
      { name: 'Transportation', value: 450, percentage: 12, trend: 'up', trendValue: '5.1%', insight: 'Transportation costs increased - consider carpooling' },
      { name: 'Entertainment', value: 300, percentage: 8, trend: 'up', trendValue: '3.4%', insight: 'Entertainment spending is reasonable but trending up' },
      { name: 'Other', value: 900, percentage: 24, trend: 'down', trendValue: '0.8%', insight: 'Other expenses are well-controlled' }
    ],
    assets: [
      { name: 'Savings', value: 25000, percentage: 45, trend: 'up', trendValue: '4.2%', insight: 'Excellent savings growth rate' },
      { name: 'Investments', value: 20000, percentage: 36, trend: 'up', trendValue: '6.1%', insight: 'Strong investment performance' },
      { name: 'Real Estate', value: 8000, percentage: 14, trend: 'up', trendValue: '1.5%', insight: 'Real estate value appreciation' },
      { name: 'Other', value: 3000, percentage: 5, trend: 'down', trendValue: '0.3%', insight: 'Other assets remain stable' }
    ],
    liabilities: [
      { name: 'Credit Cards', value: 5000, percentage: 50, trend: 'down', trendValue: '2.1%', insight: 'Good progress on credit card debt' },
      { name: 'Student Loan', value: 3000, percentage: 30, trend: 'down', trendValue: '1.8%', insight: 'Steady student loan payments' },
      { name: 'Auto Loan', value: 2000, percentage: 20, trend: 'down', trendValue: '3.2%', insight: 'Auto loan on track for early payoff' }
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
      image: 'https://images.unsplash.com/photo-1701622420355-aabbe1901e81?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxuYXBhJTIwdmFsbGV5JTIwdmluZXlhcmR8ZW58MHx8fHwxNzUzMzkxNjAxfDA&ixlib=rb-4.1.0&q=85',
      estimatedBudget: 850,
      vibe: 'Relaxing',
      description: 'Wine tasting and scenic views'
    },
    {
      id: 2,
      title: 'Tech Conference in Austin',
      image: 'https://images.unsplash.com/photo-1560439514-0fc9d2cd5e1b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29uZmVyZW5jZSUyMGF1c3RpbnxlbnwwfHx8fDE3NTMzOTE2MDh8MA&ixlib=rb-4.1.0&q=85',
      estimatedBudget: 1200,
      vibe: 'Professional',
      description: 'Networking and learning opportunities'
    },
    {
      id: 3,
      title: 'Family Reunion in Chicago',
      image: 'https://images.unsplash.com/photo-1559939357-776190030f3b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjByZXVuaW9uJTIwY2hpY2Fnb3xlbnwwfHx8fDE3NTMzOTE2MTV8MA&ixlib=rb-4.1.0&q=85',
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
    posts: [
      {
        id: 1,
        author: 'John Doe',
        content: 'Just achieved my savings goal of $10,000! The 50/30/20 budgeting rule really works.',
        time: '2 hours ago',
        likes: 24,
        comments: 5,
        avatar: '/api/placeholder/40/40'
      },
      {
        id: 2,
        author: 'John Doe',
        content: 'Invested in index funds this month. Diversification is key to long-term growth.',
        time: '1 day ago',
        likes: 18,
        comments: 3,
        avatar: '/api/placeholder/40/40'
      },
      {
        id: 3,
        author: 'John Doe',
        content: 'Emergency fund complete! Having 6 months of expenses saved gives me peace of mind.',
        time: '3 days ago',
        likes: 32,
        comments: 8,
        avatar: '/api/placeholder/40/40'
      }
    ],
    followers: 156,
    following: 89,
    lending: {
      available: true,
      maxAmount: 5000,
      interestRate: 3.5,
      totalLent: 12500,
      activeLoan: 2,
      rating: 4.8,
      requests: [
        {
          id: 1,
          name: 'Sarah Smith',
          amount: 2000,
          reason: 'Emergency car repair',
          duration: '6 months',
          interest: 3.5,
          avatar: '/api/placeholder/40/40'
        },
        {
          id: 2,
          name: 'Mike Johnson',
          amount: 1500,
          reason: 'Medical expenses',
          duration: '4 months',
          interest: 4.0,
          avatar: '/api/placeholder/40/40'
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