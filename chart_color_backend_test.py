#!/usr/bin/env python3
"""
Chart Color Backend Testing Suite for Pecunia Web App
Focused testing on chart-related endpoints and data structures after chart color updates
"""

import asyncio
import aiohttp
import json
import os
import sys
from datetime import datetime
from typing import Dict, Any, List
import traceback

# Test configuration
BACKEND_URL = "https://0edaf726-afb6-4e0f-ac44-d8dc0f57b767.preview.emergentagent.com/api"
TEST_RESULTS = []

class ChartColorBackendTester:
    def __init__(self):
        self.session = None
        self.base_url = BACKEND_URL
        
    async def setup(self):
        """Initialize test session"""
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            headers={'Content-Type': 'application/json'}
        )
        
    async def cleanup(self):
        """Clean up test session"""
        if self.session:
            await self.session.close()
    
    def log_result(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        TEST_RESULTS.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        
    async def test_dashboard_analytics_chart_data(self):
        """Test dashboard analytics endpoint for chart data structure"""
        try:
            # Create a test user profile with comprehensive financial data
            test_user_id = f"chart_test_user_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            test_profile = {
                "id": test_user_id,
                "name": "Chart Test User",
                "email": "chart.test@example.com",
                "age": 30,
                "monthly_income": 8500,
                "monthly_expenses": 5200,
                "pecunia_score": 785,
                "risk_tolerance": "medium",
                "location": "United States",
                "expenses": {
                    "housing": 2200,
                    "food": 800,
                    "transportation": 600,
                    "entertainment": 400,
                    "utilities": 300,
                    "other": 900
                },
                "assets": {
                    "checking": 8000,
                    "savings": 15000,
                    "investments": 45000
                },
                "liabilities": {
                    "credit_cards": 3500,
                    "student_loans": 12000
                }
            }
            
            # Create profile first
            async with self.session.post(f"{self.base_url}/user/profile", json=test_profile) as profile_response:
                if profile_response.status == 200:
                    # Test dashboard analytics for chart data
                    async with self.session.get(f"{self.base_url}/analytics/dashboard/{test_user_id}") as response:
                        if response.status == 200:
                            data = await response.json()
                            
                            # Verify chart-relevant data structure
                            chart_data_checks = []
                            
                            # Check profile data for charts
                            if "profile" in data and data["profile"]:
                                profile = data["profile"]
                                if "expenses" in profile and isinstance(profile["expenses"], dict):
                                    chart_data_checks.append("✓ Expense data for pie charts")
                                if "assets" in profile and isinstance(profile["assets"], dict):
                                    chart_data_checks.append("✓ Asset data for portfolio charts")
                                if "liabilities" in profile and isinstance(profile["liabilities"], dict):
                                    chart_data_checks.append("✓ Liability data for debt charts")
                                if "monthly_income" in profile and isinstance(profile["monthly_income"], (int, float)):
                                    chart_data_checks.append("✓ Income data for trend charts")
                            
                            # Check AI insights for chart context
                            if "ai_insights" in data and data["ai_insights"]:
                                ai_insights = data["ai_insights"]
                                if "analysis" in ai_insights:
                                    chart_data_checks.append("✓ AI analysis for chart tooltips")
                                if "recommendations_count" in ai_insights:
                                    chart_data_checks.append("✓ Recommendation count for progress charts")
                            
                            # Check goals data for progress charts
                            if "goals" in data and isinstance(data["goals"], list):
                                chart_data_checks.append("✓ Goals data for progress visualization")
                            
                            # Check budget data for comparison charts
                            if "budget" in data and data["budget"]:
                                budget = data["budget"]
                                if "expenses" in budget and isinstance(budget["expenses"], dict):
                                    chart_data_checks.append("✓ Budget data for comparison charts")
                            
                            if len(chart_data_checks) >= 6:
                                self.log_result("Dashboard Analytics Chart Data", True, 
                                              f"Chart data structure verified: {len(chart_data_checks)} data sources available")
                                return True
                            else:
                                self.log_result("Dashboard Analytics Chart Data", False, 
                                              f"Insufficient chart data sources: {chart_data_checks}")
                                return False
                        else:
                            error_text = await response.text()
                            self.log_result("Dashboard Analytics Chart Data", False, f"HTTP {response.status} - {error_text}")
                            return False
                else:
                    self.log_result("Dashboard Analytics Chart Data", False, "Failed to create test profile")
                    return False
        except Exception as e:
            self.log_result("Dashboard Analytics Chart Data", False, f"Chart data test error: {str(e)}")
            return False

    async def test_comprehensive_analysis_chart_data(self):
        """Test comprehensive analysis endpoint for chart-compatible data"""
        try:
            test_data = {
                "monthly_income": 8500,
                "monthly_expenses": 5200,
                "pecunia_score": 785,
                "age": 32,
                "risk_tolerance": "medium",
                "goals": [
                    {"title": "House Down Payment", "target": 80000, "current": 25000},
                    {"title": "Retirement", "target": 1000000, "current": 45000}
                ],
                "investments": {
                    "stocks": 35000,
                    "bonds": 10000,
                    "real_estate": 0
                },
                "location": "United States",
                "expenses": {
                    "housing": 2200,
                    "food": 800,
                    "transportation": 600,
                    "entertainment": 400,
                    "utilities": 300,
                    "other": 900
                },
                "assets": {
                    "checking": 8000,
                    "savings": 15000,
                    "investments": 45000
                },
                "liabilities": {
                    "credit_cards": 3500,
                    "student_loans": 12000
                }
            }
            
            async with self.session.post(f"{self.base_url}/ai/comprehensive-analysis", json=test_data) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Verify chart-compatible data structure
                    chart_compatibility_checks = []
                    
                    # Check for numerical data suitable for charts
                    if "confidence" in data and isinstance(data["confidence"], (int, float)):
                        chart_compatibility_checks.append("✓ Confidence score for gauge charts")
                    
                    if "recommendations_count" in data and isinstance(data["recommendations_count"], int):
                        chart_compatibility_checks.append("✓ Recommendation count for bar charts")
                    
                    if "action_items" in data and isinstance(data["action_items"], list):
                        chart_compatibility_checks.append("✓ Action items for progress tracking")
                    
                    # Check for structured analysis data
                    if "analysis" in data and isinstance(data["analysis"], dict):
                        analysis = data["analysis"]
                        if "market_context" in analysis:
                            chart_compatibility_checks.append("✓ Market context for trend charts")
                        if "investment_strategy" in analysis:
                            chart_compatibility_checks.append("✓ Investment strategy for allocation charts")
                        if "budget_optimization" in analysis:
                            chart_compatibility_checks.append("✓ Budget optimization for comparison charts")
                    
                    if len(chart_compatibility_checks) >= 4:
                        self.log_result("Comprehensive Analysis Chart Data", True, 
                                      f"Chart-compatible data verified: {len(chart_compatibility_checks)} data types")
                        return True
                    else:
                        self.log_result("Comprehensive Analysis Chart Data", False, 
                                      f"Limited chart compatibility: {chart_compatibility_checks}")
                        return False
                else:
                    error_text = await response.text()
                    self.log_result("Comprehensive Analysis Chart Data", False, f"HTTP {response.status} - {error_text}")
                    return False
        except Exception as e:
            self.log_result("Comprehensive Analysis Chart Data", False, f"Analysis chart data error: {str(e)}")
            return False

    async def test_smart_budget_chart_data(self):
        """Test smart budget endpoint for chart visualization data"""
        try:
            test_data = {
                "monthly_income": 7500,
                "expenses": {
                    "housing": 2000,
                    "food": 600,
                    "transportation": 500,
                    "entertainment": 300,
                    "utilities": 250
                },
                "goals": [
                    {"title": "Emergency Fund", "target": 20000, "current": 8000},
                    {"title": "Vacation", "target": 5000, "current": 1200}
                ],
                "location": "United States"
            }
            
            async with self.session.post(f"{self.base_url}/ai/smart-budget", json=test_data) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Verify budget chart data structure
                    budget_chart_checks = []
                    
                    if "budget" in data and isinstance(data["budget"], dict):
                        budget = data["budget"]
                        # Check for category-based data suitable for pie/bar charts
                        if "categories" in budget and isinstance(budget["categories"], dict):
                            budget_chart_checks.append("✓ Budget categories for pie charts")
                        
                        # Check for percentage data
                        for key, value in budget.items():
                            if isinstance(value, dict) and "percentage" in value:
                                budget_chart_checks.append("✓ Percentage data for chart visualization")
                                break
                    
                    if "savings_rate" in data and isinstance(data["savings_rate"], (int, float)):
                        budget_chart_checks.append("✓ Savings rate for progress charts")
                    
                    if "optimization_score" in data and isinstance(data["optimization_score"], (int, float)):
                        budget_chart_checks.append("✓ Optimization score for gauge charts")
                    
                    if "total_income" in data and isinstance(data["total_income"], (int, float)):
                        budget_chart_checks.append("✓ Total income for comparison charts")
                    
                    # Check for cost-cutting strategies (chart annotations)
                    if "cost_cutting" in data and isinstance(data["cost_cutting"], list):
                        budget_chart_checks.append("✓ Cost-cutting data for chart annotations")
                    
                    if len(budget_chart_checks) >= 4:
                        self.log_result("Smart Budget Chart Data", True, 
                                      f"Budget chart data verified: {len(budget_chart_checks)} chart elements")
                        return True
                    else:
                        self.log_result("Smart Budget Chart Data", False, 
                                      f"Limited budget chart data: {budget_chart_checks}")
                        return False
                else:
                    error_text = await response.text()
                    self.log_result("Smart Budget Chart Data", False, f"HTTP {response.status} - {error_text}")
                    return False
        except Exception as e:
            self.log_result("Smart Budget Chart Data", False, f"Budget chart data error: {str(e)}")
            return False

    async def test_investment_strategy_chart_data(self):
        """Test investment strategy endpoint for portfolio chart data"""
        try:
            test_data = {
                "investable_amount": 25000,
                "risk_tolerance": "medium",
                "age": 35,
                "timeline": "15+ years"
            }
            
            async with self.session.post(f"{self.base_url}/ai/investment-strategy", json=test_data) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Verify investment chart data structure
                    investment_chart_checks = []
                    
                    if "strategy" in data and isinstance(data["strategy"], dict):
                        strategy = data["strategy"]
                        
                        # Check for asset allocation data (pie charts)
                        if "asset_allocation" in strategy and isinstance(strategy["asset_allocation"], dict):
                            investment_chart_checks.append("✓ Asset allocation for pie charts")
                        
                        # Check for ETF recommendations (bar charts)
                        if "etf_recommendations" in strategy and isinstance(strategy["etf_recommendations"], list):
                            investment_chart_checks.append("✓ ETF recommendations for comparison charts")
                    
                    if "risk_score" in data and isinstance(data["risk_score"], (int, float)):
                        investment_chart_checks.append("✓ Risk score for gauge charts")
                    
                    if "expected_return" in data and isinstance(data["expected_return"], (int, float)):
                        investment_chart_checks.append("✓ Expected return for performance charts")
                    
                    if "rebalance_frequency" in data:
                        investment_chart_checks.append("✓ Rebalance frequency for timeline charts")
                    
                    # Check for quarterly data (line charts)
                    if "quarterly_review" in data:
                        investment_chart_checks.append("✓ Quarterly data for trend charts")
                    
                    if len(investment_chart_checks) >= 4:
                        self.log_result("Investment Strategy Chart Data", True, 
                                      f"Investment chart data verified: {len(investment_chart_checks)} chart types")
                        return True
                    else:
                        self.log_result("Investment Strategy Chart Data", False, 
                                      f"Limited investment chart data: {investment_chart_checks}")
                        return False
                else:
                    error_text = await response.text()
                    self.log_result("Investment Strategy Chart Data", False, f"HTTP {response.status} - {error_text}")
                    return False
        except Exception as e:
            self.log_result("Investment Strategy Chart Data", False, f"Investment chart data error: {str(e)}")
            return False

    async def test_competitive_insights_chart_data(self):
        """Test competitive insights endpoint for comparison chart data"""
        try:
            test_data = {
                "age": 30,
                "income": 85000,
                "net_worth": 125000,
                "pecunia_score": 750,
                "location": "United States"
            }
            
            async with self.session.post(f"{self.base_url}/ai/competitive-insights", json=test_data) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Verify competitive chart data structure
                    competitive_chart_checks = []
                    
                    if "percentile_ranking" in data and isinstance(data["percentile_ranking"], (int, float)):
                        competitive_chart_checks.append("✓ Percentile ranking for comparison charts")
                    
                    if "improvement_potential" in data and isinstance(data["improvement_potential"], (int, float)):
                        competitive_chart_checks.append("✓ Improvement potential for progress charts")
                    
                    if "competitive_score" in data and isinstance(data["competitive_score"], (int, float)):
                        competitive_chart_checks.append("✓ Competitive score for gauge charts")
                    
                    if "insights" in data and isinstance(data["insights"], dict):
                        insights = data["insights"]
                        
                        # Check for peer comparison data
                        if "peer_comparison" in insights:
                            competitive_chart_checks.append("✓ Peer comparison for bar charts")
                        
                        # Check for market opportunities
                        if "market_opportunities" in insights:
                            competitive_chart_checks.append("✓ Market opportunities for radar charts")
                        
                        # Check for score improvement plan
                        if "score_improvement" in insights:
                            competitive_chart_checks.append("✓ Score improvement for timeline charts")
                    
                    if len(competitive_chart_checks) >= 4:
                        self.log_result("Competitive Insights Chart Data", True, 
                                      f"Competitive chart data verified: {len(competitive_chart_checks)} comparison metrics")
                        return True
                    else:
                        self.log_result("Competitive Insights Chart Data", False, 
                                      f"Limited competitive chart data: {competitive_chart_checks}")
                        return False
                else:
                    error_text = await response.text()
                    self.log_result("Competitive Insights Chart Data", False, f"HTTP {response.status} - {error_text}")
                    return False
        except Exception as e:
            self.log_result("Competitive Insights Chart Data", False, f"Competitive chart data error: {str(e)}")
            return False

    async def test_portfolio_optimization_chart_data(self):
        """Test portfolio optimization endpoint for allocation chart data"""
        try:
            test_data = {
                "portfolio_data": {
                    "stocks": {
                        "AAPL": 15000,
                        "GOOGL": 12000,
                        "MSFT": 10000
                    },
                    "bonds": {
                        "treasury_10yr": 8000,
                        "corporate_bonds": 5000
                    },
                    "cash": 3000,
                    "real_estate": 0,
                    "commodities": 2000
                }
            }
            
            async with self.session.post(f"{self.base_url}/ai/portfolio-optimization", json=test_data) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Verify portfolio chart data structure
                    portfolio_chart_checks = []
                    
                    if "current_allocation" in data and isinstance(data["current_allocation"], dict):
                        portfolio_chart_checks.append("✓ Current allocation for pie charts")
                    
                    if "recommended_changes" in data and isinstance(data["recommended_changes"], list):
                        portfolio_chart_checks.append("✓ Recommended changes for comparison charts")
                    
                    if "risk_assessment" in data and isinstance(data["risk_assessment"], dict):
                        risk_assessment = data["risk_assessment"]
                        if "risk_score" in risk_assessment:
                            portfolio_chart_checks.append("✓ Risk score for gauge charts")
                        if "volatility" in risk_assessment:
                            portfolio_chart_checks.append("✓ Volatility data for trend charts")
                    
                    if "optimization" in data and isinstance(data["optimization"], dict):
                        optimization = data["optimization"]
                        if "diversification_score" in optimization:
                            portfolio_chart_checks.append("✓ Diversification score for radar charts")
                        if "tax_optimization" in optimization:
                            portfolio_chart_checks.append("✓ Tax optimization for savings charts")
                    
                    if len(portfolio_chart_checks) >= 4:
                        self.log_result("Portfolio Optimization Chart Data", True, 
                                      f"Portfolio chart data verified: {len(portfolio_chart_checks)} optimization metrics")
                        return True
                    else:
                        self.log_result("Portfolio Optimization Chart Data", False, 
                                      f"Limited portfolio chart data: {portfolio_chart_checks}")
                        return False
                else:
                    error_text = await response.text()
                    self.log_result("Portfolio Optimization Chart Data", False, f"HTTP {response.status} - {error_text}")
                    return False
        except Exception as e:
            self.log_result("Portfolio Optimization Chart Data", False, f"Portfolio chart data error: {str(e)}")
            return False

    async def test_market_insights_chart_data(self):
        """Test market insights endpoint for market trend chart data"""
        try:
            async with self.session.get(f"{self.base_url}/market/insights") as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Verify market chart data structure
                    market_chart_checks = []
                    
                    if "market_summary" in data and isinstance(data["market_summary"], dict):
                        market_summary = data["market_summary"]
                        
                        # Check for percentage changes (line charts)
                        percentage_fields = ["sp500_change", "nasdaq_change", "dow_change"]
                        for field in percentage_fields:
                            if field in market_summary:
                                market_chart_checks.append(f"✓ {field} for trend charts")
                        
                        # Check for numerical indicators (gauge charts)
                        if "vix" in market_summary:
                            market_chart_checks.append("✓ VIX for volatility charts")
                        if "ten_year_treasury" in market_summary:
                            market_chart_checks.append("✓ Treasury rate for interest rate charts")
                    
                    if "trending_sectors" in data and isinstance(data["trending_sectors"], list):
                        market_chart_checks.append("✓ Trending sectors for bar charts")
                    
                    if "economic_indicators" in data and isinstance(data["economic_indicators"], dict):
                        indicators = data["economic_indicators"]
                        indicator_count = len([k for k in indicators.keys() if isinstance(indicators[k], str) and "%" in indicators[k]])
                        if indicator_count > 0:
                            market_chart_checks.append(f"✓ {indicator_count} economic indicators for dashboard charts")
                    
                    if len(market_chart_checks) >= 5:
                        self.log_result("Market Insights Chart Data", True, 
                                      f"Market chart data verified: {len(market_chart_checks)} market metrics")
                        return True
                    else:
                        self.log_result("Market Insights Chart Data", False, 
                                      f"Limited market chart data: {market_chart_checks}")
                        return False
                else:
                    error_text = await response.text()
                    self.log_result("Market Insights Chart Data", False, f"HTTP {response.status} - {error_text}")
                    return False
        except Exception as e:
            self.log_result("Market Insights Chart Data", False, f"Market chart data error: {str(e)}")
            return False

    async def test_chart_color_utility_impact(self):
        """Test that chart color utility imports don't break backend functionality"""
        try:
            # Test basic connectivity to ensure server is still running
            async with self.session.get(f"{self.base_url}/health") as response:
                if response.status == 200:
                    health_data = await response.json()
                    if "status" in health_data and health_data["status"] == "healthy":
                        
                        # Test a few key endpoints to ensure no import issues
                        test_endpoints = [
                            ("/", "Basic endpoint"),
                            ("/market/insights", "Market insights"),
                        ]
                        
                        working_endpoints = 0
                        for endpoint, name in test_endpoints:
                            try:
                                async with self.session.get(f"{self.base_url}{endpoint}") as test_response:
                                    if test_response.status == 200:
                                        working_endpoints += 1
                            except Exception:
                                pass
                        
                        if working_endpoints == len(test_endpoints):
                            self.log_result("Chart Color Utility Impact", True, 
                                          f"Backend functionality unaffected by chart color updates. {working_endpoints}/{len(test_endpoints)} endpoints working")
                            return True
                        else:
                            self.log_result("Chart Color Utility Impact", False, 
                                          f"Some endpoints affected: {working_endpoints}/{len(test_endpoints)} working")
                            return False
                    else:
                        self.log_result("Chart Color Utility Impact", False, f"Health check failed: {health_data}")
                        return False
                else:
                    self.log_result("Chart Color Utility Impact", False, f"Health endpoint failed: HTTP {response.status}")
                    return False
        except Exception as e:
            self.log_result("Chart Color Utility Impact", False, f"Chart color impact test error: {str(e)}")
            return False

    async def run_chart_focused_tests(self):
        """Run all chart-focused backend tests"""
        print("🎨 Starting Chart Color Backend Testing Suite")
        print(f"🎯 Testing backend at: {self.base_url}")
        print("📊 Focus: Chart data endpoints and color utility impact")
        print("=" * 70)
        
        await self.setup()
        
        tests = [
            # Chart data structure tests
            self.test_dashboard_analytics_chart_data,
            self.test_comprehensive_analysis_chart_data,
            self.test_smart_budget_chart_data,
            self.test_investment_strategy_chart_data,
            self.test_competitive_insights_chart_data,
            self.test_portfolio_optimization_chart_data,
            self.test_market_insights_chart_data,
            
            # Chart color utility impact test
            self.test_chart_color_utility_impact,
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                result = await test()
                if result:
                    passed += 1
            except Exception as e:
                print(f"❌ CRITICAL ERROR in {test.__name__}: {str(e)}")
                traceback.print_exc()
        
        await self.cleanup()
        
        print("=" * 70)
        print(f"📊 CHART TEST SUMMARY: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 ALL CHART TESTS PASSED - Chart data endpoints fully functional!")
        elif passed >= total * 0.8:
            print("⚠️  MOSTLY WORKING - Minor chart data issues detected")
        else:
            print("🚨 CRITICAL CHART ISSUES - Chart data endpoints need attention")
        
        return passed, total

async def main():
    """Main test execution"""
    tester = ChartColorBackendTester()
    passed, total = await tester.run_chart_focused_tests()
    
    # Print detailed results
    print("\n" + "=" * 70)
    print("📋 DETAILED CHART TEST RESULTS:")
    print("=" * 70)
    
    for result in TEST_RESULTS:
        status = "✅" if result["success"] else "❌"
        print(f"{status} {result['test']}: {result['details']}")
    
    # Return exit code based on results
    if passed == total:
        sys.exit(0)  # All tests passed
    elif passed >= total * 0.8:
        sys.exit(1)  # Minor issues
    else:
        sys.exit(2)  # Critical issues

if __name__ == "__main__":
    asyncio.run(main())