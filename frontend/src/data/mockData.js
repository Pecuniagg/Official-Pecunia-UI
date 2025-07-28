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
      author: 'John Doe',
      avatar: '/api/placeholder/40/40',
      time: '2 hours ago',
      content: 'Just hit my $10K savings goal! The compound interest is really starting to show. #FinancialGoals',
      likes: 24,
      comments: 8,
      ticker: '$AAPL',
      stockPrice: '+2.3%',
      mentions: ['AAPL']
    },
    {
      id: 2,
      author: 'Maria Garcia',
      avatar: '/api/placeholder/40/40',
      time: '4 hours ago',
      content: 'Anyone else seeing great returns on $TSLA this month? Up 15% in my portfolio!',
      likes: 18,
      comments: 12,
      ticker: '$TSLA',
      stockPrice: '+15.2%',
      mentions: ['TSLA']
    },
    {
      id: 3,
      author: 'Investment Group',
      avatar: '/api/placeholder/40/40',
      time: '6 hours ago',
      content: 'Monthly meetup this Friday! We\'ll discuss Q2 investment strategies and portfolio rebalancing.',
      likes: 45,
      comments: 23,
      mentions: [],
      isGroup: true
    },
    {
      id: 4,
      author: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      time: '8 hours ago',
      content: 'Emergency fund complete! Having 6 months of expenses saved gives me such peace of mind.',
      likes: 32,
      comments: 15,
      mentions: []
    },
    {
      id: 5,
      author: 'Mike Thompson',
      avatar: '/api/placeholder/40/40',
      time: '1 day ago',
      content: 'Just diversified my portfolio with some international ETFs. Spreading risk is key!',
      likes: 27,
      comments: 9,
      ticker: '$VTI',
      stockPrice: '+1.8%',
      mentions: ['VTI']
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
    avatar: '/api/placeholder/100/100',
    title: 'Senior Financial Analyst',
    joinDate: 'January 2024',
    pecuniaScore: 782,
    rating: 4.8,
    level: 7,
    netWorth: 125000,
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
          term: '6 months',
          duration: '6 months',
          interest: 3.5,
          riskLevel: 'Low Risk',
          avatar: '/api/placeholder/40/40'
        },
        {
          id: 2,
          name: 'Mike Johnson',
          amount: 1500,
          reason: 'Medical expenses',
          term: '4 months',
          duration: '4 months',
          interest: 4.0,
          riskLevel: 'Medium Risk',
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
      { 
        name: 'Alex Thompson', 
        netWorth: '$125K', 
        growth: '+8.2%',
        savingsRate: 25, 
        score: 798 
      },
      { 
        name: 'Maria Garcia', 
        netWorth: '$98K', 
        growth: '+6.1%',
        savingsRate: 22, 
        score: 745 
      },
      { 
        name: 'David Kim', 
        netWorth: '$156K', 
        growth: '+12.3%',
        savingsRate: 30, 
        score: 820 
      }
    ],
    metrics: [
      {
        category: 'Net Worth',
        yourScore: 85,
        average: 68,
        ranking: 25,
        trend: 'up',
        comparison: 'Avg'
      },
      {
        category: 'Investments',
        yourScore: 92,
        average: 74,
        ranking: 15,
        trend: 'up',
        comparison: 'Avg'
      },
      {
        category: 'Savings Rate',
        yourScore: 78,
        average: 62,
        ranking: 35,
        trend: 'up',
        comparison: 'Avg'
      },
      {
        category: 'Debt Management',
        yourScore: 88,
        average: 71,
        ranking: 20,
        trend: 'up',
        comparison: 'Avg'
      }
    ],
    public: {
      avgNetWorth: 89000,
      avgSavingsRate: 18,
      avgScore: 680
    }
  },

  popularTickers: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '185.23', change: 2.1 },
    { symbol: 'MSFT', name: 'Microsoft', price: '378.45', change: 1.8 },
    { symbol: 'TSLA', name: 'Tesla', price: '248.50', change: -0.5 },
    { symbol: 'NVDA', name: 'NVIDIA', price: '415.22', change: 3.2 },
    { symbol: 'AMZN', name: 'Amazon', price: '143.75', change: 1.1 }
  ],
  associates: [
    { 
      name: 'John Smith', 
      avatar: '/api/placeholder/40/40', 
      status: 'Investing in crypto', 
      online: true 
    },
    { 
      name: 'Emma Davis', 
      avatar: '/api/placeholder/40/40', 
      status: 'Building emergency fund', 
      online: false 
    },
    { 
      name: 'Alex Wilson', 
      avatar: '/api/placeholder/40/40', 
      status: 'Real estate research', 
      online: true 
    },
    { 
      name: 'Lisa Brown', 
      avatar: '/api/placeholder/40/40', 
      status: 'Retirement planning', 
      online: true 
    }
  ],
  tips: [
    {
      title: 'Emergency Fund Priority',
      content: 'Build 3-6 months of expenses in a high-yield savings account before investing heavily in stocks.'
    },
    {
      title: 'Dollar-Cost Averaging',
      content: 'Invest consistently every month regardless of market conditions to reduce timing risk.'
    },
    {
      title: 'Credit Score Boost',
      content: 'Keep credit utilization below 30% and pay bills on time to maintain excellent credit.'
    }
  ]
};