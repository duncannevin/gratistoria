import { Construct } from 'constructs';
import {
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_s3,
  aws_s3_deployment,
  aws_certificatemanager,
  CfnOutput,
  RemovalPolicy,
  Stack,
} from 'aws-cdk-lib';
import { config } from 'dotenv';

config();

const dist = 'dist/gratistoria/browser';

export class DeployStack extends Stack {
  constructor(scope: Construct, id: string, props?: {}) {
    super(scope, id, props);

    const hostingBucket = new aws_s3.Bucket(this, 'GratitudeBucket', {
      blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const certificate = aws_certificatemanager.Certificate.fromCertificateArn(
      this,
      'GratitudeCertificate',
      process.env.CERT_ARN!
    );

    const distribution = new aws_cloudfront.Distribution(
      this,
      'GratitudeDistribution',
      {
        defaultBehavior: {
          origin:
            aws_cloudfront_origins.S3BucketOrigin.withOriginAccessControl(
              hostingBucket,
            ),
          viewerProtocolPolicy:
          aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: 'index.html',
        domainNames: ['gratistoria.com'], // Add your custom domain
        certificate, // Attach the ACM certificate
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
          },
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
          },
        ],
      },
    );

    new aws_s3_deployment.BucketDeployment(this, 'GratitudeDeployment', {
      sources: [aws_s3_deployment.Source.asset(dist)],
      destinationBucket: hostingBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    new CfnOutput(this, 'GratitudeURL', {
      value: distribution.domainName,
      description: 'The distribution URL',
      exportName: 'GratitudeURL',
    });

    new CfnOutput(this, 'GratitudeBucketName', {
      value: hostingBucket.bucketName,
      description: 'The name of the S3 bucket',
      exportName: 'GratitudeBucketName',
    });
  }
}
