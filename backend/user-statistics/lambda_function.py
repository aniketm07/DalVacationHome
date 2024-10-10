import json
import boto3

# Initialize boto3 clients
dynamodb = boto3.resource('dynamodb')

# Hardcoded table names
USERS_TABLE_NAME = 'User-DalVacationHome'  # Replace with your actual Users table name
SESSIONS_TABLE_NAME = 'Session-DalVacationHome'  # Replace with your actual Sessions table name

def lambda_handler(event, context):
    users_table = dynamodb.Table(USERS_TABLE_NAME)
    sessions_table = dynamodb.Table(SESSIONS_TABLE_NAME)
    
    try:
        # Scan the Users table to get the total number of users
        total_users_response = users_table.scan(
            Select='COUNT'
        )
        total_users = total_users_response['Count']
        
        # Scan the Sessions table to get the total number of logged-in users
        total_logged_in_users_response = sessions_table.scan(
            Select='COUNT'
        )
        total_logged_in_users = total_logged_in_users_response['Count']
        
        # Construct the response
        response = {
            'total_users': total_users,
            'total_logged_in_users': total_logged_in_users
        }
        
        return {
            'statusCode': 200,
            'body': json.dumps(response),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                'Access-Control-Allow-Credentials': True
            }
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'An error occurred',
                'details': str(e)
            }),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                'Access-Control-Allow-Credentials': True
            }
        }
