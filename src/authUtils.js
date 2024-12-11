import AWS, { CognitoIdentityServiceProvider } from 'aws-sdk';

// Set AWS credentials and region
AWS.config.update({
    region: 'us-east-1', // Replace with your Cognito region
    accessKeyId: REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: REACT_APP_SECRET_ACCESS_KEY,
});

// Initialize AWS SDK for Cognito
const cognito = new CognitoIdentityServiceProvider();

/**
 * Fetch user group membership from Cognito
 * @param {string} email - User's email address.
 * @param {string} userPoolId - Cognito User Pool ID.
 * @returns {Promise<string[]>} - A list of groups the user belongs to.
 */
export async function getUserGroups(email, userPoolId) {
    const params = {
        UserPoolId: userPoolId,
        Username: email,
    };

    try {
        const response = await cognito.adminListGroupsForUser(params).promise();
        const groups = response.Groups.map((group) => group.GroupName);
        return groups;
    } catch (error) {
        console.error('Error fetching user groups:', error);
        throw new Error('Unable to fetch user groups');
    }
}
