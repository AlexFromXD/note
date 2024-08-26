data "aws_ami" "this" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "architecture"
    values = ["arm64"]
  }

  filter {
    name   = "name"
    values = ["al2023-ami-2023*"]
  }
}

resource "aws_instance" "main" {
  ami                  = data.aws_ami.this.id
  instance_type        = "t4g.micro"
  subnet_id            = aws_subnet.public_subnet.id
  iam_instance_profile = aws_iam_instance_profile.this.name

  vpc_security_group_ids = [
    aws_security_group.eice.id
  ]
  tags = {
    Name = "ngrok-server"
  }
}

resource "aws_iam_instance_profile" "this" {
  name = local.vpc_name
  role = aws_iam_role.instance.name
}

resource "aws_iam_role" "instance" {
  name = local.vpc_name
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = ["ec2.amazonaws.com"]
      }
      Action = "sts:AssumeRole"
    }]
  })

  inline_policy {
    name = "basic"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Effect = "Allow"
          Action = [
            "s3:Get*",
            "s3:List*",
          ]
          Resource = [
            aws_s3_bucket.soruce_code.arn,
            "${aws_s3_bucket.soruce_code.arn}/*"
          ]
        }
      ]
    })
  }
}
