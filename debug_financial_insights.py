#!/usr/bin/env python3
import asyncio
import aiohttp
import json

async def test_financial_insights():
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
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(
                "https://0edaf726-afb6-4e0f-ac44-d8dc0f57b767.preview.emergentagent.com/api/ai/financial-insights", 
                json=test_data
            ) as response:
                print(f"Status: {response.status}")
                text = await response.text()
                print(f"Response text: {text[:500]}...")
                
                if response.status == 200:
                    try:
                        data = json.loads(text)
                        required_fields = ["summary", "insights", "recommendations", "predictions"]
                        missing_fields = [field for field in required_fields if field not in data]
                        if missing_fields:
                            print(f"Missing fields: {missing_fields}")
                        else:
                            print("All required fields present!")
                            print(f"Insights count: {len(data.get('insights', []))}")
                            print(f"Recommendations count: {len(data.get('recommendations', []))}")
                    except json.JSONDecodeError as e:
                        print(f"JSON decode error: {e}")
                else:
                    print(f"HTTP error: {response.status}")
        except Exception as e:
            print(f"Request error: {e}")

if __name__ == "__main__":
    asyncio.run(test_financial_insights())