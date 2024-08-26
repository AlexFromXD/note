locals {
  vpc_name = "ngrok-test"
  az       = "ap-northeast-1a"
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/24"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = local.vpc_name
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${local.vpc_name}-igw"
  }
}

resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.0.0/28"
  availability_zone       = local.az
  map_public_ip_on_launch = true

  tags = {
    Name = "${local.vpc_name}-public-subnet"
  }
}

resource "aws_route_table" "public_rtb" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${local.vpc_name}-public-rtb"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rtb.id
}

resource "aws_ec2_instance_connect_endpoint" "ec2_connect_endpoint" {
  subnet_id          = aws_subnet.public_subnet.id
  security_group_ids = [aws_security_group.eice.id]
  preserve_client_ip = true

  tags = {
    Name = "${local.vpc_name}-eice"
  }
}
