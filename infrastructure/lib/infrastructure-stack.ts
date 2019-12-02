import cdk = require("@aws-cdk/core");
import ecr = require("@aws-cdk/aws-ecr");
import ecs = require("@aws-cdk/aws-ecs");
import ec2 = require("@aws-cdk/aws-ec2");
import ecsPatterns = require("@aws-cdk/aws-ecs-patterns");

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ECR repository
    //const repository = new ecr.Repository(this, "sample-express-app", {
    //  repositoryName: "sample-express-app"
    //});

    // ECS cluster/resources
    const cluster = new ecs.Cluster(this, "app-cluster", {
      clusterName: "app-cluster"
    });

    cluster.addCapacity("app-scaling-group", {
      instanceType: new ec2.InstanceType("t2.micro"),
      desiredCapacity: 2
    });

    const loadBalancedService = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, "app-service", {
      cluster,
      memoryLimitMiB: 128,
      cpu: 1,
      desiredCount: 2,
      serviceName: "sample-express-app",
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset("../app"),
        //image: ecs.ContainerImage.fromEcrRepository(repository),
        containerPort: 8080
      },
      publicLoadBalancer: true
    });
  }
}