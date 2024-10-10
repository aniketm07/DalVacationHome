import json
import boto3
import os

# Initialize boto3 clients
dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')

# Environment variables
ROOMS_TABLE_NAME = os.environ['ROOMS_TABLE_NAME']
BOOKINGS_TABLE_NAME = os.environ['BOOKINGS_TABLE_NAME']
SNS_TOPIC_ARN = os.environ['SNS_TOPIC_ARN']

def lambda_handler(event, context):
    rooms_table = dynamodb.Table(ROOMS_TABLE_NAME)
    bookings_table = dynamodb.Table(BOOKINGS_TABLE_NAME)
    
    for record in event['Records']:
        try:
            # Parse message body from SQS event
            message = json.loads(record['body'])
            
            # Extract necessary information
            booking_id = message['booking_id']
            email = message['email']
            room_id = message['room_id']
            total_amount = message['total_amount']
            payment_status = message['payment_status']
            dates_booked = message['dates_booked']  # New field
            
            # Check room availability in DynamoDB
            response = rooms_table.get_item(
                Key={'room': room_id}
            )
            
            if 'Item' not in response:
                return {
                    'statusCode': 400,
                    'body': json.dumps({
                        'error': f'Room {room_id} is not available.'
                    })
                }
            
            # Update the ReservedDates with new booked dates
            if 'ReservedDates' in response['Item']:
                reserved_dates = response['Item']['ReservedDates']
            else:
                reserved_dates = []
            
            updated_reserved_dates = list(set(reserved_dates + dates_booked))
            
            rooms_table.update_item(
                Key={'room': room_id},
                UpdateExpression="set ReservedDates = :r",
                ExpressionAttributeValues={':r': updated_reserved_dates}
            )
            
            # Add booking information to the bookings table
            bookings_table.put_item(
                Item={
                    'bookingid': booking_id,
                    'email': email,
                    'room_id': room_id,
                    'status': 'Confirmed',
                    'total_amount': total_amount,
                    'payment_status': payment_status,
                    'dates_booked': dates_booked  # New field
                }
            )
            
            # Construct SNS message
            subject = "Booking Confirmation"
            body_text = (f"Dear Customer,\n\n"
                         f"Your booking for room {room_id} has been confirmed.\n"
                         f"Booking ID: {booking_id}\n"
                         f"Total Amount: {total_amount}\n"
                         f"Payment Status: {payment_status}\n"
                         f"Dates Booked: {', '.join(dates_booked)}\n\n"
                         f"Thank you for choosing our service.\n")
                         
            # Publish to SNS
            sns.publish(
                TopicArn=SNS_TOPIC_ARN,
                Message=body_text,
                Subject=subject,
                MessageAttributes={
                    'email': {
                        'DataType': 'String',
                        'StringValue': email
                    }
                }
            )
            
        except Exception as e:
            print(f"Error processing record: {record}")
            print(f"Error message: {str(e)}")
            return {
                'statusCode': 500,
                'body': json.dumps({
                    'error': 'An error occurred',
                    'details': str(e)
                })
            }
    
    return {
        'statusCode': 200,
        'body': json.dumps('Booking confirmation sent successfully.')
    }
