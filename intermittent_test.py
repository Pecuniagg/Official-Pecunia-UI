#!/usr/bin/env python3
"""
Intermittent Issues Testing for Pecunia Authentication
Focus: Identifying potential causes of "failing to fetch" errors
"""

import requests
import json
import time
import threading
import concurrent.futures
from datetime import datetime
from typing import List, Dict

class IntermittentIssuesTester:
    def __init__(self):
        # Get backend URL from frontend .env
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    self.base_url = line.split('=', 1)[1].strip()
                    break
        
        self.api_url = f"{self.base_url}/api"
        self.test_results = []
        
        print(f"🔍 TESTING FOR INTERMITTENT ISSUES")
        print(f"🔗 Backend URL: {self.api_url}")
        print(f"🕐 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)

    def log_result(self, test_name: str, success: bool, details: str, response_time: float = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        time_info = f" ({response_time:.0f}ms)" if response_time else ""
        print(f"{status} {test_name}{time_info}")
        if details:
            print(f"   📝 {details}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "response_time": response_time,
            "timestamp": datetime.now().isoformat()
        })

    def single_login_test(self, test_id: int) -> Dict:
        """Perform a single login test"""
        session = requests.Session()
        credentials = {
            "email": "demo@pecunia.com",
            "password": "DemoPass789"
        }
        
        start_time = time.time()
        try:
            response = session.post(
                f"{self.api_url}/auth/login",
                json=credentials,
                headers={'Content-Type': 'application/json'},
                timeout=30  # Longer timeout to catch slow responses
            )
            end_time = time.time()
            response_time = (end_time - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data:
                    return {
                        "test_id": test_id,
                        "success": True,
                        "status_code": response.status_code,
                        "response_time": response_time,
                        "error": None
                    }
                else:
                    return {
                        "test_id": test_id,
                        "success": False,
                        "status_code": response.status_code,
                        "response_time": response_time,
                        "error": "Missing access_token in response"
                    }
            else:
                return {
                    "test_id": test_id,
                    "success": False,
                    "status_code": response.status_code,
                    "response_time": response_time,
                    "error": f"HTTP {response.status_code}"
                }
                
        except requests.exceptions.Timeout:
            return {
                "test_id": test_id,
                "success": False,
                "status_code": None,
                "response_time": 30000,  # Timeout
                "error": "Request timeout (>30s)"
            }
        except requests.exceptions.ConnectionError as e:
            return {
                "test_id": test_id,
                "success": False,
                "status_code": None,
                "response_time": None,
                "error": f"Connection error: {str(e)}"
            }
        except Exception as e:
            return {
                "test_id": test_id,
                "success": False,
                "status_code": None,
                "response_time": None,
                "error": f"Unexpected error: {str(e)}"
            }

    def test_concurrent_logins(self, num_concurrent: int = 10):
        """Test concurrent login requests"""
        print(f"🔄 TESTING CONCURRENT LOGINS ({num_concurrent} simultaneous)")
        print("-" * 60)
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=num_concurrent) as executor:
            futures = [executor.submit(self.single_login_test, i) for i in range(num_concurrent)]
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        # Analyze results
        successful = [r for r in results if r['success']]
        failed = [r for r in results if not r['success']]
        
        if successful:
            avg_response_time = sum(r['response_time'] for r in successful) / len(successful)
            max_response_time = max(r['response_time'] for r in successful)
            min_response_time = min(r['response_time'] for r in successful)
        else:
            avg_response_time = max_response_time = min_response_time = 0
        
        success_rate = len(successful) / len(results) * 100
        
        self.log_result(
            f"Concurrent Logins ({num_concurrent})",
            success_rate >= 90,  # 90% success rate threshold
            f"Success rate: {success_rate:.1f}% ({len(successful)}/{len(results)}), "
            f"Avg: {avg_response_time:.0f}ms, Range: {min_response_time:.0f}-{max_response_time:.0f}ms"
        )
        
        if failed:
            print("   ❌ Failed requests:")
            for failure in failed[:5]:  # Show first 5 failures
                print(f"      - Test {failure['test_id']}: {failure['error']}")
            if len(failed) > 5:
                print(f"      - ... and {len(failed) - 5} more failures")
        
        print()

    def test_rapid_sequential_logins(self, num_requests: int = 20):
        """Test rapid sequential login requests"""
        print(f"⚡ TESTING RAPID SEQUENTIAL LOGINS ({num_requests} requests)")
        print("-" * 60)
        
        session = requests.Session()
        credentials = {
            "email": "demo@pecunia.com",
            "password": "DemoPass789"
        }
        
        results = []
        for i in range(num_requests):
            start_time = time.time()
            try:
                response = session.post(
                    f"{self.api_url}/auth/login",
                    json=credentials,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                end_time = time.time()
                response_time = (end_time - start_time) * 1000
                
                results.append({
                    "success": response.status_code == 200,
                    "response_time": response_time,
                    "status_code": response.status_code
                })
                
            except Exception as e:
                results.append({
                    "success": False,
                    "response_time": None,
                    "error": str(e)
                })
            
            # Small delay to avoid overwhelming the server
            time.sleep(0.1)
        
        successful = [r for r in results if r['success']]
        success_rate = len(successful) / len(results) * 100
        
        if successful:
            avg_response_time = sum(r['response_time'] for r in successful) / len(successful)
        else:
            avg_response_time = 0
        
        self.log_result(
            f"Rapid Sequential Logins ({num_requests})",
            success_rate >= 95,  # Higher threshold for sequential
            f"Success rate: {success_rate:.1f}%, Avg response: {avg_response_time:.0f}ms"
        )
        print()

    def test_network_reliability(self, num_tests: int = 30):
        """Test network reliability over time"""
        print(f"🌐 TESTING NETWORK RELIABILITY ({num_tests} tests over time)")
        print("-" * 60)
        
        results = []
        for i in range(num_tests):
            session = requests.Session()
            
            # Test basic connectivity
            try:
                start_time = time.time()
                response = session.get(f"{self.base_url}/health", timeout=5)
                end_time = time.time()
                response_time = (end_time - start_time) * 1000
                
                results.append({
                    "test_num": i + 1,
                    "success": response.status_code == 200,
                    "response_time": response_time
                })
                
            except Exception as e:
                results.append({
                    "test_num": i + 1,
                    "success": False,
                    "response_time": None,
                    "error": str(e)
                })
            
            # Wait between tests
            time.sleep(1)
            
            # Progress indicator
            if (i + 1) % 10 == 0:
                successful_so_far = sum(1 for r in results if r['success'])
                print(f"   Progress: {i + 1}/{num_tests} tests, {successful_so_far} successful")
        
        successful = [r for r in results if r['success']]
        success_rate = len(successful) / len(results) * 100
        
        if successful:
            avg_response_time = sum(r['response_time'] for r in successful) / len(successful)
            max_response_time = max(r['response_time'] for r in successful)
        else:
            avg_response_time = max_response_time = 0
        
        self.log_result(
            f"Network Reliability ({num_tests} tests)",
            success_rate >= 98,  # Very high threshold for basic connectivity
            f"Success rate: {success_rate:.1f}%, Avg: {avg_response_time:.0f}ms, Max: {max_response_time:.0f}ms"
        )
        print()

    def test_different_user_agents(self):
        """Test with different user agents (simulating different browsers)"""
        print("🌍 TESTING DIFFERENT USER AGENTS")
        print("-" * 60)
        
        user_agents = [
            ("Chrome", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"),
            ("Firefox", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"),
            ("Safari", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15"),
            ("Edge", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59"),
            ("Mobile", "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1")
        ]
        
        credentials = {
            "email": "demo@pecunia.com",
            "password": "DemoPass789"
        }
        
        for browser_name, user_agent in user_agents:
            session = requests.Session()
            session.headers.update({'User-Agent': user_agent})
            
            try:
                start_time = time.time()
                response = session.post(
                    f"{self.api_url}/auth/login",
                    json=credentials,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                end_time = time.time()
                response_time = (end_time - start_time) * 1000
                
                success = response.status_code == 200 and 'access_token' in response.json()
                
                self.log_result(
                    f"Login with {browser_name}",
                    success,
                    f"Status: {response.status_code}, Response time: {response_time:.0f}ms"
                )
                
            except Exception as e:
                self.log_result(
                    f"Login with {browser_name}",
                    False,
                    f"Error: {str(e)}"
                )
        
        print()

    def test_session_management(self):
        """Test session management and token handling"""
        print("🔐 TESTING SESSION MANAGEMENT")
        print("-" * 60)
        
        # Login and get token
        session = requests.Session()
        credentials = {
            "email": "demo@pecunia.com",
            "password": "DemoPass789"
        }
        
        try:
            response = session.post(
                f"{self.api_url}/auth/login",
                json=credentials,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                token = data.get('access_token')
                
                if token:
                    # Test multiple authenticated requests
                    auth_headers = {'Authorization': f'Bearer {token}'}
                    
                    # Test verify endpoint multiple times
                    verify_results = []
                    for i in range(5):
                        try:
                            verify_response = session.get(
                                f"{self.api_url}/auth/verify",
                                headers=auth_headers,
                                timeout=5
                            )
                            verify_results.append(verify_response.status_code == 200)
                        except:
                            verify_results.append(False)
                        time.sleep(0.5)
                    
                    success_rate = sum(verify_results) / len(verify_results) * 100
                    
                    self.log_result(
                        "Token Verification Consistency",
                        success_rate == 100,
                        f"Success rate: {success_rate:.0f}% (5 consecutive requests)"
                    )
                    
                    # Test profile endpoint
                    try:
                        profile_response = session.get(
                            f"{self.api_url}/auth/profile",
                            headers=auth_headers,
                            timeout=5
                        )
                        
                        self.log_result(
                            "Profile Access with Token",
                            profile_response.status_code == 200,
                            f"Status: {profile_response.status_code}"
                        )
                    except Exception as e:
                        self.log_result(
                            "Profile Access with Token",
                            False,
                            f"Error: {str(e)}"
                        )
                else:
                    self.log_result("Session Management", False, "No token received from login")
            else:
                self.log_result("Session Management", False, f"Login failed: {response.status_code}")
                
        except Exception as e:
            self.log_result("Session Management", False, f"Login error: {str(e)}")
        
        print()

    def run_all_tests(self):
        """Run all intermittent issue tests"""
        print("🚀 STARTING INTERMITTENT ISSUES TESTING")
        print("=" * 80)
        
        # Run test suites
        self.test_concurrent_logins(5)  # Start with smaller concurrent load
        self.test_concurrent_logins(10)  # Increase load
        self.test_rapid_sequential_logins(15)
        self.test_network_reliability(20)  # Reduced from 30 for faster testing
        self.test_different_user_agents()
        self.test_session_management()
        
        # Generate summary
        self.generate_summary()

    def generate_summary(self):
        """Generate test summary"""
        print("📊 INTERMITTENT ISSUES TEST SUMMARY")
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
        
        # Analyze response times
        response_times = [r['response_time'] for r in self.test_results if r.get('response_time')]
        if response_times:
            avg_time = sum(response_times) / len(response_times)
            max_time = max(response_times)
            print(f"📈 RESPONSE TIME ANALYSIS:")
            print(f"   Average: {avg_time:.0f}ms")
            print(f"   Maximum: {max_time:.0f}ms")
            print(f"   Samples: {len(response_times)}")
            print()
        
        print("🎯 INTERMITTENT ISSUES ASSESSMENT:")
        if failed_tests == 0:
            print("✅ NO INTERMITTENT ISSUES DETECTED")
            print("   Authentication system appears stable under various conditions")
        elif failed_tests <= 2:
            print("⚠️  MINOR ISSUES DETECTED")
            print("   Some edge cases may cause occasional failures")
        else:
            print("❌ SIGNIFICANT INTERMITTENT ISSUES DETECTED")
            print("   Multiple failure patterns identified - investigation needed")
        
        print()
        print(f"🕐 Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)

if __name__ == "__main__":
    tester = IntermittentIssuesTester()
    tester.run_all_tests()