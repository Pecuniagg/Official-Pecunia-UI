#!/usr/bin/env python3
"""
Comprehensive Backend Testing Suite for Pecunia Web App
Tests all FastAPI endpoints, MongoDB connection, and AI service integration
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
BACKEND_URL = "https://8b8e6362-80f8-4288-a8a0-5e8fef52d50b.preview.emergentagent.com/api"
TEST_RESULTS = []

class BackendTester:
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
        
    async def test_basic_connectivity(self):
        """Test basic server connectivity"""
        try:
            async with self.session.get(f"{self.base_url}/") as response:
                if response.status == 200:
                    data = await response.json()
                    if data.get("message") == "Hello World":
                        self.log_result("Basic Connectivity", True, "Server responding correctly")
                        return True
                    else:
                        self.log_result("Basic Connectivity", False, f"Unexpected response: {data}")
                        return False
                else:
                    self.log_result("Basic Connectivity", False, f"HTTP {response.status}")
                    return False
        except Exception as e:
            self.log_result("Basic Connectivity", False, f"Connection error: {str(e)}")
            return False
    
    async def test_mongodb_connection(self):
        """Test MongoDB connection via status endpoints"""
        try:
            # Test creating a status check
            test_data = {
                "client_name": f"test_client_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            }
            
            async with self.session.post(f"{self.base_url}/status", json=test_data) as response:
                if response.status == 200:
                    created_status = await response.json()
                    if "id" in created_status and created_status["client_name"] == test_data["client_name"]:
                        # Test retrieving status checks
                        async with self.session.get(f"{self.base_url}/status") as get_response:
                            if get_response.status == 200:
                                status_list = await get_response.json()
                                if isinstance(status_list, list) and len(status_list) > 0:
                                    self.log_result("MongoDB Connection", True, 
                                                  f"Successfully created and retrieved status checks. Total records: {len(status_list)}")
                                    return True
                                else:
                                    self.log_result("MongoDB Connection", False, "No status checks retrieved")
                                    return False
                            else:
                                self.log_result("MongoDB Connection", False, f"Failed to retrieve status checks: HTTP {get_response.status}")
                                return False
                    else:
                        self.log_result("MongoDB Connection", False, f"Invalid created status response: {created_status}")
                        return False
                else:
                    error_text = await response.text()
                    self.log_result("MongoDB Connection", False, f"Failed to create status check: HTTP {response.status} - {error_text}")
                    return False
        except Exception as e:
            self.log_result("MongoDB Connection", False, f"Database connection error: {str(e)}")
            return False
    
    async def test_ai_chat_endpoint(self):
        """Test AI chat functionality"""
        try:
            test_message = {
                "message": "What are some good budgeting tips for a young professional?",
                "user_context": {
                    "monthly_income": 5000,
                    "monthly_expenses": 3500,
                    "pecunia_score": 750
                }
            }
            
            async with self.session.post(f"{self.base_url}/ai/chat", json=test_message) as response:
                if response.status == 200:
                    data = await response.json()
                    if "response" in data and isinstance(data["response"], str) and len(data["response"]) > 10:
                        self.log_result("AI Chat Endpoint", True, 
                                      f"AI chat working correctly. Response length: {len(data['response'])} chars")
                        return True
                    else:
                        self.log_result("AI Chat Endpoint", False, f"Invalid AI response format: {data}")
                        return False
                else:
                    error_text = await response.text()
                    self.log_result("AI Chat Endpoint", False, f"HTTP {response.status} - {error_text}")
                    return False
        except Exception as e:
            self.log_result("AI Chat Endpoint", False, f"AI chat error: {str(e)}")
            return False
    
    async def test_financial_insights_endpoint(self):
        """Test financial insights generation"""
        try:
            test_data = {
                "monthly_budget": 4500,
                "monthly_income": 6000,
                "monthly_expenses": 3200,
                "savings_rate": 28,
                "pecunia_score": 820,
                "total_assets": 45000,
                "total_liabilities": 8000,
                "emergency_fund": 12000,
                "age": 29,
                "expenses": {
                    "housing": 1200,
                    "food": 600,
                    "transportation": 400,
                    "entertainment": 300,
                    "utilities": 200,
                    "other": 500
                },
                "goals": [
                    {"title": "Emergency Fund", "target": 15000, "current": 12000},
                    {"title": "Vacation", "target": 3000, "current": 800}
                ]
            }
            
            async with self.session.post(f"{self.base_url}/ai/financial-insights", json=test_data) as response:
                if response.status == 200:
                    data = await response.json()
                    required_fields = ["summary", "insights", "recommendations", "predictions"]
                    if all(field in data for field in required_fields):
                        insights_count = len(data.get("insights", []))
                        recommendations_count = len(data.get("recommendations", []))
                        self.log_result("Financial Insights Endpoint", True, 
                                      f"Generated {insights_count} insights and {recommendations_count} recommendations")
                        return True
                    else:
                        self.log_result("Financial Insights Endpoint", False, f"Missing required fields in response: {list(data.keys())}")
                        return False
                else:
                    error_text = await response.text()
                    self.log_result("Financial Insights Endpoint", False, f"HTTP {response.status} - {error_text}")
                    return False
        except Exception as e:
            self.log_result("Financial Insights Endpoint", False, f"Financial insights error: {str(e)}")
            return False
    
    async def test_goal_strategy_endpoint(self):
        """Test goal strategy generation"""
        try:
            test_data = {
                "goal": {
                    "title": "House Down Payment",
                    "target": 50000,
                    "current": 15000,
                    "deadline": "2025-12-31"
                },
                "user_context": {
                    "monthly_income": 7000,
                    "monthly_expenses": 4500,
                    "savings_rate": 25
                }
            }
            
            async with self.session.post(f"{self.base_url}/ai/goal-strategy", json=test_data) as response:
                if response.status == 200:
                    data = await response.json()
                    required_fields = ["feasibility", "monthly_required", "strategy"]
                    if all(field in data for field in required_fields):
                        feasibility = data.get("feasibility", "unknown")
                        monthly_required = data.get("monthly_required", "unknown")
                        self.log_result("Goal Strategy Endpoint", True, 
                                      f"Strategy generated - Feasibility: {feasibility}, Monthly required: {monthly_required}")
                        return True
                    else:
                        self.log_result("Goal Strategy Endpoint", False, f"Missing required fields in response: {list(data.keys())}")
                        return False
                else:
                    error_text = await response.text()
                    self.log_result("Goal Strategy Endpoint", False, f"HTTP {response.status} - {error_text}")
                    return False
        except Exception as e:
            self.log_result("Goal Strategy Endpoint", False, f"Goal strategy error: {str(e)}")
            return False
    
    async def test_travel_plan_endpoint(self):
        """Test travel plan generation"""
        try:
            test_data = {
                "budget": 2500,
                "duration": "5 days",
                "location": "Paris, France",
                "style": "cultural",
                "interests": ["museums", "food", "architecture"],
                "group_size": 2
            }
            
            async with self.session.post(f"{self.base_url}/ai/travel-plan", json=test_data) as response:
                if response.status == 200:
                    data = await response.json()
                    required_fields = ["title", "description", "budget_breakdown", "itinerary"]
                    if all(field in data for field in required_fields):
                        itinerary_days = len(data.get("itinerary", []))
                        budget_categories = len(data.get("budget_breakdown", {}))
                        self.log_result("Travel Plan Endpoint", True, 
                                      f"Travel plan generated - {itinerary_days} days, {budget_categories} budget categories")
                        return True
                    else:
                        self.log_result("Travel Plan Endpoint", False, f"Missing required fields in response: {list(data.keys())}")
                        return False
                else:
                    error_text = await response.text()
                    self.log_result("Travel Plan Endpoint", False, f"HTTP {response.status} - {error_text}")
                    return False
        except Exception as e:
            self.log_result("Travel Plan Endpoint", False, f"Travel plan error: {str(e)}")
            return False
    
    async def test_spending_analysis_endpoint(self):
        """Test spending analysis functionality"""
        try:
            test_data = {
                "transactions": [
                    {"date": "2024-01-15", "amount": 45.50, "category": "food", "description": "Grocery shopping"},
                    {"date": "2024-01-16", "amount": 12.99, "category": "entertainment", "description": "Movie ticket"},
                    {"date": "2024-01-17", "amount": 89.00, "category": "transportation", "description": "Gas station"},
                    {"date": "2024-01-18", "amount": 156.78, "category": "shopping", "description": "Clothing store"},
                    {"date": "2024-01-19", "amount": 23.45, "category": "food", "description": "Restaurant"},
                    {"date": "2024-01-20", "amount": 67.89, "category": "utilities", "description": "Electric bill"}
                ]
            }
            
            async with self.session.post(f"{self.base_url}/ai/spending-analysis", json=test_data) as response:
                if response.status == 200:
                    data = await response.json()
                    required_fields = ["trends", "alerts", "optimization"]
                    if all(field in data for field in required_fields):
                        trends_count = len(data.get("trends", []))
                        alerts_count = len(data.get("alerts", []))
                        optimization_count = len(data.get("optimization", []))
                        self.log_result("Spending Analysis Endpoint", True, 
                                      f"Analysis complete - {trends_count} trends, {alerts_count} alerts, {optimization_count} optimizations")
                        return True
                    else:
                        self.log_result("Spending Analysis Endpoint", False, f"Missing required fields in response: {list(data.keys())}")
                        return False
                else:
                    error_text = await response.text()
                    self.log_result("Spending Analysis Endpoint", False, f"HTTP {response.status} - {error_text}")
                    return False
        except Exception as e:
            self.log_result("Spending Analysis Endpoint", False, f"Spending analysis error: {str(e)}")
            return False
    
    async def test_error_handling(self):
        """Test API error handling"""
        try:
            # Test invalid endpoint
            async with self.session.get(f"{self.base_url}/nonexistent") as response:
                if response.status == 404:
                    self.log_result("Error Handling - 404", True, "Correctly returns 404 for invalid endpoints")
                else:
                    self.log_result("Error Handling - 404", False, f"Expected 404, got {response.status}")
            
            # Test invalid JSON for AI endpoints
            async with self.session.post(f"{self.base_url}/ai/chat", json={"invalid": "data"}) as response:
                if response.status in [400, 422, 500]:  # Any of these are acceptable for invalid data
                    self.log_result("Error Handling - Invalid Data", True, f"Correctly handles invalid data with HTTP {response.status}")
                    return True
                else:
                    self.log_result("Error Handling - Invalid Data", False, f"Unexpected status {response.status} for invalid data")
                    return False
        except Exception as e:
            self.log_result("Error Handling", False, f"Error handling test failed: {str(e)}")
            return False
    
    async def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Comprehensive Backend Testing Suite")
        print(f"🎯 Testing backend at: {self.base_url}")
        print("=" * 60)
        
        await self.setup()
        
        tests = [
            self.test_basic_connectivity,
            self.test_mongodb_connection,
            self.test_ai_chat_endpoint,
            self.test_financial_insights_endpoint,
            self.test_goal_strategy_endpoint,
            self.test_travel_plan_endpoint,
            self.test_spending_analysis_endpoint,
            self.test_error_handling
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
        
        print("=" * 60)
        print(f"📊 TEST SUMMARY: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 ALL TESTS PASSED - Backend is fully functional!")
        elif passed >= total * 0.8:
            print("⚠️  MOSTLY WORKING - Minor issues detected")
        else:
            print("🚨 CRITICAL ISSUES - Backend needs attention")
        
        return passed, total

async def main():
    """Main test execution"""
    tester = BackendTester()
    passed, total = await tester.run_all_tests()
    
    # Print detailed results
    print("\n" + "=" * 60)
    print("📋 DETAILED TEST RESULTS:")
    print("=" * 60)
    
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