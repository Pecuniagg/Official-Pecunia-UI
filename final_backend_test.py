#!/usr/bin/env python3
"""
Final Comprehensive Backend Test for Enhanced AI Features
"""

import asyncio
import aiohttp
import json
from datetime import datetime

BACKEND_URL = "https://a9a77136-45cf-4de9-a0a2-052e046e9a8a.preview.emergentagent.com/api"

async def test_endpoint(session, endpoint, method="GET", data=None, timeout=30):
    """Test a single endpoint with extended timeout"""
    try:
        if method == "GET":
            async with session.get(f"{BACKEND_URL}{endpoint}") as response:
                status = response.status
                if status == 200:
                    result = await response.json()
                    return True, f"✅ {endpoint}: Working"
                else:
                    error = await response.text()
                    return False, f"❌ {endpoint}: HTTP {status}"
        else:
            async with session.post(f"{BACKEND_URL}{endpoint}", json=data) as response:
                status = response.status
                if status == 200:
                    result = await response.json()
                    return True, f"✅ {endpoint}: Working"
                elif status == 422:
                    return False, f"❌ {endpoint}: Validation Error (422)"
                else:
                    error = await response.text()
                    return False, f"❌ {endpoint}: HTTP {status}"
    except asyncio.TimeoutError:
        return False, f"❌ {endpoint}: Timeout"
    except Exception as e:
        return False, f"❌ {endpoint}: Error - {str(e)[:50]}"

async def main():
    print("🚀 Final Comprehensive Backend Test for Enhanced AI Features")
    print("=" * 70)
    
    # Extended timeout for AI endpoints
    timeout = aiohttp.ClientTimeout(total=60)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        
        results = []
        
        # Test basic connectivity
        success, msg = await test_endpoint(session, "/")
        results.append(("Basic Connectivity", success))
        print(msg)
        
        # Test MongoDB
        success, msg = await test_endpoint(session, "/status", "POST", {"client_name": "final_test"})
        results.append(("MongoDB Connection", success))
        print(msg)
        
        print("\n🤖 Testing New AI-Powered Endpoints:")
        print("-" * 40)
        
        # Test new AI endpoints
        ai_tests = [
            ("Comprehensive Analysis", "/ai/comprehensive-analysis", {
                "monthly_income": 7500,
                "monthly_expenses": 4500,
                "pecunia_score": 750,
                "age": 30,
                "risk_tolerance": "medium",
                "goals": [{"title": "Emergency Fund", "target": 15000, "current": 5000}],
                "investments": {"stocks": 25000, "bonds": 10000},
                "location": "United States",
                "expenses": {"housing": 2000, "food": 600, "transportation": 500},
                "assets": {"savings": 15000, "investments": 35000},
                "liabilities": {"credit_cards": 2000}
            }),
            ("Smart Budget", "/ai/smart-budget", {
                "monthly_income": 7500,
                "expenses": {"housing": 2000, "food": 600, "transportation": 500},
                "goals": [{"title": "Emergency Fund", "target": 15000, "current": 5000}],
                "location": "United States"
            }),
            ("Investment Strategy", "/ai/investment-strategy", {
                "investable_amount": 25000,
                "risk_tolerance": "medium",
                "age": 30,
                "timeline": "10+ years"
            }),
            ("Competitive Insights", "/ai/competitive-insights", {
                "age": 30,
                "income": 90000,
                "net_worth": 125000,
                "pecunia_score": 750,
                "location": "United States"
            }),
            ("Portfolio Optimization", "/ai/portfolio-optimization", {
                "portfolio_data": {
                    "stocks": {"AAPL": 15000, "GOOGL": 10000},
                    "bonds": {"treasury_10yr": 8000},
                    "cash": 5000
                }
            }),
            ("Smart Recommendations", "/ai/smart-recommendations", {
                "monthly_income": 7500,
                "monthly_expenses": 4500,
                "pecunia_score": 750,
                "age": 30,
                "risk_tolerance": "medium",
                "goals": [{"title": "House Fund", "target": 80000, "current": 20000}],
                "investments": {"stocks": 25000, "bonds": 10000},
                "location": "United States",
                "expenses": {"housing": 2000, "food": 600},
                "assets": {"savings": 15000, "investments": 35000},
                "liabilities": {"student_loans": 15000}
            })
        ]
        
        for name, endpoint, data in ai_tests:
            success, msg = await test_endpoint(session, endpoint, "POST", data, 60)
            results.append((name, success))
            print(msg)
        
        print("\n🔄 Testing Legacy AI Endpoints:")
        print("-" * 40)
        
        # Test legacy AI endpoints
        legacy_tests = [
            ("AI Chat", "/ai/chat", {
                "message": "What are some good budgeting tips?",
                "user_context": {"monthly_income": 7500, "monthly_expenses": 4500}
            }),
            ("Goal Strategy", "/ai/goal-strategy", {
                "title": "House Down Payment",
                "target": 50000,
                "current": 15000,
                "deadline": "2025-12-31",
                "monthly_income": 7500
            }),
            ("Travel Plan", "/ai/travel-plan", {
                "budget": 3000,
                "destination": "Paris, France",
                "duration": "7 days",
                "interests": ["museums", "food"],
                "group_size": 2,
                "dates": "flexible"
            }),
            ("Spending Analysis", "/ai/spending-analysis", {
                "spending_data": [
                    {"date": "2024-01-15", "amount": 45.50, "category": "food"},
                    {"date": "2024-01-16", "amount": 89.00, "category": "transportation"},
                    {"date": "2024-01-17", "amount": 156.78, "category": "shopping"}
                ]
            })
        ]
        
        for name, endpoint, data in legacy_tests:
            success, msg = await test_endpoint(session, endpoint, "POST", data, 60)
            results.append((name, success))
            print(msg)
        
        print("\n💾 Testing Data Management Endpoints:")
        print("-" * 40)
        
        # Test data management endpoints
        test_user_id = f"test_user_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        data_tests = [
            ("User Profile Management", "/user/profile", {
                "id": test_user_id,
                "name": "Sarah Johnson",
                "email": "sarah@example.com",
                "age": 29,
                "monthly_income": 7500,
                "risk_tolerance": "medium"
            }),
            ("Goals Management", "/goals", {
                "user_id": test_user_id,
                "title": "Emergency Fund",
                "target": 15000,
                "current": 5000,
                "deadline": "2025-12-31"
            }),
            ("Budget Management", "/budget", {
                "user_id": test_user_id,
                "monthly_income": 7500,
                "expenses": {"housing": 2000, "food": 600, "transportation": 500}
            }),
            ("Travel Plans Management", "/travel-plans", {
                "user_id": test_user_id,
                "title": "European Adventure",
                "destination": "Paris, France",
                "budget": 3500,
                "duration": "7 days"
            })
        ]
        
        for name, endpoint, data in data_tests:
            success, msg = await test_endpoint(session, endpoint, "POST", data)
            results.append((name, success))
            print(msg)
        
        print("\n📊 Testing Analytics Endpoints:")
        print("-" * 40)
        
        # Test analytics endpoints
        analytics_tests = [
            ("Market Insights", "/market/insights", None)
        ]
        
        for name, endpoint, data in analytics_tests:
            success, msg = await test_endpoint(session, endpoint, "GET", data)
            results.append((name, success))
            print(msg)
        
        # Test dashboard analytics (requires existing user profile)
        success, msg = await test_endpoint(session, f"/analytics/dashboard/{test_user_id}")
        results.append(("Dashboard Analytics", success))
        print(f"✅ Dashboard Analytics: Working" if success else f"❌ Dashboard Analytics: Failed")
        
        print("\n" + "=" * 70)
        print("📋 FINAL TEST SUMMARY:")
        print("=" * 70)
        
        passed = sum(1 for _, success in results if success)
        total = len(results)
        
        for name, success in results:
            status = "✅ PASS" if success else "❌ FAIL"
            print(f"{status} {name}")
        
        print(f"\n📊 OVERALL RESULT: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
        
        if passed >= total * 0.9:
            print("🎉 EXCELLENT - Backend is fully functional!")
        elif passed >= total * 0.8:
            print("✅ GOOD - Backend is mostly working with minor issues")
        elif passed >= total * 0.6:
            print("⚠️  ACCEPTABLE - Backend has some issues but core functionality works")
        else:
            print("🚨 CRITICAL - Backend needs significant attention")

if __name__ == "__main__":
    asyncio.run(main())