#!/usr/bin/env python3
"""
Quick Backend Test for Enhanced AI Features
"""

import asyncio
import aiohttp
import json
from datetime import datetime

BACKEND_URL = "https://29ebef05-dbf9-4586-a1aa-edf2fc5c5871.preview.emergentagent.com/api"

async def test_endpoint(session, endpoint, method="GET", data=None):
    """Test a single endpoint"""
    try:
        if method == "GET":
            async with session.get(f"{BACKEND_URL}{endpoint}") as response:
                status = response.status
                if status == 200:
                    result = await response.json()
                    return True, f"✅ {endpoint}: Working"
                else:
                    error = await response.text()
                    return False, f"❌ {endpoint}: HTTP {status} - {error[:100]}"
        else:
            async with session.post(f"{BACKEND_URL}{endpoint}", json=data) as response:
                status = response.status
                if status == 200:
                    result = await response.json()
                    return True, f"✅ {endpoint}: Working"
                else:
                    error = await response.text()
                    return False, f"❌ {endpoint}: HTTP {status} - {error[:100]}"
    except Exception as e:
        return False, f"❌ {endpoint}: Error - {str(e)[:100]}"

async def main():
    print("🚀 Quick Backend Test for Enhanced AI Features")
    print("=" * 60)
    
    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=10)) as session:
        
        # Test basic connectivity
        success, msg = await test_endpoint(session, "/")
        print(msg)
        
        # Test MongoDB
        success, msg = await test_endpoint(session, "/status", "POST", {"client_name": "quick_test"})
        print(msg)
        
        # Test new AI endpoints
        ai_tests = [
            ("/ai/comprehensive-analysis", {
                "monthly_income": 7500,
                "monthly_expenses": 4500,
                "pecunia_score": 750,
                "age": 30,
                "risk_tolerance": "medium"
            }),
            ("/ai/smart-budget", {
                "monthly_income": 7500,
                "expenses": {"housing": 2000, "food": 600},
                "goals": [{"title": "Emergency Fund", "target": 15000}]
            }),
            ("/ai/investment-strategy", {
                "investable_amount": 25000,
                "risk_tolerance": "medium",
                "age": 30,
                "timeline": "10+ years"
            }),
            ("/ai/competitive-insights", {
                "age": 30,
                "income": 75000,
                "net_worth": 100000,
                "pecunia_score": 750
            }),
            ("/ai/portfolio-optimization", {
                "portfolio_data": {"stocks": {"AAPL": 10000}, "bonds": {"treasury": 5000}}
            }),
            ("/ai/smart-recommendations", {
                "monthly_income": 7500,
                "monthly_expenses": 4500,
                "pecunia_score": 750,
                "age": 30,
                "risk_tolerance": "medium"
            })
        ]
        
        for endpoint, data in ai_tests:
            success, msg = await test_endpoint(session, endpoint, "POST", data)
            print(msg)
        
        # Test legacy AI endpoints
        legacy_tests = [
            ("/ai/chat", {"message": "Hello", "user_context": {}}),
            ("/ai/goal-strategy", {
                "title": "House Fund",
                "target": 50000,
                "current": 15000,
                "deadline": "2025-12-31",
                "monthly_income": 7000
            }),
            ("/ai/travel-plan", {
                "budget": 2500,
                "destination": "Paris",
                "duration": "5 days"
            })
        ]
        
        for endpoint, data in legacy_tests:
            success, msg = await test_endpoint(session, endpoint, "POST", data)
            print(msg)
        
        # Test data management endpoints
        data_tests = [
            ("/user/profile", {
                "id": "test_user_123",
                "name": "Test User",
                "monthly_income": 7500
            }),
            ("/goals", {
                "user_id": "test_user_123",
                "title": "Emergency Fund",
                "target": 15000,
                "current": 5000
            }),
            ("/budget", {
                "user_id": "test_user_123",
                "monthly_income": 7500,
                "expenses": {"housing": 2000}
            })
        ]
        
        for endpoint, data in data_tests:
            success, msg = await test_endpoint(session, endpoint, "POST", data)
            print(msg)
        
        # Test analytics endpoints
        success, msg = await test_endpoint(session, "/market/insights")
        print(msg)

if __name__ == "__main__":
    asyncio.run(main())