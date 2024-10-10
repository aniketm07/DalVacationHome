import json
import base64
import boto3
import os
from datetime import datetime

# Environment variables
BUCKET_NAME = os.getenv('BUCKET_NAME', 'roomimage')
REGION = os.getenv('REGION', 'us-east-1')
DYNAMODB_TABLE = os.getenv('DYNAMODB_TABLE', 'Rooms')

# AWS clients
s3_client = boto3.client('s3', region_name=REGION)
dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(DYNAMODB_TABLE)

def upload_image_to_s3(base64_image, room_id):
    try:
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
        print("Received event:", json.dumps(event))
        
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
        
        # Extract image data
        base64_image = body.get('base64Image')
        
        if not base64_image:
            print(f"Missing base64Image. base64Image: {base64_image}")
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'message': 'Error processing request', 'error': 'Missing image'})
            }

        # Generate a roomId
        room_id = f"room-{int(datetime.now().timestamp())}"

        # Upload the image to S3 and get the URL
        image_url = upload_image_to_s3(base64_image, room_id)

        # Add roomId, imageUrl, and reservedDates to the payload
        body['roomId'] = room_id
        body['imageUrl'] = image_url
        body['reservedDates'] = []  # Initialize reservedDates as an empty list

        # Save room details to DynamoDB
        table.put_item(Item={
            'roomId': body['roomId'],
            'roomName': body['roomName'],
            'roomAddress': body['roomAddress'],
            'roomType': body['roomType'],
            'roomNumber': body['roomNumber'],
            'price': body['price'],
            'amenities': body['amenities'],
            'roomDescription': body['roomDescription'],
            'imageUrl': body['imageUrl'],
            'reservedDates': body['reservedDates']
        })
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': 'Room added successfully', 'roomId': room_id, 'imageUrl': image_url})
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
