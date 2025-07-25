#!/usr/bin/env python3
"""
Test AI Service directly
"""

import asyncio
import sys
import os
sys.path.append('/app/backend')

from ai_service import PecuniaAI

async def test_ai_service():
    try:
        print("Initializing AI service...")
        ai = PecuniaAI()
        print("✅ AI service initialized")
        
        # Test comprehensive analysis
        print("\nTesting comprehensive analysis...")
        test_data = {
            "monthly_income": 7500,
            "monthly_expenses": 4500,
            "pecunia_score": 750,
            "age": 30,
            "risk_tolerance": "medium"
        }
        
        result = await ai.get_comprehensive_financial_analysis(test_data)
        print(f"✅ Comprehensive analysis: {len(str(result))} chars")
        
        # Test smart budget
        print("\nTesting smart budget...")
        budget_data = {
            "monthly_income": 7500,
            "expenses": {"housing": 2000, "food": 600},
            "goals": [{"title": "Emergency Fund", "target": 15000}]
        }
        
        result = await ai.generate_smart_budget(budget_data)
        print(f"✅ Smart budget: {len(str(result))} chars")
        
        return True
        
    except Exception as e:
        print(f"❌ AI service error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    asyncio.run(test_ai_service())