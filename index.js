exports.handler = async (event, context) => {
	let AWS = require('aws-sdk');
	AWS.config.update({
		accessKeyId: process.env.accessKeyId,
		secretAccessKey: process.env.secretAccessKey,
		endpoint: process.env.dynamoEndpoint,
		region: process.env.region
	});

	let ddbClient = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

	console.log('SQS records length ===', event.Records.length);

	for (const record of event.Records) {
		let body = JSON.parse(record.body);
		let data = {
			TableName: 'request_header_and_bodies',
			Item: {
				requestId: body.requestId,
				requestData: JSON.stringify(body)
			}
		};

		try {
			await ddbClient.put(data).promise();
			console.log("Request headers and body successfully posted to dynamodb", body.requestId);
		} catch (err) {
			console.log('failed to post request headers and body to dynamodb', body.requestId, err);
		}
	}
};