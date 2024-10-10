import json
import boto3
import os
import hashlib
import uuid

sqs = boto3.client('sqs')
QUEUE_URL = os.environ.get('QUEUE_URL', '') # replace with your SQS queue URL

def lambda_handler(event, context):
    try:
        if 'body' not in event:
            raise ValueError("Missing 'body' in the event")
        
        booking_details = json.loads(event['body'])
        
        required_fields = ['email', 'room_id', 'dates_booked']  # Updated required fields
        for field in required_fields:
            if field not in booking_details:
                raise ValueError(f"Missing required field: {field}")

        # Generate a unique booking_id
        booking_id = str(uuid.uuid4())

        # Construct the booking details with generated booking_id and payment info
        booking_details_with_id = {
            'booking_id': booking_id,
            'email': booking_details['email'],
            'room_id': booking_details['room_id'],
            'dates_booked': booking_details['dates_booked'],  # Updated field
            'total_amount': booking_details['total_amount'],
            'payment_status': 'Confirmed'
        }

        message_group_id = booking_details['room_id']
        message_deduplication_id = hashlib.md5(json.dumps(booking_details_with_id).encode('utf-8')).hexdigest()

        response = sqs.send_message(
            QueueUrl=QUEUE_URL,
            MessageBody=json.dumps(booking_details_with_id),
            MessageGroupId=message_group_id,
            MessageDeduplicationId=message_deduplication_id
        )
        return {
            'statusCode': 200,
            'isBase64Encoded': True,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'message': 'Booking details added to the queue',
                'messageId': response['MessageId']
            })
        }
    except ValueError as ve:
        return {
            'statusCode': 400,
            'isBase64Encoded': True,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'error': str(ve)
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'isBase64Encoded': True,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'error': 'An error occurred',
                'details': str(e)
            })
        }
