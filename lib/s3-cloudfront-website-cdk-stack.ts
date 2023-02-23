import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import * as path from "path";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
export class S3CloudfrontWebsiteCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);



    // Create S3 bucket 
    const assetsBucket = new Bucket(this, 'Bucket', {
      accessControl: BucketAccessControl.PRIVATE,
      bucketName: "cheetay-demo-bucket23",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    })


    // Add sample file in S3 bucket
    new BucketDeployment(this, 'BucketDeployment', {
      destinationBucket: assetsBucket,
      sources: [Source.asset(path.resolve(__dirname, './dist'))]
    })
    

    const cf = new cloudfront.Distribution(this, "cdnDistribution", {
      defaultBehavior: { origin: new origins.S3Origin(assetsBucket) },

      defaultRootObject: 'index.html',
     // domainNames: ["example-cdn.your-domain.com"],
      //certificate,
    });


    // Get the certificate

    // const certificate = acm.Certificate.fromCertificateArn(
    //   this,
    //   "Certificate",
    //   // found using aws acm list-certificates --region us-east-1
    //   "arn:aws:acm:your-zone:your-id"
    // );

    // Create cloudfront 
    // Create new CloudFront Distribution

    
    // Get the zone

  //  const zone = route53.HostedZone.fromHostedZoneAttributes(
  //     this,
  //     "dennisokeeffe-zone",
  //     {
  //       zoneName: "example-cdn.your-domain.com",
  //       hostedZoneId: "your-zone-id",
  //     }
  //   );
    


     new cdk.CfnOutput(this, "CloudfrontUrl", {
       value: cf.distributionDomainName,
       exportName: "CloudfrontUrl",
    });

  }
}
