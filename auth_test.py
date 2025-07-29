#!/usr/bin/env python3
"""
Comprehensive Authentication System Testing for Pecunia Web App
Focus: Testing "failing to fetch" login issue and authentication endpoints
"""

import requests
import json
import time
import sys
from datetime import datetime
from typing import Dict, Any, Optional

class AuthenticationTester:
    def __init__(self):
        # Get backend URL from frontend .env
        try:
            with open('/app/frontend/.env', 'r') as f:
                for line in f:
                    if line.startswith('REACT_APP_BACKEND_URL='):
                        self.base_url = line.split('=', 1)[1].strip()
                        break
                else:
                    raise ValueError("REACT_APP_BACKEND_URL not found")
        except Exception as e:
            print(f"❌ Error reading backend URL: {e}")
            sys.exit(1)
        
        self.api_url = f"{self.base_url}/api"
        self.session = requests.Session()
        self.test_results = []
        self.auth_token = None
        
        print(f"🔗 Testing backend at: {self.api_url}")
        print(f"🕐 Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)

    def log_test(self, test_name: str, success: bool, details: str, response_data: Optional[Dict] = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   📝 {details}")
        if response_data and not success:
            print(f"   📊 Response: {json.dumps(response_data, indent=2)}")
        print()
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def test_basic_connectivity(self):
        """Test basic backend connectivity"""
        print("🔍 TESTING BASIC CONNECTIVITY")
        print("-" * 40)
        
        try:
            # Test root endpoint
            response = self.session.get(f"{self.base_url}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "Basic Connectivity", 
                    True, 
                    f"Backend responding correctly (Status: {response.status_code})"
                )
            else:
                self.log_test(
                    "Basic Connectivity", 
                    False, 
                    f"Unexpected status code: {response.status_code}",
                    response.json() if response.content else None
                )
        except requests.exceptions.RequestException as e:
            self.log_test("Basic Connectivity", False, f"Connection failed: {str(e)}")
        
        # Test health endpoint
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                self.log_test("Health Check", True, "Health endpoint responding")
            else:
                self.log_test("Health Check", False, f"Health check failed: {response.status_code}")
        except requests.exceptions.RequestException as e:
            self.log_test("Health Check", False, f"Health check connection failed: {str(e)}")

    def test_cors_headers(self):
        """Test CORS configuration"""
        print("🌐 TESTING CORS CONFIGURATION")
        print("-" * 40)
        
        try:
            # Test preflight request
            headers = {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type,Authorization'
            }
            
            response = self.session.options(f"{self.api_url}/auth/login", headers=headers, timeout=10)
            
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
                'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
            }
            
            if response.status_code in [200, 204]:
                self.log_test(
                    "CORS Preflight", 
                    True, 
                    f"CORS headers present: {cors_headers}"
                )
            else:
                self.log_test(
                    "CORS Preflight", 
                    False, 
                    f"CORS preflight failed: {response.status_code}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("CORS Preflight", False, f"CORS test failed: {str(e)}")

    def test_login_endpoint(self):
        """Test login endpoint with demo credentials"""
        print("🔐 TESTING LOGIN ENDPOINT")
        print("-" * 40)
        
        # Test with demo credentials
        demo_credentials = {
            "email": "demo@pecunia.com",
            "password": "DemoPass789"
        }
        
        try:
            response = self.session.post(
                f"{self.api_url}/auth/login",
                json=demo_credentials,
                headers={'Content-Type': 'application/json'},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data and 'user' in data:
                    self.auth_token = data['access_token']
                    self.log_test(
                        "Demo Login Success", 
                        True, 
                        f"Login successful for {demo_credentials['email']}, token received"
                    )
                else:
                    self.log_test(
                        "Demo Login Success", 
                        False, 
                        "Login response missing required fields",
                        data
                    )
            else:
                self.log_test(
                    "Demo Login Success", 
                    False, 
                    f"Login failed with status {response.status_code}",
                    response.json() if response.content else None
                )
                
        except requests.exceptions.Timeout:
            self.log_test("Demo Login Success", False, "Login request timed out (>15s)")
        except requests.exceptions.RequestException as e:
            self.log_test("Demo Login Success", False, f"Login request failed: {str(e)}")
        
        # Test with invalid credentials
        invalid_credentials = {
            "email": "demo@pecunia.com",
            "password": "WrongPassword"
        }
        
        try:
            response = self.session.post(
                f"{self.api_url}/auth/login",
                json=invalid_credentials,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 401:
                self.log_test(
                    "Invalid Login Rejection", 
                    True, 
                    "Invalid credentials properly rejected with 401"
                )
            else:
                self.log_test(
                    "Invalid Login Rejection", 
                    False, 
                    f"Expected 401, got {response.status_code}",
                    response.json() if response.content else None
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Invalid Login Rejection", False, f"Invalid login test failed: {str(e)}")

    def test_register_endpoint(self):
        """Test registration endpoint"""
        print("📝 TESTING REGISTRATION ENDPOINT")
        print("-" * 40)
        
        # Test with valid registration data
        test_user = {
            "name": "Test User",
            "email": f"test_{int(time.time())}@example.com",
            "password": "TestPass123"
        }
        
        try:
            response = self.session.post(
                f"{self.api_url}/auth/register",
                json=test_user,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data and 'user' in data:
                    self.log_test(
                        "User Registration", 
                        True, 
                        f"Registration successful for {test_user['email']}"
                    )
                else:
                    self.log_test(
                        "User Registration", 
                        False, 
                        "Registration response missing required fields",
                        data
                    )
            else:
                self.log_test(
                    "User Registration", 
                    False, 
                    f"Registration failed with status {response.status_code}",
                    response.json() if response.content else None
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("User Registration", False, f"Registration request failed: {str(e)}")
        
        # Test duplicate email registration
        try:
            response = self.session.post(
                f"{self.api_url}/auth/register",
                json={
                    "name": "Demo User Duplicate",
                    "email": "demo@pecunia.com",  # Existing email
                    "password": "TestPass123"
                },
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 400:
                self.log_test(
                    "Duplicate Email Rejection", 
                    True, 
                    "Duplicate email properly rejected with 400"
                )
            else:
                self.log_test(
                    "Duplicate Email Rejection", 
                    False, 
                    f"Expected 400, got {response.status_code}",
                    response.json() if response.content else None
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Duplicate Email Rejection", False, f"Duplicate email test failed: {str(e)}")

    def test_verify_endpoint(self):
        """Test authentication verification endpoint"""
        print("✅ TESTING VERIFY ENDPOINT")
        print("-" * 40)
        
        if not self.auth_token:
            self.log_test("Auth Verification", False, "No auth token available for testing")
            return
        
        try:
            headers = {
                'Authorization': f'Bearer {self.auth_token}',
                'Content-Type': 'application/json'
            }
            
            response = self.session.get(
                f"{self.api_url}/auth/verify",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'is_authenticated' in data and data['is_authenticated']:
                    self.log_test(
                        "Auth Verification", 
                        True, 
                        f"Token verification successful, user authenticated"
                    )
                else:
                    self.log_test(
                        "Auth Verification", 
                        False, 
                        "Verification response indicates not authenticated",
                        data
                    )
            else:
                self.log_test(
                    "Auth Verification", 
                    False, 
                    f"Verification failed with status {response.status_code}",
                    response.json() if response.content else None
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Auth Verification", False, f"Verification request failed: {str(e)}")
        
        # Test with invalid token
        try:
            headers = {
                'Authorization': 'Bearer invalid_token_here',
                'Content-Type': 'application/json'
            }
            
            response = self.session.get(
                f"{self.api_url}/auth/verify",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 401:
                self.log_test(
                    "Invalid Token Rejection", 
                    True, 
                    "Invalid token properly rejected with 401"
                )
            else:
                self.log_test(
                    "Invalid Token Rejection", 
                    False, 
                    f"Expected 401, got {response.status_code}",
                    response.json() if response.content else None
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Invalid Token Rejection", False, f"Invalid token test failed: {str(e)}")

    def test_onboarding_endpoint(self):
        """Test onboarding endpoint"""
        print("🎯 TESTING ONBOARDING ENDPOINT")
        print("-" * 40)
        
        if not self.auth_token:
            self.log_test("Onboarding Process", False, "No auth token available for testing")
            return
        
        onboarding_data = {
            "country": "United States",
            "financial_status": "Employed",
            "interests": ["Tech", "Investing", "Travelling"],
            "usage_purpose": "I want to manage my finances better and track my spending habits effectively.",
            "referral_source": "LinkedIn",
            "expectations": "I expect to gain better insights into my financial health and receive personalized recommendations."
        }
        
        try:
            headers = {
                'Authorization': f'Bearer {self.auth_token}',
                'Content-Type': 'application/json'
            }
            
            response = self.session.post(
                f"{self.api_url}/auth/onboarding",
                json=onboarding_data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'message' in data and 'user' in data:
                    self.log_test(
                        "Onboarding Process", 
                        True, 
                        "Onboarding completed successfully"
                    )
                else:
                    self.log_test(
                        "Onboarding Process", 
                        False, 
                        "Onboarding response missing required fields",
                        data
                    )
            else:
                self.log_test(
                    "Onboarding Process", 
                    False, 
                    f"Onboarding failed with status {response.status_code}",
                    response.json() if response.content else None
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Onboarding Process", False, f"Onboarding request failed: {str(e)}")

    def test_profile_endpoint(self):
        """Test profile retrieval endpoint"""
        print("👤 TESTING PROFILE ENDPOINT")
        print("-" * 40)
        
        if not self.auth_token:
            self.log_test("Profile Retrieval", False, "No auth token available for testing")
            return
        
        try:
            headers = {
                'Authorization': f'Bearer {self.auth_token}',
                'Content-Type': 'application/json'
            }
            
            response = self.session.get(
                f"{self.api_url}/auth/profile",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'email' in data:
                    self.log_test(
                        "Profile Retrieval", 
                        True, 
                        f"Profile retrieved successfully for user {data.get('email')}"
                    )
                else:
                    self.log_test(
                        "Profile Retrieval", 
                        False, 
                        "Profile response missing required fields",
                        data
                    )
            else:
                self.log_test(
                    "Profile Retrieval", 
                    False, 
                    f"Profile retrieval failed with status {response.status_code}",
                    response.json() if response.content else None
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Profile Retrieval", False, f"Profile request failed: {str(e)}")

    def test_response_times(self):
        """Test response times and reliability"""
        print("⏱️ TESTING RESPONSE TIMES")
        print("-" * 40)
        
        endpoints_to_test = [
            ("/", "Root Endpoint"),
            ("/health", "Health Check"),
            ("/api/auth/login", "Login Endpoint")
        ]
        
        for endpoint, name in endpoints_to_test:
            response_times = []
            
            for i in range(3):  # Test 3 times
                try:
                    start_time = time.time()
                    if endpoint == "/api/auth/login":
                        response = self.session.post(
                            f"{self.base_url}{endpoint}",
                            json={"email": "demo@pecunia.com", "password": "DemoPass789"},
                            timeout=10
                        )
                    else:
                        response = self.session.get(f"{self.base_url}{endpoint}", timeout=10)
                    
                    end_time = time.time()
                    response_time = (end_time - start_time) * 1000  # Convert to ms
                    response_times.append(response_time)
                    
                except requests.exceptions.RequestException:
                    response_times.append(None)
            
            valid_times = [t for t in response_times if t is not None]
            if valid_times:
                avg_time = sum(valid_times) / len(valid_times)
                self.log_test(
                    f"{name} Response Time", 
                    avg_time < 5000,  # Less than 5 seconds
                    f"Average response time: {avg_time:.0f}ms (3 requests)"
                )
            else:
                self.log_test(f"{name} Response Time", False, "All requests failed")

    def test_malformed_requests(self):
        """Test error handling with malformed requests"""
        print("🚫 TESTING ERROR HANDLING")
        print("-" * 40)
        
        # Test malformed JSON
        try:
            response = self.session.post(
                f"{self.api_url}/auth/login",
                data="invalid json",
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 422:  # Unprocessable Entity
                self.log_test(
                    "Malformed JSON Handling", 
                    True, 
                    "Malformed JSON properly rejected with 422"
                )
            else:
                self.log_test(
                    "Malformed JSON Handling", 
                    False, 
                    f"Expected 422, got {response.status_code}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Malformed JSON Handling", False, f"Malformed JSON test failed: {str(e)}")
        
        # Test missing required fields
        try:
            response = self.session.post(
                f"{self.api_url}/auth/login",
                json={"email": "test@example.com"},  # Missing password
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 422:
                self.log_test(
                    "Missing Fields Handling", 
                    True, 
                    "Missing required fields properly rejected with 422"
                )
            else:
                self.log_test(
                    "Missing Fields Handling", 
                    False, 
                    f"Expected 422, got {response.status_code}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Missing Fields Handling", False, f"Missing fields test failed: {str(e)}")

    def run_all_tests(self):
        """Run all authentication tests"""
        print("🚀 STARTING COMPREHENSIVE AUTHENTICATION TESTING")
        print("=" * 80)
        
        # Run all test suites
        self.test_basic_connectivity()
        self.test_cors_headers()
        self.test_login_endpoint()
        self.test_register_endpoint()
        self.test_verify_endpoint()
        self.test_onboarding_endpoint()
        self.test_profile_endpoint()
        self.test_response_times()
        self.test_malformed_requests()
        
        # Generate summary
        self.generate_summary()

    def generate_summary(self):
        """Generate test summary"""
        print("📊 TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        print()
        
        if failed_tests > 0:
            print("❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['details']}")
            print()
        
        print("🎯 AUTHENTICATION SYSTEM STATUS:")
        critical_tests = [
            "Basic Connectivity",
            "Demo Login Success", 
            "Auth Verification",
            "User Registration"
        ]
        
        critical_passed = sum(1 for result in self.test_results 
                            if result['test'] in critical_tests and result['success'])
        
        if critical_passed == len(critical_tests):
            print("✅ AUTHENTICATION SYSTEM IS WORKING CORRECTLY")
            print("   All critical authentication endpoints are functional")
        else:
            print("❌ AUTHENTICATION SYSTEM HAS ISSUES")
            print("   Some critical authentication endpoints are failing")
        
        print()
        print(f"🕐 Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)

if __name__ == "__main__":
    tester = AuthenticationTester()
    tester.run_all_tests()