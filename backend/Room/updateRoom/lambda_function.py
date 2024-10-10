import json
import base64
import boto3
import os
from datetime import datetime

# Environment variables
BUCKET_NAME = os.getenv('BUCKET_NAME', 'roomimage')
REGION = os.getenv('REGION', 'us-east-1')
DYNAMODB_TABLE = os.getenv('DYNAMODB_TABLE', 'Rooms')

# Initialize AWS clients
s3_client = boto3.client('s3', region_name=REGION)
dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(DYNAMODB_TABLE)

def upload_image_to_s3(base64_image, room_id):
    try:
        # Add padding if necessary
        missing_padding = len(base64_image) % 4
        if missing_padding != 0:
            base64_image += '=' * (4 - missing_padding)

        image_buffer = base64.b64decode(base64_image)
        image_key = f'rooms/{room_id}-{int(datetime.now().timestamp())}.jpg'
        
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=image_key,
            Body=image_buffer,
            ContentType='image/jpeg'
        )
        
        image_url = f'https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{image_key}'
        return image_url
    
    except Exception as e:
        print(f"S3 upload error: {e}")
        raise e

def lambda_handler(event, context):
    try:
        print("Received event:", event)
        
        if 'body' not in event:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'message': 'Error processing request', 'error': 'Event does not contain body'})
            }
        
        body = json.loads(event['body'])
        print("Parsed body:", body)
        
        room_id = body.get('roomId')
        if not room_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'message': 'Error processing request', 'error': 'Missing room ID'})
            }
        
        # Get the existing item from DynamoDB
        response = table.get_item(Key={'roomId': room_id})
        existing_item = response.get('Item', {})
        
        update_expression = "SET"
        expression_attribute_values = {}

        # Compare existing and new values, and prepare update expression
        fields_to_update = ['roomName', 'roomAddress', 'roomType', 'roomNumber', 'price', 'amenities', 'roomDescription']
        for field in fields_to_update:
            new_value = body.get(field)
            existing_value = existing_item.get(field)
            
            if new_value != existing_value:
                update_expression += f" {field}=:{field},"
                expression_attribute_values[f":{field}"] = new_value
        
        # Handle image update
        base64_image = body.get('base64Image')
        if base64_image:
            image_url = upload_image_to_s3(base64_image, room_id)
            update_expression += " imageUrl=:imageUrl,"
            expression_attribute_values[':imageUrl'] = image_url
        
        if update_expression == "SET":
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'message': 'No changes detected'})
            }
        
        # Remove trailing comma
        update_expression = update_expression.rstrip(',')
        
        # Perform the update
        table.update_item(
            Key={'roomId': room_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': 'Room updated successfully'})
        }
    
    except Exception as error:
        print(f"Error: {error}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': 'Error processing request', 'error': str(error)})
        }
