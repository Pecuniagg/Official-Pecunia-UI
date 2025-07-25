#!/usr/bin/env python3
"""
Test OpenAI API directly
"""

import os
import openai
import asyncio
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent / "backend"
load_dotenv(ROOT_DIR / '.env')

async def test_openai():
    try:
        api_key = os.environ.get('OPENAI_API_KEY')
        print(f"API Key loaded: {bool(api_key)}")
        
        client = openai.OpenAI(api_key=api_key)
        
        # Test a simple completion
        response = await asyncio.to_thread(
            client.chat.completions.create,
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say hello in one sentence."}
            ],
            temperature=0.7,
            max_tokens=50
        )
        
        print("✅ OpenAI API working!")
        print(f"Response: {response.choices[0].message.content}")
        return True
        
    except Exception as e:
        print(f"❌ OpenAI API error: {str(e)}")
        return False

if __name__ == "__main__":
    asyncio.run(test_openai())