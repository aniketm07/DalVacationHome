import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('booking')  # Replace 'booking' with your actual DynamoDB table name

def lambda_handler(event, context):
    # Extract emailId from query parameters
    email_id = event.get('queryStringParameters', {}).get('emailId')

    if not email_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Email ID is required'})
        }

    try:
        # Query DynamoDB for bookings with the provided emailId
        response = table.scan(
            FilterExpression='emailId = :email_id',
            ExpressionAttributeValues={':email_id': email_id}
        )

        # Extract the list of items from the response
        items = response.get('Items', [])

        # Return only the list of items
        return {
            'statusCode': 200,
            'body': json.dumps(items)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
