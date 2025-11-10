import boto3
import json
import os
from typing import Dict, Any
from datetime import datetime
from dotenv import load_dotenv


class BedrockClient:
    """AWS Bedrock client for LLM interactions."""
    
    def __init__(self):
        """Initialize the Bedrock client with credentials from .env file."""
        self.client = None
        self._load_credentials()
    
    def _load_credentials(self):
        """Load AWS credentials from .env file."""
        load_dotenv()
        
        # Try both standard AWS env vars (uppercase) and lowercase versions
        aws_access_key = os.getenv('AWS_ACCESS_KEY_ID') or os.getenv('aws_access_key_id')
        aws_secret_key = os.getenv('AWS_SECRET_ACCESS_KEY') or os.getenv('aws_secret_access_key')
        region = os.getenv('AWS_REGION') or os.getenv('region', 'us-east-1')
        
        if not aws_access_key or not aws_secret_key:
            raise RuntimeError("AWS credentials not found in .env file. Please set aws_access_key_id and aws_secret_access_key")
        
        # Initialize boto3 Bedrock runtime client
        self.client = boto3.client(
            service_name='bedrock-runtime',
            region_name=region,
            aws_access_key_id=aws_access_key,
            aws_secret_access_key=aws_secret_key
        )
        
        print(f"AWS Bedrock client initialized for region: {region}")
    
    def _format_prompt_with_stats(self, prompt: str, stats: Dict[str, Any]) -> str:
        """Format the prompt with stats context."""
        if stats:
            stats_json = json.dumps(stats, indent=2)
            return f"{prompt}\n\nContext Data:\n{stats_json}"
        return prompt
    
    def _build_request_body(self, formatted_prompt: str) -> str:
        """Build the request body for Claude 3 Haiku using Messages API."""
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 2048,
            "temperature": 0.7,
            "messages": [
                {
                    "role": "user",
                    "content": formatted_prompt
                }
            ]
        }
        return json.dumps(body)
    
    def _parse_response(self, response_body: str) -> str:
        """Parse the response from Claude 3 Messages API."""
        response_json = json.loads(response_body)
        return response_json['content'][0]['text']
    
    async def generate(self, prompt: str, stats: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate content using AWS Bedrock Claude 3 Haiku.
        
        Args:
            prompt: The text prompt
            stats: JSON context data (optional)
            
        Returns:
            Dictionary with response, model_used, and timestamp
        """
        if not self.client:
            raise RuntimeError("Bedrock client not initialized")
        
        model_id = "anthropic.claude-3-haiku-20240307-v1:0"
        
        # Format the prompt with stats
        formatted_prompt = self._format_prompt_with_stats(prompt, stats)
        
        # Build request body for Claude 3
        request_body = self._build_request_body(formatted_prompt)
        
        try:
            # Invoke the model
            response = self.client.invoke_model(
                modelId=model_id,
                body=request_body
            )
            
            # Parse the response
            response_body = response['body'].read().decode('utf-8')
            generated_text = self._parse_response(response_body)
            
            return {
                "response": generated_text,
                "model_used": model_id,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
            
        except Exception as e:
            raise RuntimeError(f"Bedrock API error: {str(e)}")


# Global client instance
bedrock_client = BedrockClient()

